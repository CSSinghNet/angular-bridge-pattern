// src/app/shared/wrapper/wrapper.component.ts
import { Component, computed, contentChild, inject, signal } from '@angular/core';
import { REFRESH_TOKEN, Refreshable } from '../refresh.token';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  template: `
    <div class="wrapper">
      <!-- Projected child content -->
      <ng-content></ng-content>

      <!-- Controls -->
      <div class="controls">
        <button (click)="load()">Load Data</button>
        <button (click)="refresh()">Refresh</button>
        @if (hasBridge()) {
          <span class="status">Active bridge ready</span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .wrapper {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 16px;
        margin: 16px 0;
        background: #f9f9f9;
      }
      .controls {
        margin-top: 16px;
        display: flex;
        gap: 12px;
      }
      button {
        padding: 8px 16px;
        cursor: pointer;
      }
      .status {
        color: green;
        font-style: italic;
      }
    `,
  ],
})
export class WrapperComponent {
  // Primary: DI from child provider (lightweight & preferred)
  private injectedBridge = inject(REFRESH_TOKEN, { optional: true });

  // Fallback/Safety: contentChild signal query (for projected child typing)
  private projectedBridge = contentChild<Refreshable>(REFRESH_TOKEN);

  // Computed: best bridge (injected > projected)
  private activeBridge = computed<Refreshable | undefined>(
    () => this.injectedBridge ?? this.projectedBridge(),
  );

  // Reactive check
  hasBridge = computed(() => !!this.activeBridge());

  // Status for demo
  wrapperStatus = signal('Wrapper ready');

  load() {
    const bridge = this.activeBridge();
    if (bridge) {
      bridge.load();
      this.wrapperStatus.set('Load triggered');
    } else {
      console.warn('No Refreshable child found in wrapper');
      this.wrapperStatus.set('No child available');
    }
  }

  refresh() {
    const bridge = this.activeBridge();
    if (bridge) {
      bridge.refresh();
      this.wrapperStatus.set('Refresh triggered');
    } else {
      console.warn('No Refreshable child found in wrapper');
    }
  }
}
