import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './countdown.html',
  styleUrl: './countdown.css',
})
export class CountdownComponent {
  startValue = 10;
  currentValue$!: Observable<number>;

  // -------------------------------------------------------------------
  // PROBLEM:
  // Create a countdown timer that starts from `startValue` and emits
  // every second until it reaches 0.
  //
  // HINT: `timer`, `scan`, `takeWhile`, `map`.
  // -------------------------------------------------------------------

  startCountdown() {
    this.currentValue$ = timer(0, 1000).pipe(
      map((i) => this.startValue - i),
      takeWhile((val) => val >= 0),
    );
  }
}
