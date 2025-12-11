import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

export interface HdlFile {
  filename: string;
  language: string;
  code: string;
}

export interface GeneratedOutput {
  rtlCode?: HdlFile;
  testbench?: HdlFile;
  testCases?: HdlFile;
  designSpec?: HdlFile;
  functionalCoverage?: HdlFile;
  svaAssertions?: HdlFile;
  simulationScripts?: HdlFile;
  performanceReport?: HdlFile;
  testPlan?: HdlFile;
  stateDiagram?: HdlFile;
  explorationResult?: HdlFile;
  scoreboardLog?: HdlFile;
  waveformSummary?: HdlFile;
  outputTable?: HdlFile;
  synthesisReport?: HdlFile;
  lintReport?: HdlFile;
}

export interface Deliverable {
  id: keyof GeneratedOutput;
  name: string;
  checked: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HdlGeneratorService {
  private readonly ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async processRequest(
    mode: 'generate' | 'explore',
    description: string,
    hdlLanguage: 'VHDL' | 'Verilog',
    deliverables: string[],
    protocol: string,
    architecture: string,
    simulationTool: string,
    thinkingMode: boolean
  ): Promise<GeneratedOutput> {
    if (mode === 'explore') {
      return this.exploreArchitecture(description, thinkingMode);
    }
    return this.generateHdl(description, hdlLanguage, deliverables, protocol, architecture, simulationTool, thinkingMode);
  }

  private async generateHdl(
    description: string,
    hdlLanguage: 'VHDL' | 'Verilog',
    deliverables: string[],
    protocol: string,
    architecture: string,
    simulationTool: string,
    thinkingMode: boolean
  ): Promise<GeneratedOutput> {

    const fileSchema = {
      type: Type.OBJECT,
      properties: {
        filename: { type: Type.STRING, description: "The filename for the content, e.g., 'counter.v' or 'spec.md'." },
        language: { type: Type.STRING, description: "The language identifier, e.g., 'Verilog', 'Markdown', 'Mermaid', 'Text'." },
        code: { type: Type.STRING, description: "The complete, syntactically correct code or document content." },
      },
      required: ['filename', 'language', 'code'],
    };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        rtlCode: fileSchema,
        testbench: fileSchema,
        testCases: fileSchema,
        designSpec: fileSchema,
        functionalCoverage: fileSchema,
        svaAssertions: fileSchema,
        simulationScripts: fileSchema,
        performanceReport: fileSchema,
        testPlan: fileSchema,
        stateDiagram: fileSchema,
        scoreboardLog: fileSchema,
        waveformSummary: fileSchema,
        outputTable: fileSchema,
        synthesisReport: fileSchema,
        lintReport: fileSchema,
      },
    };

    const prompt = this.buildPrompt(description, hdlLanguage, deliverables, protocol, architecture, simulationTool);
    const modelName = 'gemini-2.5-flash';
    const config: any = {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
    };

    if (!thinkingMode) {
      config.thinkingConfig = { thinkingBudget: 0 };
    }

    let jsonText: string;
    try {
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: config,
      });
      jsonText = response.text.trim();
    } catch (error: any) {
      console.error('Gemini API call failed:', error);
      // The SDK might throw errors with useful messages for things like API keys or rate limits.
      throw new Error(`API Error: ${error.message || 'An unknown error occurred with the AI service.'}`);
    }
    
    if (!jsonText) {
        throw new Error('The AI model returned an empty response. This might be due to a content safety filter or an issue with the prompt. Please try again or adjust your request.');
    }

    try {
      const parsedJson = JSON.parse(jsonText);
      const cleanOutput: GeneratedOutput = {};
      for (const key in parsedJson) {
        if (Object.prototype.hasOwnProperty.call(parsedJson, key) && parsedJson[key]) {
          cleanOutput[key as keyof GeneratedOutput] = parsedJson[key];
        }
      }
      return cleanOutput;
    } catch (error) {
        console.error('Failed to parse JSON response from AI:', error);
        console.error('Received invalid JSON:', jsonText);
        throw new Error('The AI model returned a response that was not valid JSON. This can happen on complex requests. Please try again.');
    }
  }
  
  private async exploreArchitecture(description: string, thinkingMode: boolean): Promise<GeneratedOutput> {
     const prompt = `
      You are a Senior Principal Digital Design Architect with decades of experience.
      A junior engineer has come to you with the following design problem. Your task is to explore and propose multiple microarchitectural approaches to solve it.

      Problem Statement:
      "${description}"

      Your Task:
      1.  Thoroughly analyze the problem statement.
      2.  Propose at least two distinct and viable microarchitectural solutions.
      3.  For each proposed architecture, provide a clear, high-level description of its structure and operation. Use bullet points and simple diagrams if it helps clarity.
      4.  Create a comparison table or section that analyzes the trade-offs between the proposed solutions. Key comparison points should include:
          - Performance (e.g., latency, throughput, max frequency).
          - Area/Resource Usage (estimated complexity, number of flops/LUTs).
          - Power Consumption (qualitative assessment).
          - Complexity (design effort, verification complexity).
      5.  Conclude with a recommendation on which architecture to proceed with and why, based on a likely set of design goals (e.g., if the goal is low power, recommend one; if it's high performance, recommend another).

      Format your response in clear, well-structured Markdown.
    `;
    const modelName = 'gemini-2.5-flash';
    const config: any = {};
    
    if (!thinkingMode) {
      config.thinkingConfig = { thinkingBudget: 0 };
    }

    let responseText: string;
    try {
        const response = await this.ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: config,
        });
        responseText = response.text;
    } catch (error: any) {
        console.error('Gemini API call failed:', error);
        throw new Error(`API Error: ${error.message || 'An unknown error occurred with the AI service.'}`);
    }

    if (!responseText || !responseText.trim()) {
        throw new Error('The AI model returned an empty response. This might be due to a content safety filter or an issue with the prompt. Please try again or adjust your request.');
    }

    return {
        explorationResult: {
            filename: 'Architecture_Exploration.md',
            language: 'Markdown',
            code: responseText,
        }
    };
  }

  private buildPrompt(
    description: string,
    hdlLanguage: string,
    deliverables: string[],
    protocol: string,
    architecture: string,
    simulationTool: string
  ): string {
    const deliverableList = deliverables.map(d => {
        switch(d) {
            case 'rtlCode': return `RTL Code in ${hdlLanguage}`;
            case 'testbench': return 'SystemVerilog/UVM Testbench';
            case 'testCases': return 'Test Cases Description (in Markdown)';
            case 'designSpec': return 'Design Specification (in Markdown)';
            case 'functionalCoverage': return 'Functional Coverage Model (SystemVerilog)';
            case 'svaAssertions': return 'SystemVerilog Assertions (SVA)';
            case 'simulationScripts': return `Simulation Scripts for ${simulationTool}`;
            case 'performanceReport': return 'Performance and Resource Analysis Report (Markdown)';
            case 'testPlan': return 'Verification Test Plan (in Markdown)';
            case 'stateDiagram': return 'State Diagram (in Mermaid.js syntax)';
            case 'scoreboardLog': return 'Example Scoreboard Log (Plain Text)';
            case 'waveformSummary': return 'Waveform Behavior Summary (in Markdown)';
            case 'outputTable': return 'Test Results Summary Table (in Markdown)';
            case 'synthesisReport': return 'Synthesis & Timing Report (in Markdown)';
            case 'lintReport': return 'RTL Lint & Code Quality Report (in Markdown)';
            default: return d;
        }
    }).join(', ');

    const protocolInfo = protocol !== 'None' ? `- Interface Protocol: ${protocol}` : '';
    const architectureInfo = architecture !== 'None' ? `- Target Architecture: ${architecture}` : '';
    const simToolInfo = deliverables.includes('simulationScripts') ? `- Target Simulator: ${simulationTool}` : '';

    return `
      You are an expert Hardware Design and Verification Engineer AI assistant. Your role is to help users develop, verify, and test digital designs.
      Follow best practices for synthesizable, modular, and well-documented code.

      User's Design Request:
      "${description}"

      Generation Task:
      - Target RTL Language: ${hdlLanguage}
      - Verification Environment: SystemVerilog with UVM.
      ${protocolInfo}
      ${architectureInfo}
      ${simToolInfo}
      - Required Deliverables: ${deliverableList}.

      Instructions:
      1.  Analyze the user's request and generate all the required deliverables.
      2.  Ensure all generated code is syntactically correct and complete.
      3.  For testbenches, create a comprehensive UVM-based environment.
      4.  For documentation (like specs or reports), use Markdown format.
      5.  If a state diagram is requested, generate it using valid Mermaid.js 'stateDiagram-v2' syntax. Place notes on separate lines, not within transition labels. Example of a correct note: 'note right of IDLE: This is the reset state.'. Set the 'language' property to 'Mermaid'.
      6.  For advanced verification deliverables:
          - Scoreboard Log: Generate a sample plain text log from a UVM scoreboard. Show transaction comparisons with PASS/FAIL status.
          - Waveform Summary: Create a Markdown document describing expected behaviors of critical signals during key operations.
          - Output Table: Generate a Markdown table that summarizes test cases, including columns for Test Name, Description, and an example Pass/Fail Status.
      7.  For advanced analysis deliverables:
          - Synthesis Report: Provide a Markdown report estimating resource usage (LUTs, FFs, BRAMs, DSPs) and identify potential timing critical paths. Discuss potential synthesis optimizations.
          - Lint Report: Generate a Markdown report analyzing the RTL code for potential issues like non-synthesizable constructs, style violations, or common pitfalls.
      8.  Return the output as a single, valid JSON object that adheres to the provided schema. Do not include any text, markdown formatting, or code blocks before or after the JSON object.
      9.  Only generate properties in the JSON for the deliverables that were explicitly requested.
    `;
  }
}