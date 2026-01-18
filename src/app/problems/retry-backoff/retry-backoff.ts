import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, throwError, timer } from 'rxjs';
import { retryWhen, delay, tap, scan, map, catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-retry-backoff',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retry-backoff.html',
  styleUrl: './retry-backoff.css',
})
export class RetryBackoffComponent {
  status = signal('Idle');
  logs = signal<string[]>([]);

  // -------------------------------------------------------------------
  // PROBLEM:
  // The `unreliableApi()` fails randomly.
  // Implement a retry strategy that:
  // 1. Retries up to 3 times.
  // 2. Waits with exponential backoff (e.g., 1s, 2s, 4s).
  // 3. Fails permanently if it still fails after 3 retries.
  //
  // HINT: `retry({ delay: ... })` (Newer RxJS) or `retryWhen` (Older).
  // -------------------------------------------------------------------

  startRequest() {
    this.logs.set([]);
    this.status.set('Requesting...');
    this.addLog('Starting request...');
    this.attempts = 0;

    this.unreliableApi()
      .pipe(
        retry({
          count: 3,
          delay: (error, retryCount) => {
            const backoffTime = Math.pow(2, retryCount) * 1000;
            this.addLog(`Retry #${retryCount} in ${backoffTime / 1000}s`);
            return timer(backoffTime);
          },
        }),
        catchError((err) => {
          this.status.set('Failed');
          this.addLog('Final failure: ' + err);
          return of(null);
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.status.set('Success');
          this.addLog('Result: ' + result);
        }
      });
  }

  private attempts = 0;
  unreliableApi() {
    return timer(500).pipe(
      tap(() => {
        this.attempts++;
        this.addLog(`Attempt #${this.attempts}`);
      }),
      map(() => {
        if (this.attempts <= 2) {
          throw 'Server Error 500';
        }
        return 'Data Loaded!';
      }),
    );
  }

  addLog(msg: string) {
    this.logs.update((logs) => [...logs, `${new Date().toLocaleTimeString()} - ${msg}`]);
  }
}
