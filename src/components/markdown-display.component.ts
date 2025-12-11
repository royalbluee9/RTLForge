
import { Component, ChangeDetectionStrategy, input, computed, inject, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare const marked: any;

@Component({
  selector: 'app-markdown-display',
  template: `
    <div class="p-6 overflow-y-auto h-full markdown-body" [innerHTML]="renderedContent()"></div>
  `,
  styles: [`
    :host .markdown-body {
      line-height: 1.6;
    }
    :host .markdown-body h1,
    :host .markdown-body h2,
    :host .markdown-body h3 {
      border-bottom: 1px solid #334155; /* slate-700 */
      padding-bottom: 0.3em;
      margin-top: 1.5em;
      margin-bottom: 1em;
      font-weight: 600;
    }
     :host .markdown-body h1 { font-size: 2em; }
     :host .markdown-body h2 { font-size: 1.5em; }
     :host .markdown-body h3 { font-size: 1.25em; }

    :host .markdown-body p {
      margin-bottom: 1em;
    }

    :host .markdown-body code {
      background-color: #1e293b; /* slate-800 */
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    :host .markdown-body pre {
      background-color: #0f172a; /* slate-900 */
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 1em;
    }
    
    :host .markdown-body pre code {
      background-color: transparent;
      padding: 0;
      margin: 0;
      font-size: 100%;
    }

    :host .markdown-body ul, :host .markdown-body ol {
      padding-left: 2em;
      margin-bottom: 1em;
    }

    :host .markdown-body li {
      margin-top: 0.25em;
    }
    
    :host .markdown-body blockquote {
        padding: 0 1em;
        color: #94a3b8; /* slate-400 */
        border-left: 0.25em solid #334155; /* slate-700 */
        margin: 0 0 1em 0;
    }

    :host .markdown-body table {
        display: block;
        width: 100%;
        overflow: auto;
        margin-bottom: 1em;
    }
    :host .markdown-body tr {
        background-color: #1e293b; /* slate-800 */
        border-top: 1px solid #334155; /* slate-700 */
    }
    :host .markdown-body th, :host .markdown-body td {
        padding: 6px 13px;
        border: 1px solid #334155; /* slate-700 */
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownDisplayComponent {
  content = input.required<string>();
  // FIX: Explicitly typing the `sanitizer` property with `DomSanitizer` resolves a TypeScript error where its type was incorrectly inferred as `unknown`.
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  renderedContent = computed<SafeHtml>(() => {
    if (typeof marked === 'undefined') {
        // FIX: The computed signal must return a SafeHtml object, not a raw string, to match the declared type.
        return this.sanitizer.bypassSecurityTrustHtml('Markdown library not loaded.');
    }
    const rawHtml = marked.parse(this.content() || '');
    const sanitizedHtml = this.sanitizer.sanitize(SecurityContext.HTML, rawHtml);
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml || '');
  });
}
