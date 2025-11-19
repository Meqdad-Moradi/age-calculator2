import { Component } from '@angular/core';
import { ProductsHeaderComponent } from './products-header/products-header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-products-page',
  imports: [ProductsHeaderComponent, RouterOutlet],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent {}
