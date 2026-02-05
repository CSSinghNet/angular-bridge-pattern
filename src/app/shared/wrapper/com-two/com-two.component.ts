// src/app/shared/com2/com2.component.ts
import { Component, signal } from '@angular/core';
import { REFRESH_TOKEN, Refreshable } from '../../refresh.token';

@Component({
  selector: 'app-com-two',
  standalone: true,
  template: `
    <div class="com2">
      <h3>Component Two Content</h3>
      <p>Data status: {{ status() }}</p>
    </div>
  `,
  styles: [`.com2 { border: 2px solid green; padding: 16px; }`],
  providers: [
    { provide: REFRESH_TOKEN, useExisting: ComTwoComponent }
  ]
})
export class ComTwoComponent implements Refreshable {
  status = signal('Ready');

  load() {
    this.status.set('Fetching...');
    setTimeout(() => {
      this.status.set('Com2 Loaded 🚀');
    }, 1200);
  }

  refresh() {
    this.status.set('Reloading...');
    setTimeout(() => {
      this.status.set('Com2 Refreshed ♻️');
    }, 800);
  }
}