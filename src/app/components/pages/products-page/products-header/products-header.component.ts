import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-products-header',
  imports: [MatIcon, MatButtonModule, MatBadgeModule, RouterLink],
  templateUrl: './products-header.component.html',
  styleUrl: './products-header.component.scss',
})
export class ProductsHeaderComponent {}
