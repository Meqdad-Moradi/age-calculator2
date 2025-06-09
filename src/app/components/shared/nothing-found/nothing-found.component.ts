import { Component, input } from '@angular/core';

@Component({
  selector: 'app-nothing-found',
  imports: [],
  templateUrl: './nothing-found.component.html',
  styleUrl: './nothing-found.component.scss',
})
export class NothingFoundComponent {
  message = input<string>('Nothing found!');
}
