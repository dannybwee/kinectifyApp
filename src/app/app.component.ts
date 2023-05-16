import { Component } from '@angular/core';
import { BookService } from './book.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSidenav } from '@angular/material/sidenav';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  books: any[] = [];
  selectedBook: any;

  searchControl = new FormControl();
  orderedBooks$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private bookService: BookService) {
    this.bookService.getBooks().subscribe((data: any[]) => {
      this.books = data;
    });
  }

  ngOnInit() {
    this.bookService.getBooks().subscribe((data: any[]) => {
      this.books = data;

      // Get the book order from local storage
      const storedOrder = localStorage.getItem('bookOrder');

      if (storedOrder !== null) {
        // If an order exists in local storage, order the books accordingly
        this.books.sort((a, b) => JSON.parse(storedOrder).indexOf(a.title) - JSON.parse(storedOrder).indexOf(b.title));
      } else {
        // If no order exists in local storage, initialize the order with the original list of books
        const initialOrder = this.books.map(book => book.title);
        localStorage.setItem('bookOrder', JSON.stringify(initialOrder));
      }

      this.orderedBooks$.next(this.books);
    });

    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      )
      .subscribe(filteredBooks => {
        this.orderedBooks$.next(filteredBooks);
      });
  }

  selectBook(book: any, sidenav: MatSidenav) {
    if(this.selectedBook === book){
      sidenav.close();
      this.selectedBook = null;
    } else {
      this.selectedBook = book;
      if(!sidenav.opened){
        sidenav.open();
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const orderedBooks = this.orderedBooks$.value;
    moveItemInArray(orderedBooks, event.previousIndex, event.currentIndex);
    this.orderedBooks$.next(orderedBooks);

    const updatedOrder = orderedBooks.map(book => book.title);
    localStorage.setItem('bookOrder', JSON.stringify(updatedOrder));
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.books.filter(book => book.title.toLowerCase().includes(filterValue));
  }
}
