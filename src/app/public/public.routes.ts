import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { onlyPublicGuard } from '../core/shared/guards/only.public.guard';

export const PUBLIC_ROUTES: Routes = [
    {path : '', component: LandingComponent},
    {path : 'login', canActivate: [onlyPublicGuard], component: LoginComponent}
];