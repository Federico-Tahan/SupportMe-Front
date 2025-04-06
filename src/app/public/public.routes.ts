import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { onlyPublicGuard } from '../core/shared/guards/only.public.guard';
import { ProjectsComponent } from './components/projects/projects.component';
import { HowWorksComponent } from './components/how-works/how-works.component';
import { SignupComponent } from './components/signup/signup.component';

export const PUBLIC_ROUTES: Routes = [
    {path : '', component: LandingComponent},
    {path : 'projects', component: ProjectsComponent},
    {path : 'how-works', component: HowWorksComponent},
    {path : 'login', canActivate: [onlyPublicGuard], component: LoginComponent},
    {path : 'signup', canActivate: [onlyPublicGuard], component: SignupComponent}

];