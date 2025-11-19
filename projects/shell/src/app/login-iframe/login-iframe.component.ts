import { Component } from '@angular/core';

@Component({
  selector: 'app-login-iframe',
  template: `
    <div style="max-width:900px;margin:32px auto;">
      <h3>Login (host iframe)</h3>
      <p>If the remote login can't be loaded via Module Federation, use the embedded login below.</p>
      <iframe src="http://localhost:4201" style="width:100%;height:600px;border:1px solid #ddd;" title="login-remote"></iframe>
    </div>
  `
})
export class LoginIframeComponent {}
