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
  public transformOrigin = '50% 50%';
  public isImageZoomed = false;
  public isImageZoomPinned = false;

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
    const rect = event.currentTarget instanceof HTMLElement
      ? event.currentTarget.getBoundingClientRect()
      : null;

    if (!rect || rect.width === 0 || rect.height === 0) return;

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    this.transformOrigin = `${x}% ${y}%`;
    if (!this.isImageZoomPinned) {
      this.transform = 'scale(1.8)';
      this.isImageZoomed = true;
    }
  }

  public toggleImageZoom() {
    this.isImageZoomPinned = !this.isImageZoomPinned;
    this.isImageZoomed = this.isImageZoomPinned;
    this.transform = this.isImageZoomPinned ? 'scale(1.8)' : 'scale(1)';
  }

  public onMouseLeave() {
    if (this.isImageZoomPinned) return;

    this.transform = 'scale(1)';
    this.transformOrigin = '50% 50%';
    this.isImageZoomed = false;
  }
}
