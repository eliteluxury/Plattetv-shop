import { Component, OnInit, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from '../app.settings';
import { AppService } from '../app.service';
import { Category } from '../app.models';
import { SidenavMenuService } from '../theme/components/sidenav-menu/sidenav-menu.service';
import { RoutingHandlerService, FilterService } from 'app/services';
import { ProductsService } from './products/products.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [ SidenavMenuService ]
})
export class PagesComponent implements OnInit, AfterViewInit {
  public showBackToTop = false;
  public categories: Category[];
  public category: Category;
  public sidenavMenuItems: Array<any>;
  public keyword = '';
  @ViewChild('sidenav') sidenav: any;

  public settings: Settings;
  constructor(public appSettings: AppSettings,
              public appService: AppService,
              public sidenavMenuService: SidenavMenuService,
              public router: Router,
              public route: RoutingHandlerService,
              public filter: FilterService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.getCategories();
    this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sidenav.close();
      }
    });
    this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
  }

  public getCategories() {
    this.appService.getCategories().subscribe(data => {
      this.categories = data;
      this.category = data[0];
      this.appService.Data.categories = data;
    });
  }

  public changeCategory(event) {
    if (event.target) {
      this.category = this.categories.filter(category => category.name.toLowerCase() === event.target.innerText.toLowerCase())[0];
      this.route.productsPage(this.category.name);
    }
    if (window.innerWidth < 960) {
      this.stopClickPropagate(event);
    }
  }

  public remove(product) {
      const index: number = this.appService.Data.cartList.indexOf(product);
      if (index !== -1) {
          this.appService.Data.cartList.splice(index, 1);
          this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.newPrice;
      }
  }

  public search() {
    this.filter.search(this.keyword);
  }

  public clear() {
    this.appService.Data.cartList.length = 0;
  }

  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  public scrollToTop() {
    const scrollDuration = 200;
    const scrollStep = -window.pageYOffset  / (scrollDuration / 20);
    const scrollInterval = setInterval(() => {
      if (window.pageYOffset !== 0) {
         window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      setTimeout(() => window.scrollTo(0, 0));
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
  }

  public closeSubMenus() {
    if (window.innerWidth < 960) {
      this.sidenavMenuService.closeAllSubMenus();
    }
  }

}
