import { ApplicationConfig, provideZoneChangeDetection, Injectable } from '@angular/core';
import { provideRouter, withRouterConfig, RouteReuseStrategy } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class NoReuseSameRouteStrategy extends RouteReuseStrategy {
  override shouldReuseRoute(future: any, curr: any): boolean { return false; }
  override shouldDetach(): boolean { return false; }
  override store(): void {}
  override shouldAttach(): boolean { return false; }
  override retrieve(): any { return null; }
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    { provide: RouteReuseStrategy, useClass: NoReuseSameRouteStrategy },
    provideHttpClient()
  ]
};