import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CampaingComponent } from './components/campaing/campaing.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { MercadopagoconfigComponent } from './components/mercadopagoconfig/mercadopagoconfig.component';
import { MercadopagocallbackComponent } from './components/mercadopagocallback/mercadopagocallback.component';

export const INTRANET_ROUTES: Routes = [
    {path : 'home', component: HomeComponent},
    {path : 'settings', component: SettingsComponent},
    {path : 'dashboard', component: DashboardComponent},
    {path : 'campaign', component: CampaingComponent},
    {path : 'payments', component: PaymentsComponent},
    {path: 'setup/mercadopago', component: MercadopagoconfigComponent},
    {path: 'mercadopago/callback', component: MercadopagocallbackComponent}

];