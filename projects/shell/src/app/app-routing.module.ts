import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { LoginIframeComponent } from './login-iframe/login-iframe.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.mjs',
        exposedModule: './Module'
      }).then(m => m.RemoteEntryModule) as any
  },
  {
    path: 'login-iframe',
    component: LoginIframeComponent
  },
  {
    path: 'products',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.mjs',
        exposedModule: './Module'
      }).then(m => m.RemoteEntryModule) as any
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
