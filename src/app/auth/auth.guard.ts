import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { UserService } from '../services/user.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate{
  path: ActivatedRouteSnapshot[];  route: ActivatedRouteSnapshot;

  constructor(
    private router: Router,
    private userService: UserService,
    ) {}

    canActivate() {
      return this.userService.isLoggedIn().pipe(
        map((user) =>  !!user  ),
        tap((result: any) => {
          if (!result) {
            this.userService.goHome()
          }
        })
      )
    }

}
