import { Component, ElementRef, ViewChild, AfterViewInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, Observable } from 'rxjs';
import { buffer, debounceTime, map, filter, throttleTime, tap, bufferTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-double-click',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './double-click.html',
  styleUrl: './double-click.css',
})
export class DoubleClickComponent implements AfterViewInit {
  @ViewChild('btn') btn!: ElementRef;

  doubleClick$!: Observable<unknown[]>;
  message = signal<string>('');
  private destroyRef = inject(DestroyRef);

  ngAfterViewInit() {
    // -------------------------------------------------------------------
    // PROBLEM:
    // Create an Observable `doubleClick$` that emits when the button is
    // clicked twice within 300ms.
    //
    // HINT: You can use `buffer`, `throttle`, or basic timestamp logic.
    // -------------------------------------------------------------------

    const click$ = fromEvent(this.btn.nativeElement, 'click');

    this.doubleClick$ = click$.pipe(
      bufferTime(300),
      filter((x) => x.length === 2),
      takeUntilDestroyed(this.destroyRef)
    );

    this.doubleClick$.subscribe(() => {
      this.message.set('Double Click Detected! ' + new Date().toLocaleTimeString());
    });
  }
}
