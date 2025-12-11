import { Component, ChangeDetectionStrategy, signal, inject, computed, WritableSignal, Signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HdlGeneratorService, GeneratedOutput, Deliverable } from './services/hdl-generator.service';
import { CodeDisplayComponent } from './components/code-display.component';
import { MermaidDisplayComponent } from './components/mermaid-display.component';
import { MarkdownDisplayComponent } from './components/markdown-display.component';
import { PersistenceService, AppState } from './services/persistence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, CodeDisplayComponent, MermaidDisplayComponent, MarkdownDisplayComponent],
})
export class AppComponent {
  private hdlGeneratorService = inject(HdlGeneratorService);
  private persistenceService = inject(PersistenceService);

  // Form State Signals
  description: WritableSignal<string>;
  hdlLanguage: WritableSignal<'VHDL' | 'Verilog'>;
  protocol: WritableSignal<string>;
  architecture: WritableSignal<string>;
  simulationTool: WritableSignal<string>;
  thinkingMode: WritableSignal<boolean>;
  operationMode: WritableSignal<'generate' | 'explore'>;
  
  availableDeliverables: Deliverable[] = [
    { id: 'rtlCode', name: 'VHDL/Verilog Code', checked: true },
    { id: 'testbench', name: 'UVM Testbench', checked: true },
    { id: 'testPlan', name: 'Test Plan', checked: false },
    { id: 'stateDiagram', name: 'State Diagram', checked: false },
    { id: 'functionalCoverage', name: 'Func. Coverage', checked: false },
    { id: 'svaAssertions', name: 'SVA Assertions', checked: false },
    { id: 'simulationScripts', name: 'Sim Scripts', checked: false },
    { id: 'designSpec', name: 'Design Spec', checked: false },
    { id: 'synthesisReport', name: 'Synthesis Report', checked: false},
    { id: 'lintReport', name: 'Lint Report', checked: false },
    { id: 'scoreboardLog', name: 'Scoreboard Log', checked: false },
    { id: 'waveformSummary', name: 'Waveform Summary', checked: false },
    { id: 'outputTable', name: 'Output Table', checked: false },
  ];
  deliverables: WritableSignal<Deliverable[]>;

  // Application State Signals
  isLoading = signal(false);
  error = signal<string | null>(null);
  generatedOutput = signal<GeneratedOutput | null>(null);
  activeTab = signal<string | null>(null);
  loadingMessage = signal('Initializing AI assistant...');

  examplePrompts = [
    'Design a 4-bit synchronous up-counter with an active-high reset.',
    'Create an SPI master controller with configurable clock polarity and phase.',
    'A simple arbiter for two request signals with a fixed-priority scheme.',
    'An 8-bit wide, 32-deep synchronous FIFO with AXI-Stream interfaces.'
  ];

  private loadingInterval: any;

  constructor() {
    const savedState = this.persistenceService.loadState();
    this.description = signal(savedState?.description || 'Design a 4-bit synchronous up-counter with an active-high reset.');
    this.hdlLanguage = signal(savedState?.hdlLanguage || 'Verilog');
    this.protocol = signal(savedState?.protocol || 'None');
    this.architecture = signal(savedState?.architecture || 'None');
    this.simulationTool = signal(savedState?.simulationTool || 'ModelSim');
    this.thinkingMode = signal(savedState?.thinkingMode || false);
    this.operationMode = signal(savedState?.operationMode || 'generate');
    
    // Restore deliverables state or use default
    const savedDeliverables = savedState?.deliverables;
    if (savedDeliverables) {
        // Map saved state onto available deliverables to preserve order and content
        const restoredDeliverables = this.availableDeliverables.map(ad => {
            const saved = savedDeliverables.find(sd => sd.id === ad.id);
            return saved ? { ...ad, checked: saved.checked } : ad;
        });
        this.deliverables = signal(restoredDeliverables);
    } else {
        this.deliverables = signal(this.availableDeliverables);
    }

    // Effect to save state whenever it changes
    effect(() => {
      const currentState: AppState = {
        description: this.description(),
        hdlLanguage: this.hdlLanguage(),
        protocol: this.protocol(),
        architecture: this.architecture(),
        simulationTool: this.simulationTool(),
        thinkingMode: this.thinkingMode(),
        operationMode: this.operationMode(),
        deliverables: this.deliverables()
      };
      this.persistenceService.saveState(currentState);
    });
  }

  selectedDeliverables: Signal<string[]> = computed(() => 
    this.deliverables().filter(d => d.checked).map(d => d.id)
  );

  simulationScriptsSelected: Signal<boolean> = computed(() => 
    this.selectedDeliverables().includes('simulationScripts')
  );

  outputFiles = computed(() => {
    const output = this.generatedOutput();
    if (!output) return [];
    return Object.entries(output).flatMap(([key, value]) =>
      (value && typeof value === 'object' && 'filename' in value) ? [{ key, ...value as any }] : []
    );
  });

  async processRequest(): Promise<void> {
    if (this.isLoading() || !this.description().trim()) {
      return;
    }
    this.startLoading();
    this.error.set(null);
    this.generatedOutput.set(null);

    try {
      const result = await this.hdlGeneratorService.processRequest(
        this.operationMode(),
        this.description(),
        this.hdlLanguage(),
        this.selectedDeliverables(),
        this.protocol(),
        this.architecture(),
        this.simulationTool(),
        this.thinkingMode()
      );
      this.generatedOutput.set(result);
      // Set active tab to the first generated file
      const firstKey = Object.keys(result)[0];
      if (firstKey) {
        this.activeTab.set(firstKey);
      }
    } catch (err) {
      console.error('Error processing request:', err);
      const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred. Please check the console for details.';
      this.error.set(`Failed to generate content. ${errorMessage}`);
    } finally {
      this.stopLoading();
    }
  }

  toggleDeliverable(index: number): void {
    this.deliverables.update(current => {
      const updated = [...current];
      updated[index] = { ...updated[index], checked: !updated[index].checked };
      return updated;
    });
  }

  setExampleDescription(example: string): void {
    this.description.set(example);
  }

  setActiveTab(key: string): void {
    this.activeTab.set(key);
  }

  private startLoading(): void {
    this.isLoading.set(true);
    const messages = this.operationMode() === 'generate'
      ? [
          'Analyzing requirements...',
          'Synthesizing RTL...',
          'Building UVM environment...',
          'Generating assertions & coverage...',
          'Writing simulation scripts...',
          'Finalizing documentation...'
        ]
      : [
          'Considering architectural trade-offs...',
          'Evaluating performance characteristics...',
          'Analyzing area and power constraints...',
          'Formulating design proposals...',
          'Comparing implementation strategies...'
        ];
    let i = 0;
    this.loadingMessage.set(messages[i]);
    this.loadingInterval = setInterval(() => {
      i = (i + 1) % messages.length;
      this.loadingMessage.set(messages[i]);
    }, 2500);
  }

  private stopLoading(): void {
    this.isLoading.set(false);
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
    }
  }
}