// services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, timer } from 'rxjs';
import { 
  map, 
  switchMap, 
  catchError, 
  retry, 
  shareReplay, 
  debounceTime,
  distinctUntilChanged,
  startWith
} from 'rxjs/operators';

export interface DataItem {
  id: string;
  title: string;
  category: string;
  createdAt: Date;
}

export interface DataFilters {
  search: string;
  category: string;
  sortBy: 'title' | 'date';
  sortOrder: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiUrl = '/api/data';
  private filtersSubject = new BehaviorSubject<DataFilters>({
    search: '',
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Auto-refresh every 30 seconds
  private refreshTrigger$ = timer(0, 30000);

  constructor(private http: HttpClient) {}

  // Filtered and sorted data stream
  data$ = combineLatest([
    this.filtersSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    this.refreshTrigger$
  ]).pipe(
    switchMap(([filters]) => this.fetchData(filters)),
    retry(3),
    shareReplay(1),
    catchError(error => {
      console.error('Data fetch error:', error);
      return [];
    })
  );

  // Loading state
  loading$ = new BehaviorSubject<boolean>(false);

  private fetchData(filters: DataFilters): Observable<DataItem[]> {
    this.loading$.next(true);
    
    let params = new HttpParams()
      .set('search', filters.search)
      .set('category', filters.category)
      .set('sortBy', filters.sortBy)
      .set('sortOrder', filters.sortOrder);

    return this.http.get<DataItem[]>(this.apiUrl, { params }).pipe(
      map(data => data.map(item => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }))),
      map(data => this.loading$.next(false) || data)
    );
  }

  updateFilters(filters: Partial<DataFilters>): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({ ...currentFilters, ...filters });
  }

  getCurrentFilters(): DataFilters {
    return this.filtersSubject.value;
  }
}
