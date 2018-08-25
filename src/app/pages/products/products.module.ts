import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { ProductsComponent } from './products.component';
import { ProductComponent } from './product/product.component';
import { ProductZoomComponent } from './product/product-zoom/product-zoom.component';
import { ProductsService } from './products.service';

export const routes = [
  { path: '', component: ProductsComponent, pathMatch: 'full', resolve: { data: ProductsService } },
  { path: ':name', component: ProductsComponent, resolve: { data: ProductsService } },
  { path: ':id/:name', component: ProductComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule
  ],
  declarations: [
    ProductsComponent,
    ProductComponent,
    ProductZoomComponent
  ],
  entryComponents: [
    ProductZoomComponent
  ],
  providers: [ ProductsService ]
})
export class ProductsModule { }
