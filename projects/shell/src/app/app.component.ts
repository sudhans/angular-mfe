import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shell';
  constructor(private auth: AuthService, private router: Router) {
    window.addEventListener('mfe-auth', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      console.log('[shell] received mfe-auth event', detail);
      if (detail?.type === 'login') {
        this.auth.setUser(detail.user);
        // after successful login from a remote, navigate to products
        try {
          console.log('[shell] navigating to /products after login');
          this.router.navigate(['/products']);
        } catch (err) {
          // ignore routing errors in development
          console.warn('Navigation to /products failed', err);
        }
      } else if (detail?.type === 'logout') {
        this.auth.setUser(null);
      }
    });
    // Also listen for postMessage events from iframes/remotes
    window.addEventListener('message', (evt: MessageEvent) => {
      try {
        const msg = evt.data;
        console.log('[shell] received postMessage', msg);
        if (msg?.type === 'mfe-auth' && msg?.detail?.type === 'login') {
          this.auth.setUser(msg.detail.user);
          console.log('[shell] navigating to /products after postMessage login');
          this.router.navigate(['/products']);
        }
      } catch (err) {
        // ignore malformed messages
      }
    });
  }
}
