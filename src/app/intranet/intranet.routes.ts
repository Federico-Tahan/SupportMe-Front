import { Routes } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { MercadopagocallbackComponent } from './components/mercadopagocallback/mercadopagocallback.component';

export const INTRANET_ROUTES: Routes = [
    {path : 'home', component: DashboardComponent},
    {path : 'settings', component: SettingsComponent},
    {path : 'dashboard', loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)},
    {
        path: 'campaign', loadComponent: () =>
          import('./components/campaing/campaing.component').then(m => m.CampaingComponent)
    },
    {
      path: 'campaign/new', loadComponent: () =>
        import('./components/campaign-form/campaign-form.component').then(m => m.CampaignFormComponent)
    },
    {
      path: 'campaign/edit', loadComponent: () =>
        import('./components/campaign-form/campaign-form.component').then(m => m.CampaignFormComponent)
    },
    {path : 'payments', component: PaymentsComponent},
    {
      path: 'setup/mercadopago', loadComponent: () =>
        import('./components/mercadopagoconfig/mercadopagoconfig.component').then(m => m.MercadopagoconfigComponent)
    },    
    {path: 'mercadopago/callback', component: MercadopagocallbackComponent},
    {
      path: 'payments', loadComponent: () =>
        import('./components/payments/payments.component').then(m => m.PaymentsComponent)
    },    
    {
      path: 'payments/detail', loadComponent: () =>
        import('./components/payment-detail/payment-detail.component').then(m => m.PaymentDetailComponent)
    },
    {
      path: 'profile', loadComponent: () =>
        import('./components/profile/profile.component').then(m => m.ProfileComponent)
    },
];