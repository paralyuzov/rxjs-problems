import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, filter, map, switchMap, tap, catchError, startWith } from 'rxjs/operators';
import { Observable, of, timer } from 'rxjs';

@Component({
  selector: 'app-auto-save',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auto-save.html',
  styleUrl: './auto-save.css',
})
export class AutoSaveComponent {
  form = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  });

  saveStatus$!: Observable<string>;

  // -------------------------------------------------------------------
  // PROBLEM:
  // Implement an auto-save feature:
  // 1. Listen to changes in the form.
  // 2. Wait for 1 second of inactivity (debounce).
  // 3. Trigger a save request (simulated).
  // 4. Update the status to 'Saving...', then 'Saved', or 'Error'.
  // 5. If the user types while saving, cancel the current save and restart.
  //
  // HINT: `valueChanges`, `debounceTime`, `switchMap`
  // -------------------------------------------------------------------

  ngOnInit() {
    this.saveStatus$ = this.form.valueChanges.pipe(
      filter(() => this.form.valid),
      debounceTime(1000),
      switchMap((value) => this.mockSaveApi(value).pipe(startWith('Saving...'))),
    );
  }

  mockSaveApi(data: any): Observable<string> {
    console.log('Saving...', data);
    return timer(1500).pipe(
      map(() => `Saved at ${new Date().toLocaleTimeString()}`),
      catchError(() => of('Error saving data')),
    );
  }
}
