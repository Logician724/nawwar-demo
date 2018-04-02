import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Content } from './content';

@Injectable()
export class ContentService {

  endpoint: String = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getContentPage(numberOfEntriesPerPage: any, pageNumber: any, category: any, section: any): Observable<any> {
    const self = this;
    return this.http.get(self.endpoint + 'content/getContentPage/' + numberOfEntriesPerPage +
      '/' + pageNumber + '/' + category + '/' + section)
      .pipe(
        catchError(self.handleError('getContentPage', []))
      );
  }

  getContentById(id: any): Observable<any> {
    const self = this;
    return this.http.get(self.endpoint + 'content/view/' + id)
      .pipe(
        catchError(self.handleError('getContentById', []))
      );
  }

  createContent(content: Content): Observable<any> {
    const self = this;
    return this.http.post(self.endpoint + 'content', content)
      .pipe(
        catchError(self.handleError('Create Content'))
      );
  }

  getContentByCreator(username: any, pageSize: any, pageNumber: any): Observable<any> {
    const self = this;
    return this.http.get(self.endpoint + 'content/username/' + username + '/' + pageSize + '/' + pageNumber)
      .pipe(
        catchError(self.handleError('getContentByCreator', []))
      );
  }

  getCategories(): Observable<any> {
    const self = this;
    return this.http.get(self.endpoint + 'content/category')
      .pipe(
        catchError(self.handleError('getCategories', []))
      );
  }

  // delete content (ideas or categories) by id
  deleteContent(contentId: any): Observable<any> {
    const self = this;
    return this.http.delete(self.endpoint + 'content/' + contentId)
    .pipe(
      catchError(self.handleError('deleteContent', []))
    );
  }

  // general error handler
  private handleError<T>(operation = 'operation', result?: T) {

    return function (error: any): Observable<T> {

      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
