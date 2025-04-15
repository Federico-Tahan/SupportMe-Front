import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { onlyPublicGuard } from '../core/shared/guards/only.public.guard';
import { HowWorksComponent } from './components/how-works/how-works.component';
import { SignupComponent } from './components/signup/signup.component';

export const PUBLIC_ROUTES: Routes = [
    {path : '', loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent)},
    {path : 'projects', loadComponent: () => import('./components/projects/projects.component').then(m => m.ProjectsComponent)},
    {path : 'projects/detail', loadComponent: () => import('../public/components/campaign-detail/campaign-detail.component').then(m => m.CampaignDetailComponent)},
    {path : 'how-works', component: HowWorksComponent},
    {path : 'login', canActivate: [onlyPublicGuard], component: LoginComponent},
    {path : 'signup', canActivate: [onlyPublicGuard], component: SignupComponent},
    {path : 'payment/form', loadComponent: () => import('./components/payment-form/payment-form.component').then(m => m.PaymentFormComponent)},
];