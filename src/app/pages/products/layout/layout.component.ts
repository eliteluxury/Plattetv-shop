import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { switchMap } from 'rxjs/operators/switchMap';

import { Store } from '@ngrx/store';

import { State } from 'app/store';
import { Category, Product } from 'app/app.models';

import { AppService } from 'app/app.service';

import * as KeywordActions from 'app/store/actions/keyword.action';
import * as ProductActions from 'app/store/actions/product.action';
import * as ProductsActions from 'app/store/actions/products.action';
import * as CategoryActions from 'app/store/actions/category.action';
import * as CrumbpathActions from 'app/store/actions/crumb-path.action';

@Component({
  selector: 'app-products-layout',
  template: `<app-products *ngIf="category" [category]="category" [categories]="categories"></app-products>
            <app-product *ngIf="product" [product]="product"></app-product>`
})
export class LayoutComponent implements OnInit, OnDestroy {

  parentCategory: Category;
  category: Category;
  product:  Product;
  categories: Category[] = [];
  subscriptions: Subscription[];
  loaded = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<State>,
    private appService: AppService) { }

  ngOnInit() {

    this.subscriptions = [
      this.store
        .select(state => state.category)
        .subscribe(data => this.parentCategory = data.category),

      this.store
        .select(state => state.product)
        .subscribe(data => {
          if (!this.loaded) {
            return;
          }
          this.product = data.product;
          if ( this.product && this.product.crumbPath ) {
            this.product.crumbPath.push({ name: this.product.name, id: this.product.id });
            this.store.dispatch( new CrumbpathActions.SaveCrumbPath(this.generateCrumbPath(this.product.crumbPath, true)));
          }
        }),

      this.appService.getCategories()
      // this.store.select(store => store.categories)
        .pipe(
          switchMap(res => {
            this.categories = res;
            return this.route.url;
          })
        )
        .subscribe(() => {
            if (!this.categories.length) {
              return;
            }

            const url = this.router.url.split('?')[0];
            this.loaded = true;
            if (url === '/products' || url.indexOf('leverancier') > -1) {
              this.category = {id: 0, name: '', crumbPath: [], parentId: 0, permalink: '', hasSubCategory: true};
            } else {
              this.category = this.categories.find((c) => c.permalink === `${url}/` || c.permalink === url);
            }
            if (this.category) {
              this.store.dispatch(new CategoryActions.SaveCategory(this.category));
              this.store.dispatch(new ProductActions.RemoveProduct());
              this.store.dispatch(new CrumbpathActions.SaveCrumbPath(this.generateCrumbPath(this.category.crumbPath)));
            } else if (!this.category) {
              const payload = { permalink: url, categoryId: this.parentCategory ? this.parentCategory.id : null };
              this.store.dispatch( new ProductActions.GetProduct(payload));
              this.store.dispatch( new CategoryActions.RemoveCategory());
            }

        })
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach( subscription => subscription.unsubscribe() );
  }

  generateCrumbPath(crumbPath, isProduct = false) {
    const result = [];
    if (!crumbPath) {
      return [];
    }
    for ( let i = 0; i < crumbPath.length ; i ++) {
      const path = { name: crumbPath[i].name, permalink: ''};
      if ( isProduct && i === crumbPath.length - 1) {
      } else {
        const category = this.categories.find( c => c.id === crumbPath[i].id);
        path.permalink = category.permalink;
      }
      result.push(path);
    }
    return result;
  }

}
