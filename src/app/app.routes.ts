import { Routes } from '@angular/router';
import { DoubleClickComponent } from './problems/double-click/double-click';
import { TypeaheadComponent } from './problems/typeahead/typeahead';
import { CountdownComponent } from './problems/countdown/countdown';
import { PollingComponent } from './problems/polling/polling';
import { SequentialComponent } from './problems/sequential/sequential';
import { DragDropComponent } from './problems/drag-drop/drag-drop';
import { RetryBackoffComponent } from './problems/retry-backoff/retry-backoff';
import { SharedCacheComponent } from './problems/shared-cache/shared-cache';
import { RaceConditionComponent } from './problems/race-condition/race-condition';

export const routes: Routes = [
  { path: '', redirectTo: 'double-click', pathMatch: 'full' },
  { path: 'double-click', component: DoubleClickComponent },
  { path: 'typeahead', component: TypeaheadComponent },
  { path: 'countdown', component: CountdownComponent },
  { path: 'polling', component: PollingComponent },
  { path: 'sequential', component: SequentialComponent },
  { path: 'drag-drop', component: DragDropComponent },
  { path: 'retry-backoff', component: RetryBackoffComponent },
  { path: 'shared-cache', component: SharedCacheComponent },
  { path: 'race-condition', component: RaceConditionComponent },
];
