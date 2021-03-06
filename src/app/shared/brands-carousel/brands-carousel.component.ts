import { Component, Input, AfterViewInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-brands-carousel',
  templateUrl: './brands-carousel.component.html',
  styleUrls: ['./brands-carousel.component.scss']
})
export class BrandsCarouselComponent implements AfterViewInit {

  @Input() brands: Array<any> = [];

  public config: SwiperConfigInterface = { };

  constructor() { }

  ngAfterViewInit() {
    console.log(this.brands);
    this.config = {
      slidesPerView: 4,
      spaceBetween: 16,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: true,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },
      speed: 500,
      effect: 'slide',
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 2,
        },
        960: {
          slidesPerView: 4,
        },
        1280: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 4,
        }
      }
    };
    setTimeout(() => imgix.init(), 1);
  }

}
