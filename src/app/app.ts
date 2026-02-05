import { Component, signal } from '@angular/core';
import { WrapperComponent } from './shared/wrapper/wrapper.component';
import { ComOneComponent } from './shared/wrapper/com-one/com-one.component';
import { ComTwoComponent } from './shared/wrapper/com-two/com-two.component';

@Component({
  selector: 'app-root',
  imports: [WrapperComponent, ComOneComponent, ComTwoComponent],
  template: `<!-- example-page.component.html -->
    <h2>Polymorphic Wrapper Demo</h2>

    <app-wrapper>
      <app-com-one />
    </app-wrapper>

    <app-wrapper>
      <app-com-two />
    </app-wrapper>

    <!-- Bonus: empty wrapper test -->
    <app-wrapper>
      <!-- No child → warn in console -->
    </app-wrapper>`,
})
export class App {
  protected readonly title = signal('angular-bridge-pattern');
}
