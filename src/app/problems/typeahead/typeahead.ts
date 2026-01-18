import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-typeahead',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './typeahead.html',
  styleUrl: './typeahead.css',
})
export class TypeaheadComponent {
  searchControl = new FormControl('');
  results$!: Observable<string[]>;
  loading = false;

  constructor() {
    // -------------------------------------------------------------------
    // PROBLEM:
    // Implement a typeahead search using `searchControl.valueChanges`.
    // 1. Debounce input by 300ms.
    // 2. Ignore if the value is the same as previous.
    // 3. Cancel previous requests if a new one is made (switchMap).
    // 4. Handle empty input (return empty array).
    // -------------------------------------------------------------------

    this.results$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => this.fakeApiCall(value || '')),
      takeUntilDestroyed(),
    );
  }

  fakeApiCall(term: string): Observable<string[]> {
    if (!term) return of([]);
    this.loading = true;
    const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew'];
    return timer(1000).pipe(
      tap(() => (this.loading = false)),
      map(() => items.filter((item) => item.toLowerCase().includes(term.toLowerCase()))),
    );
  }
}
