import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CartItem } from '../../../../models/products';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-cart-item',
  imports: [
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgClass,
  ],
  templateUrl: './product-cart-item.component.html',
  styleUrl: './product-cart-item.component.scss',
})
export class ProductCartItemComponent implements OnInit {
  // inputs
  public cartItem = input.required<CartItem>();
  public isUpdating = input.required<boolean>();
  // outputs
  public updateQuantity = output<CartItem>();
  public deleteItem = output<CartItem>();
  // public properties
  public customQuantity = signal<number>(1);
  public isDescExpanded = false;

  ngOnInit(): void {
    this.customQuantity.set(this.cartItem().quantity);
  }

  /**
   * incrementQuantity
   */
  public incrementQuantity(): void {
    this.customQuantity.update((val) => val + 1);
    const updatedItem = { ...this.cartItem(), quantity: this.customQuantity() };
    this.updateQuantity.emit(updatedItem);
  }

  /**
   * decrementQuantity
   */
  public decrementQuantity(): void {
    this.customQuantity.update((val) => val - 1);
    const updatedItem = { ...this.cartItem(), quantity: this.customQuantity() };
    this.updateQuantity.emit(updatedItem);
  }

  /**
   * onDelete
   */
  public onDelete(): void {
    this.deleteItem.emit(this.cartItem());
  }

  public toggleExpandDescription(): void {
    this.isDescExpanded = !this.isDescExpanded;
  }
}
