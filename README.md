<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# RTLForge: AI-Powered Digital Design Software for VLSI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-60%25-blue)](https://www.typescriptlang.org/)
[![HTML/CSS](https://img.shields.io/badge/HTML%2FCSS-40%25-orange)](https://developer.mozilla.org/)

RTLForge is an intelligent, AI-powered digital design software platform built to streamline and accelerate VLSI (Very Large Scale Integration) circuit design workflows. By leveraging advanced AI capabilities through Google's Gemini API, RTLForge helps engineers and designers transform conceptual designs into production-ready RTL (Register Transfer Level) code and digital schematics.

## Overview

RTLForge addresses the complexity of modern VLSI design by providing:

- **Intelligent Design Assistance**: AI-powered guidance for circuit design decisions
- **RTL Code Generation**: Automated conversion of design specifications to HDL code
- **Interactive Design Canvas**: Real-time circuit visualization and manipulation
- **Design Verification**: Automated checking and validation of designs
- **Cloud-Based Architecture**: Seamless deployment and accessibility

Whether you're designing microprocessors, memory systems, or complex digital circuits, RTLForge accelerates your design process while maintaining industry-standard quality and compliance.

## Features

### Core Design Features
- **AI-Assisted Circuit Design**: Get intelligent suggestions based on design patterns and best practices
- **HDL Code Generation**: Automatic Verilog/VHDL code generation from high-level specifications
- **Interactive Schematic Editor**: Drag-and-drop circuit design with real-time updates
- **Component Library**: Pre-built standard cells and IP blocks for rapid prototyping
- **Timing Analysis**: AI-driven timing path identification and optimization suggestions
- **Power Analysis**: Integrated power consumption estimation and optimization

### Collaboration & Deployment
- **Cloud-Based Platform**: Access your designs from anywhere
- **Real-time Collaboration**: Work with team members simultaneously
- **Version Control Integration**: Track design iterations seamlessly
- **Export Capabilities**: Generate industry-standard design files (Verilog, VHDL, SPICE)
- **Documentation Generation**: Automatic creation of design documentation

### Development Features
- **TypeScript-Based**: Type-safe, maintainable codebase
- **Angular Framework**: Responsive, modern UI/UX
- **Gemini AI Integration**: Access to state-of-the-art language models
- **Extensible Architecture**: Easy to add custom tools and plugins

## Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0 or higher (comes with Node.js)
- **Gemini API Key** ([Get one free](https://makersuite.google.com/app/apikey))
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

#### Step 1: Clone the Repository
```bash
git clone https://github.com/royalbluee9/RTLForge.git
cd RTLForge
```

#### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages defined in `package.json`, including:
- Angular framework and CLI tools
- TypeScript compiler
- Development dependencies and build tools
- Gemini API client libraries

#### Step 3: Configure API Keys

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local  # if available
```

Edit `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Security Note**: Never commit `.env.local` to version control. It's listed in `.gitignore` for your protection.

#### Step 4: Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:4200`

### Accessing Your Design Studio

Once running locally, you can also view your app in Google AI Studio:
[https://ai.studio/apps/drive/1dDR6XD3Qgs4hCm0bUAX5G1XXuc4y6SDR](https://ai.studio/apps/drive/1dDR6XD3Qgs4hCm0bUAX5G1XXuc4y6SDR)

## Usage Guide

### Basic Workflow

1. **Create a New Project**
   - Click "New Project" and provide a project name
   - Select design type (Digital Logic, Microprocessor, Memory, etc.)
   - Configure project parameters (technology node, design rules, etc.)

2. **Design with AI Assistance**
   - Describe your circuit requirements in natural language
   - RTLForge AI will suggest design patterns and optimizations
   - Use the interactive canvas to visualize and modify designs

3. **Generate and Verify RTL**
   - Review AI-generated HDL code
   - Run built-in verification checks
   - Export verified code in your preferred format

4. **Collaborate and Document**
   - Share projects with team members
   - Generate comprehensive design documentation
   - Track all design iterations

### Example: Designing an 8-bit Adder

```
User Input: "Create an 8-bit ripple carry adder with overflow detection"

AI Response:
- Suggests ripple-carry architecture (simple, widely-used)
- Generates parameterized Verilog code
- Identifies critical timing path
- Recommends optimization techniques

Generated Output:
- Verilog/VHDL code ready for synthesis
- Timing constraints and area estimates
- Design documentation
```

## Project Structure

```
RTLForge/
├── src/
│   ├── app/
│   │   ├── components/        # Angular components
│   │   ├── services/          # Business logic and API services
│   │   ├── models/            # Data models and interfaces
│   │   └── app.module.ts      # Main application module
│   ├── assets/                # Images, icons, and static files
│   ├── styles/                # Global CSS/SCSS styles
│   └── main.ts                # Application entry point
├── angular.json               # Angular CLI configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Node.js dependencies and scripts
├── README.md                  # This file
└── .gitignore                 # Git ignore rules
```

### Key Directories Explained

- **components/**: Reusable UI components (canvas, toolbar, property panels, etc.)
- **services/**: Core logic for design processing, AI integration, and file handling
- **models/**: TypeScript interfaces defining circuit elements, projects, and designs
- **assets/**: Graphics, icons, and embedded resources

## Technology Stack

### Frontend
- **Angular 18+**: Modern, reactive web framework
- **TypeScript**: Strongly-typed JavaScript for maintainability
- **Angular Material**: Professional UI component library
- **RxJS**: Reactive programming for asynchronous operations

### Backend Integration
- **Google Gemini API**: Advanced LLM for design assistance
- **REST APIs**: For cloud synchronization and collaboration

### Development Tools
- **Node.js**: JavaScript runtime
- **npm**: Package manager
- **TypeScript Compiler**: Type checking and transpilation
- **Angular CLI**: Development and build automation

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run unit tests
npm run test

# Run end-to-end tests
npm run e2e

# Run linter
npm run lint
```

### Development Server

The development server supports:
- **Hot Module Replacement (HMR)**: Changes reflect instantly without reload
- **Source Maps**: Debug TypeScript directly in browser DevTools
- **Proxy Support**: Configure backend API routing

### Build Process

Production builds include:
- Code bundling and minification
- Tree-shaking for reduced bundle size
- Ahead-of-Time (AOT) compilation
- Source map generation for debugging

## Key Capabilities

### AI-Powered Design Assistance

**Natural Language Processing**
- Describe circuits in plain English
- AI understands design intent and constraints
- Generates multiple design alternatives

**Intelligent Code Generation**
- Parameterized Verilog/VHDL templates
- Automatic optimization suggestions
- Industry-standard best practices

### Real-time Analysis

**Timing Analysis**
- Critical path identification
- Slack calculation
- Timing constraint specification

**Power Analysis**
- Dynamic power estimation
- Leakage power calculation
- Power optimization suggestions

**Area Analysis**
- Gate count estimation
- Cell area prediction
- Design space exploration

## Deployment

### Cloud Deployment (Google Cloud)

RTLForge is deployed on Google Cloud Platform with:
- 6 active deployments for reliability
- GitHub Pages for documentation
- Automatic CI/CD through GitHub Actions

### Local Development

```bash
npm run dev          # Development server at localhost:4200
npm run build        # Production build to dist/ folder
npm run start        # Run production build locally
```

### Docker Support (Optional)

For containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4200
CMD ["npm", "run", "serve"]
```

## Contributing

We welcome contributions from the VLSI design community! Here's how to get involved:

### Contribution Guidelines

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/RTLForge.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow TypeScript style guidelines
   - Add tests for new functionality
   - Update documentation as needed

4. **Commit with Clear Messages**
   ```bash
   git commit -m "feat: Add support for VHDL code generation"
   ```

5. **Push and Create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Areas for Contribution

- Component library expansion
- AI model optimization
- UI/UX improvements
- Documentation and tutorials
- Bug fixes and performance optimization
- Support for additional HDL formats

## Bug Reports & Feature Requests

Found an issue or have a great idea?

- **Report Bugs**: [Open an Issue](https://github.com/royalbluee9/RTLForge/issues)
- **Request Features**: [Start a Discussion](https://github.com/royalbluee9/RTLForge/discussions)
- **Security Concerns**: [View Security Policy](https://github.com/royalbluee9/RTLForge/security)

## Documentation

Comprehensive documentation is available:

- **[Getting Started Guide](https://github.com/royalbluee9/RTLForge/wiki/Getting-Started)**: Step-by-step setup
- **[API Documentation](https://github.com/royalbluee9/RTLForge/wiki/API)**: Component and service APIs
- **[Design Tutorials](https://github.com/royalbluee9/RTLForge/wiki/Tutorials)**: Hands-on design examples
- **[FAQ](https://github.com/royalbluee9/RTLForge/wiki/FAQ)**: Common questions and troubleshooting

## Project Statistics

- **Language**: TypeScript (60%), HTML (40%)
- **Active Deployments**: 6
- **Contributors**: Open for collaboration
- **License**: MIT

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Permissions:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

Conditions:
- 📋 License and copyright notice required

## Acknowledgments

- **Google Gemini API**: For advanced AI capabilities
- **Angular Team**: For the excellent framework
- **VLSI Community**: For inspiration and feedback
- **Contributors**: For helping make RTLForge better

## Support

Need help?

- **GitHub Discussions**: [Ask questions](https://github.com/royalbluee9/RTLForge/discussions)
- **Issues Tracker**: [Report problems](https://github.com/royalbluee9/RTLForge/issues)
- **Documentation**: [Read the wiki](https://github.com/royalbluee9/RTLForge/wiki)
- **Email**: Contact the maintainers

## Quick Links

- [View Live Demo](https://ai.studio/apps/drive/1dDR6XD3Qgs4hCm0bUAX5G1XXuc4y6SDR)
- [Report Issues](https://github.com/royalbluee9/RTLForge/issues)
- [View Deployments](https://github.com/royalbluee9/RTLForge/deployments)
- [GitHub Repository](https://github.com/royalbluee9/RTLForge)

---

<div align="center">

**RTLForge** - Making VLSI Design Intelligent, Fast, and Accessible

⭐ If you find RTLForge helpful, please consider starring the repository!

</div>
