import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ProductsComponent } from './products.component';

@NgModule({
  declarations: [ProductsComponent],
  imports: [CommonModule, HttpClientModule, RouterModule.forChild([{ path: '', component: ProductsComponent }])],
})
export class RemoteEntryModule {}
