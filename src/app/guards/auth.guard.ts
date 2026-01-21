// guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanLoad, 
  Router, 
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuth(state.url, route.data?.['requiredRole']);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> {
    const url = segments.map(s => s.path).join('/');
    return this.checkAuth(url, route.data?.['requiredRole']);
  }

  private checkAuth(url: string, requiredRole?: string): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map(user => {
        if (!user) {
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: url } 
          });
          return false;
        }

        if (requiredRole && user.role !== requiredRole) {
          this.router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      }),
      catchError(error => {
        console.error('Auth check failed:', error);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
