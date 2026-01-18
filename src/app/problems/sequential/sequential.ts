import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, timer } from 'rxjs';
import { concatMap, map, delay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-sequential',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sequential.html',
  styleUrl: './sequential.css',
})
export class SequentialComponent {
  logs = signal<string[]>([]);

  // -------------------------------------------------------------------
  // PROBLEM:
  // When the button is clicked, execute these 3 requests sequentially:
  // 1. `getUser(1)`
  // 2. `getPosts(user.id)`
  // 3. `getComments(posts[0].id)`
  //
  // Display the final Result.
  //
  // HINT: `concatMap` or `switchMap`.
  // -------------------------------------------------------------------

  startSequence() {
    this.logs.set([]);
    this.addLog('Starting sequence...');

    this.getUser(1)
      .pipe(
        tap(() => this.addLog('User loaded')),
        concatMap((user) => this.getPosts(user.id)),
        tap(() => this.addLog('Posts loaded')),
        concatMap((posts) => this.getComments(posts[0].id)),
        tap(() => this.addLog('Comments loaded')),
      )
      .subscribe((comments) => {
        this.addLog('Final result: ' + comments.join(' '));
      });
  }

  // Mock APIs
  getUser(id: number) {
    return timer(1000).pipe(map(() => ({ id, name: 'John Doe' })));
  }

  getPosts(userId: number) {
    return timer(1000).pipe(map(() => [{ id: 101, title: 'RxJS Rules' }]));
  }

  getComments(postId: number) {
    return timer(1000).pipe(map(() => ['Great post!', 'Awesome']));
  }

  addLog(msg: string) {
    this.logs.update((logs) => [...logs, `${new Date().toLocaleTimeString()} - ${msg}`]);
  }
}
