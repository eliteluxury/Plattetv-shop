import { Component, OnInit,  OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'app/store';

import { AppSettings } from '../../../app.settings';
import { Title } from '@angular/platform-browser';
import { SidenavMenuService } from '../../../theme/components/sidenav-menu/sidenav-menu.service';

@Component({
  selector: 'app-crumb-path',
  templateUrl: './crumb-path.component.html',
  styleUrls: ['./crumb-path.component.scss']
})
export class CrumbPathComponent implements OnInit, OnDestroy {

  breadcrumbs = [];
  subscription: Subscription;

  constructor(
    private store: Store<State>,
    public title: Title,
    public sidenavMenuService: SidenavMenuService,
    public appSettings: AppSettings,
    public router: Router
  ) {}

  ngOnInit() {
    this.subscription =
      this.store.select(state => state.crumbPath).subscribe(data => {

        const paths = data.crumbPath ? data.crumbPath : [];

        if (paths.length && !paths[paths.length - 1].default_title) {
          this.title.setTitle(paths[paths.length - 1].name);
        } else {
          this.title.setTitle(this.appSettings.settings.name);
        }

        this.breadcrumbs = paths.map(path => {
          return {
            name: path.name,
            url: path.permalink
          };
        });

      });
  }

  ngOnDestroy() {
    this.title.setTitle(this.appSettings.settings.name);
    this.subscription.unsubscribe();
  }

}
