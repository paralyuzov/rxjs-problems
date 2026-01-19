import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { from, Observable, timer } from 'rxjs';
import {
  concatMap,
  map,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-offline-queue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offline-queue.html',
  styleUrl: './offline-queue.css',
})
export class OfflineQueueComponent {
  isOnline = signal(true);
  logs = signal<string[]>([]);

  // -------------------------------------------------------------------
  // PROBLEM:
  // 1. When `makeRequest()` is called:
  //    - If `isOnline` is true, execute the request immediately.
  //    - If `isOnline` is false, QUEUE the request.
  // 2. When connection returns (`toggleConnection()`), process the queue
  //    sequentially.
  //
  // HINT: Use a `Subject` for the queue and `window` or `buffer` or just
  // a simple array with a trigger subject.
  // -------------------------------------------------------------------

  private queue: Array<() => Observable<any>> = [];

  toggleConnection() {
    this.isOnline.set(!this.isOnline());
    this.addLog(this.isOnline() ? '🟢 Online' : '🔴 Offline');

    if (this.isOnline() && this.queue.length > 0) {
      this.addLog(`Flushing ${this.queue.length} requests...`);

      from(this.queue)
        .pipe(
          concatMap((requestFactory) => requestFactory()),
        )
        .subscribe({
          complete: () => {
            this.addLog('✅ All queued requests completed');
            this.queue = [];
          },
        });
    }
  }

  makeRequest() {
    const id = Math.floor(Math.random() * 1000);
    this.addLog(`Action triggered: #${id}`);
    const requestFactory = () => this.mockApiCall(id);
    if (this.isOnline()) {
      requestFactory().subscribe();
    } else {
      this.addLog('🔸 Queued request');
      this.queue.push(requestFactory);
    }
  }

  mockApiCall(id: number) {
    return timer(1000).pipe(
      map(() => `Response for #${id}`),
      tap((res) => this.addLog(`✅ Server: ${res}`)),
    );
  }

  addLog(msg: string) {
    this.logs.update((logs) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...logs]);
  }
}
