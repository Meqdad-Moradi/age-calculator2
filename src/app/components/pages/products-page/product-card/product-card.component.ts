import { Component, input, output } from '@angular/core';
import { Product } from '../../../models/products';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-card',
  imports: [MatButtonModule, CurrencyPipe, MatIcon, NgClass, MatTooltip],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  public product = input<Product>();
  public addProductToCart = output<Product>();

  public isLineClamping = true;
  public transform = 'scale(1)';

  /**
   * toggleLineClamping
   * Toggles the line clamping for the product description
   */
  public toggleLineClamping() {
    this.isLineClamping = !this.isLineClamping;
  }

  /**
   * addToCart
   * Emits the product to be added to the cart
   */
  public addToCart() {
    this.addProductToCart.emit(this.product()!);
  }

  public onMouseMove(event: MouseEvent) {
    const container = (event.target as HTMLElement).parentElement!;
    const rect = container.getBoundingClientRect();

    // Calculate mouse position relative to image
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Apply zoom and move transform origin
    this.transform = `scale(2) translate(-${x - 50}%, -${y - 50}%)`;
  }

  public onMouseLeave() {
    this.transform = 'scale(1)';
  }
}
