
import { Component, ChangeDetectionStrategy, input, effect, ElementRef, viewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const mermaid: any;

@Component({
  selector: 'app-mermaid-display',
  imports: [CommonModule],
  template: `
    <div class="p-4 overflow-auto h-full flex items-center justify-center">
      @if (errorMessage()) {
        <div class="text-red-400 bg-red-900/50 p-4 rounded-md">
          <p class="font-bold">Could not render diagram:</p>
          <pre class="mt-2 text-xs">{{ errorMessage() }}</pre>
        </div>
      } @else {
        <div #mermaidContainer class="w-full h-full"></div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MermaidDisplayComponent {
  graphDefinition = input.required<string>();
  mermaidContainer = viewChild<ElementRef<HTMLDivElement>>('mermaidContainer');
  // FIX: errorMessage should be a signal to hold state, not an effect. `effect` does not return a WritableSignal.
  errorMessage = signal<string | null>(null);

  constructor() {
    effect(async () => {
      const container = this.mermaidContainer();
      const graph = this.graphDefinition();
      if (container && graph) {
        try {
          const { svg } = await mermaid.render(`mermaid-graph-${Date.now()}`, graph);
          container.nativeElement.innerHTML = svg;
          // FIX: Call set() on the signal.
          this.errorMessage.set(null);
        } catch (e: any) {
          console.error("Mermaid rendering error:", e);
          // FIX: Call set() on the signal.
          this.errorMessage.set(e.message || 'Unknown error');
        }
      }
    });
  }
}
