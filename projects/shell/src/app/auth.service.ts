import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<{ username: string } | null>(null);
  user$ = this._user$.asObservable();

  constructor() {
    const raw = localStorage.getItem('mfe_user');
    if (raw) {
      try { this._user$.next(JSON.parse(raw)); } catch {}
    }
  }

  setUser(user: { username: string } | null) {
    if (user) {
      localStorage.setItem('mfe_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mfe_user');
    }
    this._user$.next(user);
  }
}
