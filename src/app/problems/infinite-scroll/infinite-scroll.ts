import { Component, ElementRef, ViewChild, AfterViewInit, signal, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, Observable, of, timer, BehaviorSubject } from 'rxjs';
import { map, pairwise, filter, exhaustMap, tap, throttleTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-infinite-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infinite-scroll.html',
  styleUrl: './infinite-scroll.css',
})
export class InfiniteScrollComponent implements AfterViewInit {
  @ViewChild('scroller') scroller!: ElementRef;
  private destroyRef = inject(DestroyRef);

  items: number[] = Array.from({ length: 20 }, (_, i) => i + 1);
  loading = signal(false);
  private page = 1;

  ngAfterViewInit() {
    // -------------------------------------------------------------------
    // PROBLEM:
    // Implement infinite scroll on the `.scroll-container` div.
    // 1. Listen to `scroll` events.
    // 2. Check if the user has scrolled near the bottom (within 100px).
    // 3. Load more data using `loadMoreData()`.
    // 4. PREVENT duplicate requests while loading (`exhaustMap` or similar).
    //
    // HINT: Calculate scroll position manually or use `pairwise` to check direction.
    // (scrollTop + clientHeight >= scrollHeight - 100)
    // -------------------------------------------------------------------

    const scroll$ = fromEvent<Event>(this.scroller.nativeElement, 'scroll');

    scroll$
      .pipe(
        throttleTime(300),
        map((e) => {
          const target = e.target as HTMLElement;
          console.log('Client height: ', target.clientHeight);
          console.log('Scroll top: ', target.scrollTop);
          console.log('Scroll height: ', target.scrollHeight);
          return target.scrollTop + target.clientHeight >= target.scrollHeight - 100;
        }),
        filter((shouldLoad) => shouldLoad),
        exhaustMap(() => this.loadMoreData()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  loadMoreData(): Observable<number[]> {
    this.loading.set(true);
    return timer(1000).pipe(
      map(() => {
        const start = this.items.length + 1;
        const newItems = Array.from({ length: 10 }, (_, i) => start + i);
        return newItems;
      }),
      tap((newItems) => {
        this.items = [...this.items, ...newItems];
        this.loading.set(false);
        this.page++;
      }),
    );
  }
}
