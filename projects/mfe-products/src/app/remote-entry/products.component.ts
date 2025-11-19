import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'mfe-products-entry',
  template: `
    <div class="products">
      <h3>Products (MFE)</h3>
      <ul *ngIf="products">
        <li *ngFor="let p of products">{{p.title}} — {{p.price | currency}}</li>
      </ul>
      <p *ngIf="!products">Loading...</p>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: any[] | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3333/products').subscribe({
      next: data => this.products = data,
      error: () => {
        this.products = [
          { title: 'Sample Product A', price: 9.99 },
          { title: 'Sample Product B', price: 19.95 }
        ];
      }
    });
  }
}
