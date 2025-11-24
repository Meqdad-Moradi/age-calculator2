import { CurrencyPipe } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CartItem } from '../../../../models/products';

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
  ],
  templateUrl: './product-cart-item.component.html',
  styleUrl: './product-cart-item.component.scss',
})
export class ProductCartItemComponent implements OnInit {
  public cartItem = input.required<CartItem>();

  public customQuantity = signal<number>(1);

  ngOnInit(): void {
    this.customQuantity.set(this.cartItem().quantity);
  }
}
