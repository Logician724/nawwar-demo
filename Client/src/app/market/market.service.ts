import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
@Injectable()
export class MarketService {
  host: String = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) { }
  getMarketPage(entriesPerPage: number, pageNumber: number, limiters: any): Observable<any> {
    let url = this.host + 'market/getMarketPage/' + entriesPerPage +
      '/' + pageNumber + '/' + limiters.name + '/' + limiters.price;
    if (limiters.seller) {
      url = this.host + 'market/getMarketPage/' + entriesPerPage +
        '/' + pageNumber + '/' + limiters.seller;
    }
    return this.http.get(url).pipe(
      catchError(this.handleError('getMarketPage', []))
    );
  }
  numberOfMarketPages(limiters: any): Observable<any> {
    let url = this.host + 'market/getNumberOfProducts/' +
      limiters.name + '/' + limiters.price;
    if (limiters.seller) {
      url = this.host + 'market/getNumberOfProducts/' +
        limiters.seller;
    }
    return this.http.get(url).pipe(
      catchError(this.handleError('getNumberOfProducts', []))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return function (error: any): Observable<T> {
      console.error(error);
      return of(result as T);
    };
  }
}
