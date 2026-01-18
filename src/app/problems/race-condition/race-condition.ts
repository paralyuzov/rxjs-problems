import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, timer, merge, of } from 'rxjs';
import { map, scan, switchMap, concatMap, exhaustMap, mergeMap, tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-race-condition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './race-condition.html',
  styleUrl: './race-condition.css',
})
export class RaceConditionComponent {
  logs = signal<string[]>([]);

  // -------------------------------------------------------------------
  // PROBLEM:
  // We have a "Fast" request (1s) and a "Slow" request (3s).
  //
  // Scenario 1: User clicks "Start Slow", then immediately "Start Fast".
  // Expected behavior: Ideally, we want to cancel the "Slow" one and only show "Fast".
  // OR we might want to prioritize them.
  //
  // Task: Implement `startRequest` using `switchMap` so that only the
  // LATEST request is processed. Previous pending requests should be cancelled.
  //
  // HINT: Use a `Subject` to emit values and `switchMap` in the pipe.
  // -------------------------------------------------------------------

  private requestTrigger$ = new Subject<{ duration: number; id: number }>();

  constructor() {
    this.requestTrigger$
      .pipe(
        switchMap((req) => this.simulateApi(req.duration, req.id)),
      )
      .subscribe((result) => {
        this.addLog(result);
      });
  }

  startRequest(duration: number) {
    const id = Math.floor(Math.random() * 1000);
    this.addLog(`Starting Request #${id} (${duration}ms)...`);
    this.requestTrigger$.next({ duration, id });
  }

  simulateApi(duration: number, id: number): Observable<string> {
    return timer(duration).pipe(map(() => `Finished Request #${id}`));
  }

  addLog(msg: string) {
    this.logs.update((logs) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...logs]);
  }
}
