import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RoutingHandlerService } from 'app/services';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public keyword = '';
  public searchPerformed: Subject<string> = new Subject<string>();

  constructor( private routing: RoutingHandlerService, private route: ActivatedRoute, private router: Router ) { }

  public search(keyword: string) {
    if (keyword === this.keyword && keyword !== '') {
      return;
    }
    this.keyword = keyword;
    if (this.router.url.indexOf('products') > 0) {
      const paths = this.router.url.split('/');
    if (paths.length < 3 || +paths[2]) {
        this.routing.productsPage();
        this.searchPerformed.next(this.keyword);
    } else {
        this.routing.productsPage(paths[2]);
        this.searchPerformed.next(this.keyword);
      }
    } else {
      this.routing.productsPage();
      this.searchPerformed.next(this.keyword);
    }
  }
}
