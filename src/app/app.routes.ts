import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './public/public-layout/public-layout.component';
import { IntranetLayoutComponent } from './intranet/intranet-layout/intranet-layout.component';
import { authGuard } from './core/shared/guards/auth.guard';

export const routes: Routes = [
    {
      path: '',
      component: PublicLayoutComponent,
      children: [
        {
          path: '',
          loadChildren: () => import('./public/public.routes')
            .then(m => m.PUBLIC_ROUTES)
        }
      ]
    },
    {
      path: 'intranet',
      component: IntranetLayoutComponent,
      canActivate: [authGuard],
      children: [
        {
          path: 'intra',
          loadChildren: () => import('./intranet/intranet.routes').then(m => m.INTRANET_ROUTES)
        }
      ]
    },
    {
      path: '**',
      redirectTo: ''
    }
  ];