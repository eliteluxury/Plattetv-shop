import { Component, OnInit, OnChanges, AfterViewInit, OnDestroy, ViewChild, Input, HostListener, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { AppService } from '../../../app.service';
import { Product } from '../../../app.models';
import { emailValidator } from '../../../theme/utils/app-validators';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { BestPriceDialogComponent } from '../best-price-dialog/best-price-dialog.component';
import { ExchangeComponent } from '../exchange/exchange.component';
import { OutdoorOpportunityDialogComponent } from '../outdoor-opportunity-dialog/outdoor-opportunity-dialog.component';
import { SubProductDialogComponent } from '../sub-product-dialog/sub-product-dialog.component';
import { RecommendedCombidealDialogComponent } from '../recommended-combideal-dialog/recommended-combideal-dialog.component';
import { CmsContentDialogComponent } from '../cms-content-dialog/cms-content-dialog.component';

import { ProductsService } from '../products.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    @ViewChild('zoomViewer')
    zoomViewer;

    @ViewChild(SwiperDirective)
    directiveRef: SwiperDirective;

    @Input()
    product: Product;

    sidenavOpen = true;
    config: SwiperConfigInterface = {};
    image: any;
    zoomImage: any;
    selectedImage: any;
    form: FormGroup;
    subscriptions: Subscription[];
    stores: any = [];

    stockCodeColors = ['red', 'orange', 'green', 'green'];
    tooltipStore: any;

    constructor(
        public appService: AppService,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private router: Router,
        private productsService: ProductsService
    ) { }

    ngOnInit() {
        console.log(this.product.categoryId, ' this.product data');
        this.subscriptions = [
            this.appService.getStores().subscribe(res => {
                this.stores = res;
                setTimeout(() => imgix.init(), 1);
            })
        ];

        this.form = this.formBuilder.group({
            'review': [null, Validators.required],
            'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
            'email': [null, Validators.compose([Validators.required, emailValidator])]
        });

        if (window.innerWidth < 960) {
            this.sidenavOpen = false;
        }
    }

    ngOnChanges() {

        if (!this.product.id) {
            this.product = null;
            this.router.navigate(['/404']);
            return;
        }

        console.log(this.product);

        this.product.productAccesories.forEach(acc => {
            acc['quantity'] = 1;
            acc['orderTogether'] = true;
        });

        this.selectImage(this.product.images[0]);
        setTimeout(() => {
            this.config.observer = true;
            this.directiveRef.setIndex(0);
        });
    }

    ngAfterViewInit() {
        this.config = {
            observer: false,
            slidesPerView: 4,
            spaceBetween: 10,
            keyboard: true,
            navigation: true,
            pagination: false,
            loop: false,
            preloadImages: false,
            lazy: true,
            breakpoints: {
                480: {
                    slidesPerView: 2
                },
                600: {
                    slidesPerView: 3
                }
            }
        };
    }

    @HostListener('window:resize')
    public onWindowResize(): void {
        (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    }

    selectImage(image) {
        this.selectedImage = image;
        this.image = image.medium;
        this.zoomImage = image.big;
        setTimeout(() => {
            imgix.init({
                force: true
            });
        }, 1);
    }

    onMouseMove(e) {
        if (window.innerWidth >= 1280) {
            const image = e.currentTarget;
            let offsetX, offsetY, x, y, zoomer;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
            x = offsetX / image.offsetWidth * 100;
            y = offsetY / image.offsetHeight * 100;
            zoomer = this.zoomViewer.nativeElement.children[0];
            if (zoomer) {
                zoomer.style.backgroundPosition = x + '% ' + y + '%';
                zoomer.style.display = 'block';
                zoomer.style.height = image.height * 1.5 + 'px';
                zoomer.style.width = image.width * 1.5 + 'px';
                zoomer.style.backgroundImage = `url("//${imgix.config.host}/${this.zoomImage}?auto=compress")`;
            }
        }
    }

    onMouseLeave(event) {
        this.zoomViewer.nativeElement.children[0].style.display = 'none';
    }

    openZoomViewer() {
        this.dialog.open(ProductZoomComponent, {
            data: this.zoomImage,
            panelClass: 'zoom-dialog'
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    attributeSelected(index, event) {
        this.product.attributes[index]['selected'] = event.value;
    }

    requestBestPrice() {
        const dialogRef = this.dialog.open(BestPriceDialogComponent);

        dialogRef.afterClosed().subscribe(res => {});
    }

    exchangeProduct() {
        const dialogRef = this.dialog.open(ExchangeComponent);

        dialogRef.afterClosed().subscribe(res => {});
    }

    scrollToElement($element): void {
        $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }

    addToCartHash(pkg: any) {
        console.log(this.product, 'pkg under');
        this.appService.addToCartApi({
            item_id: pkg.addToCartHash,
            item_qty: 1,
            category_id: this.product.categoryId
        }).subscribe(res => {
            const dialogRef = this.dialog.open(RecommendedCombidealDialogComponent, {
                data: pkg
            });

            dialogRef.afterClosed().subscribe(r => {});
        });
    }

    openDemoUnit(product) {
        const dialogRef = this.dialog.open(OutdoorOpportunityDialogComponent, {
            data: product
        });
        dialogRef.afterClosed().subscribe(res => {

        });
    }

    integer(str: string) {
        return str.split(',')[0] + ',';
    }

    float(str: string) {
        const v = str.split(',')[1];
        return Number(v) === 0 ? '-' : v;
    }

    likeItem(review) {
        this.productsService.likeReviewItem(review.reviewId).subscribe(res => {
            console.log(res);
            review.reviewLikeCount = res['reviewLikeCount'];
        });
    }

    subProductDialog(subProduct) {
        const dialogRef = this.dialog.open(SubProductDialogComponent, {
            data: subProduct,
            panelClass: 'sub-product-detail'
        });

        dialogRef.afterClosed().subscribe(() => {});
    }

    openCmsDialog(permalink) {
        const dialogRef = this.dialog.open(CmsContentDialogComponent, {
            data: permalink
        });
    }
}
