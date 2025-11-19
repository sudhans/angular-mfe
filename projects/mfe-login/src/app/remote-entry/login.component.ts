import { Component } from '@angular/core';

@Component({
  selector: 'mfe-login-entry',
  template: `
    <div class="login">
      <h3>Login (MFE)</h3>
      <form (submit)="login($event)">
        <input name="username" placeholder="username" [(ngModel)]="username" />
        <input type="password" name="password" placeholder="password" [(ngModel)]="password" />
        <button type="submit">Login</button>
      </form>
      <p *ngIf="logged">Logged in as {{username}}</p>
    </div>
  `,
})
export class LoginComponent {
  username = '';
  password = '';
  logged = false;

  login(e: Event) {
    e.preventDefault();
    if (!this.username) return;
    // Dispatch a global event the host listens to
    const detail = { type: 'login', user: { username: this.username } };
    console.log('[mfe-login] dispatching mfe-auth', detail);
    window.dispatchEvent(new CustomEvent('mfe-auth', { detail }));
    // Also post a message to parent/top (useful when hosted in an iframe)
    try {
      const msg = { type: 'mfe-auth', detail };
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(msg, '*');
      }
      if (window.top && window.top !== window) {
        window.top.postMessage(msg, '*');
      }
    } catch (err) {
      // ignore
    }
    this.logged = true;
  }
}
