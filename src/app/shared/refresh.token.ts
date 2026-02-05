import { InjectionToken } from "@angular/core";

export interface Refreshable {
  load(): void;
  refresh(): void;
}

export const REFRESH_TOKEN = new InjectionToken<Refreshable>(
  'Refreshable Behavior Token'
);