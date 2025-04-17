import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { MercadopagocallbackComponent } from './components/mercadopagocallback/mercadopagocallback.component';

export const INTRANET_ROUTES: Routes = [
    {path : 'home', component: DashboardComponent},
    {path : 'settings', component: SettingsComponent},
    {path : 'dashboard', component: DashboardComponent},
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

];