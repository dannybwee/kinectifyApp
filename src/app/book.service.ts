import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly BOOKS_URL = 'https://raw.githubusercontent.com/dudeonthehorse/datasets/master/amazon.books.json';

  constructor(private http: HttpClient) {}
  
  getBooks(): Observable<any> {
    return this.http.get(this.BOOKS_URL, { responseType: 'text' })
      .pipe(
        map(data => {
          let modifiedData = data.replace(/}\s*{/g, '},{');
          modifiedData = '[' + modifiedData + ']';
          return JSON.parse(modifiedData);
        })
      );
  }
}