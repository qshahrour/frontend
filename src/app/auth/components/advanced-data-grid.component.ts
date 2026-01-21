// components/advanced-data-grid.component.ts
import { 
  Component, 
  ChangeDetectionStrategy, 
  OnInit, 
  OnDestroy,
  TrackByFunction,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { DataService, DataItem, DataFilters } from '../services/data.service';

@Component({
  selector: 'app-advanced-data-grid',
  template: `
    <div class="data-grid-container">
      <div class="filters-section">
        <input 
          #searchInput
          [formControl]="searchControl"
          placeholder="Search..."
          class="search-input"
        />
        
        <select [formControl]="categoryControl" class="category-select">
          <option value="all">All Categories</option>
          <option value="tech">Technology</option>
          <option value="business">Business</option>
          <option value="science">Science</option>
        </select>

        <div class="sort-controls">
          <select [formControl]="sortByControl">
            <option value="title">Title</option>
            <option value="date">Date</option>
          </select>
          <button 
            (click)="toggleSortOrder()"
            [class.desc]="(sortOrder$ | async) === 'desc'"
          >
            {{ (sortOrder$ | async) === 'asc' ? '↑' : '↓' }}
          </button>
        </div>
      </div>

      <div class="loading-indicator" *ngIf="loading$ | async">
        Loading...
      </div>

      <div 
        class="data-grid"
        [class.loading]="loading$ | async"
      >
        <div 
          *ngFor="let item of data$ | async; trackBy: trackByFn"
          class="data-item"
          [class.selected]="selectedItems.has(item.id)"
          (click)="toggleSelection(item.id)"
        >
          <h3>{{ item.title }}</h3>
          <p class="category">{{ item.category }}</p>
          <time>{{ item.createdAt | date:'medium' }}</time>
        </div>
      </div>

      <div class="selection-info" *ngIf="selectedItems.size > 0">
        Selected: {{ selectedItems.size }} items
        <button (click)="clearSelection()">Clear</button>
      </div>
    </div>
  `,
  styleUrls: ['./advanced-data-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedDataGridComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  private destroy$ = new Subject<void>();
  selectedItems = new Set<string>();

  // Form controls
  searchControl = new FormControl('');
  categoryControl = new FormControl('all');
  sortByControl = new FormControl('date');
  private sortOrderControl = new FormControl('desc');

  // Observables
  data$ = this.dataService.data$;
  loading$ = this.dataService.loading$;
  
  sortOrder$ = this.sortOrderControl.valueChanges.pipe(
    startWith(this.sortOrderControl.value)
  );

  trackByFn: TrackByFunction<DataItem> = (index, item) => item.id;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Combine all filter controls and update service
    combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.categoryControl.valueChanges.pipe(startWith('all')),
      this.sortByControl.valueChanges.pipe(startWith('date')),
      this.sortOrderControl.valueChanges.pipe(startWith('desc'))
    ]).pipe(
      map(([search, category, sortBy, sortOrder]) => ({
        search: search || '',
        category: category || 'all',
        sortBy: sortBy as 'title' | 'date',
        sortOrder: sortOrder as 'asc' | 'desc'
      })),
      takeUntil(this.destroy$)
    ).subscribe(filters => {
      this.dataService.updateFilters(filters);
    });

    // Focus search input on init
    setTimeout(() => this.searchInput.nativeElement.focus(), 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSortOrder(): void {
    const currentOrder = this.sortOrderControl.value;
    this.sortOrderControl.setValue(currentOrder === 'asc' ? 'desc' : 'asc');
  }

  toggleSelection(itemId: string): void {
    if (this.selectedItems.has(itemId)) {
      this.selectedItems.delete(itemId);
    } else {
      this.selectedItems.add(itemId);
    }
  }

  clearSelection(): void {
    this.selectedItems.clear();
  }
}
