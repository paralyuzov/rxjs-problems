import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, timer, ReplaySubject } from 'rxjs';
import { map, tap, share, concatWith, ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'app-shared-cache',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-cache.html',
  styleUrl: './shared-cache.css',
})
export class SharedCacheComponent implements OnInit {
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

  ngOnInit() {
    this.data$ = this.fetchDataFromApi();
  }

  fetchDataFromApi() {
    return timer(1000).pipe(
      map(() => `Data generated at ${new Date().toLocaleTimeString()}`),
      tap(() => console.log('API Request made!')),
      concatWith(timer(5000).pipe(ignoreElements())),
      share({
        connector: () => new ReplaySubject(1),
        resetOnComplete: true,
        resetOnRefCountZero: true,
        resetOnError: true,
      }),
    );
  }

  subscribe1() {
    this.subscriber1Data.set('Loading...');
    this.data$.subscribe((val) => this.subscriber1Data.set(val));
  }

  subscribe2() {
    this.subscriber2Data.set('Loading...');
    this.data$.subscribe((val) => this.subscriber2Data.set(val));
  }
}
