import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, timer, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-shared-cache',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-cache.html',
  styleUrl: './shared-cache.css',
})
export class SharedCacheComponent {
  data$!: Observable<string>;
  subscriber1Data = signal<string>('');
  subscriber2Data = signal<string>('');

  // -------------------------------------------------------------------
  // PROBLEM:
  // Implement a caching mechanism using `shareReplay` or similar.
  // 1. The `getData()` method fetches data (simulated).
  // 2. The cache should hold the data for 5 seconds.
  // 3. If a second subscriber joins within 5 seconds, they get the cached value
  //    WITHOUT triggering a new API call.
  // 4. After 5 seconds, the cache expires, and a new subscription triggers a new call.
  //
  // HINT: `shareReplay({ bufferSize: 1, windowTime: 5000 })`
  // -------------------------------------------------------------------

  constructor() {
    this.data$ = this.fetchDataFromApi();
  }

  fetchDataFromApi() {
    return timer(1000).pipe(
      map(() => `Data generated at ${new Date().toLocaleTimeString()}`),
      tap(() => console.log('API Request made!')),
      shareReplay({
        bufferSize: 1,
        windowTime: 5000,
        refCount: true,
      }),
    );
  }

  subscribe1() {
    this.subscriber1Data.set('Loading...');
    this.data$.subscribe((val) => (this.subscriber1Data.set(val)));
  }

  subscribe2() {
    this.subscriber2Data.set('Loading...');
    this.data$.subscribe((val) => (this.subscriber2Data.set(val)));
  }
}
