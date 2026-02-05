// src/app/shared/com1/com1.component.ts
import { Component, signal } from '@angular/core';
import { REFRESH_TOKEN, Refreshable } from '../../refresh.token';

@Component({
  selector: 'app-com-one',
  standalone: true,
  template: `
    <div class="com1">
      <h3>Component One Content</h3>
      <p>Data status: {{ status() }}</p>
    </div>
  `,
  styles: [`.com1 { border: 2px solid blue; padding: 16px; }`],
  providers: [
    { provide: REFRESH_TOKEN, useExisting: ComOneComponent }
  ]
})
export class ComOneComponent implements Refreshable {
  status = signal('Idle');

  load() {
    this.status.set('Loading...');
    setTimeout(() => {
      this.status.set('Com1 Loaded ✅');
      console.log('Com1: Data loaded');
    }, 1500);
  }

  refresh() {
    this.status.set('Refreshing...');
    setTimeout(() => {
      this.status.set('Com1 Refreshed 🔄');
      console.log('Com1: Refreshed');
    }, 1000);
  }
}