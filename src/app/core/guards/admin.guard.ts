import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, filter, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userProfile$.pipe(
    filter(profile => profile !== undefined),
    take(1),
    map(profile => {
      if (profile && profile.role === 'admin') {
        return true;
      }
      return router.createUrlTree(['/']);
    })
  );
};
