import { Component, AfterViewInit, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { switchMap, takeUntil, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drag-drop.html',
  styleUrl: './drag-drop.css',
})
export class DragDropComponent implements AfterViewInit {
  @ViewChild('box') box!: ElementRef;
  @ViewChild('container') container!: ElementRef;

  position = signal<{ x: number; y: number }>({ x: 50, y: 50 });

  ngAfterViewInit() {
    // -------------------------------------------------------------------
    // PROBLEM:
    // Implement a simple Drag and Drop for the red box.
    // 1. Listen to `mousedown` on the box.
    // 2. Switch to listening to `mousemove` on the container.
    // 3. Update position until `mouseup`.
    //
    // HINT: `fromEvent`, `switchMap`, `takeUntil`, `map`.
    // -------------------------------------------------------------------

    const box = this.box.nativeElement;
    const container = this.container.nativeElement;

    const mousedown$ = fromEvent<MouseEvent>(box, 'mousedown');
    const mousemove$ = fromEvent<MouseEvent>(container, 'mousemove');
    const mouseup$ = fromEvent<MouseEvent>(container, 'mouseup');

    mousedown$.pipe(
      switchMap((startEvent) => {
        const startX = startEvent.clientX - this.position().x;
        const startY = startEvent.clientY - this.position().y;

        return mousemove$.pipe(
          map((moveEvent) => ({
            x: moveEvent.clientX - startX,
            y: moveEvent.clientY - startY,
          })),
          takeUntil(mouseup$)
        );
      })
    ).subscribe((pos) => {
      this.position.set(pos);
    });
  }
}
