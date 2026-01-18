import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, timer, of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-polling',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './polling.html',
  styleUrl: './polling.css',
})
export class PollingComponent implements OnDestroy {
  status = 'Stopped';
  data$!: Observable<number>;
  private stopPolling$ = new Subject<void>();

  // -------------------------------------------------------------------
  // PROBLEM:
  // 1. When "Start" is clicked, poll the `getUpdates()` mock API every 3 seconds.
  // 2. When "Stop" is clicked, stop polling.
  // 3. Ensure polling stops when the component is destroyed (navigated away).
  //
  // HINT: `timer`, `switchMap`, `takeUntil`.
  // -------------------------------------------------------------------

  startPolling() {
    this.status = 'Polling...';
    this.data$ = timer(0, 3000).pipe(
      switchMap(() => this.getUpdates()),
      takeUntil(this.stopPolling$),
    );
  }

  stopPolling() {
    this.status = 'Stopped';
    this.stopPolling$.next();
  }

  ngOnDestroy() {
    this.stopPolling$.next();
  }

  getUpdates(): Observable<number> {
    return of(Math.floor(Math.random() * 100));
  }
}
