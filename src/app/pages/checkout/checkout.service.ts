import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class CheckoutService {

    constructor(private http: HttpClient) {}

    getCheckoutCustomer() {
        let params = new HttpParams();
        params = params.append('cart_id', `${(localStorage.getItem('cart_id') || '')}`);
        return this.http.get('/checkout/customer/get', {params: params});
    }

    setCheckoutCustomer(data) {
        let params = new HttpParams();
        params = params.append('cart_id', `${(localStorage.getItem('cart_id') || '')}`);
        return this.http.post('/checkout/customer/set', data, {params: params});
    }

    getMethodsWidget() {
        let params = new HttpParams();
        params = params.append('cart_id', `${(localStorage.getItem('cart_id') || '')}`);
        return this.http.get('/checkout/methods/get', {params: params});
    }

    setMethod(data) {
        let params = new HttpParams();
        params = params.append('cart_id', `${(localStorage.getItem('cart_id') || '')}`);
        return this.http.post('/checkout/methods/set', data, {params: params});
    }

    getOrderView() {
        let params = new HttpParams();
        params = params.append('cart_id', `${(localStorage.getItem('cart_id') || '')}`);
        return this.http.get('/checkout/methods/overview', {params: params});
    }

    placeOrder() {
        let params = new HttpParams();
        params = params.append('cart_id', `${(localStorage.getItem('cart_id') || '')}`);
        return this.http.get('/checkout/methods/process', {params: params});
    }
}

