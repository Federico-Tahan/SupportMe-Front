import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

export const PUBLIC_ROUTES: Routes = [
    {path : '', component: HomeComponent},
    {path : 'home', component: HomeComponent},
    {path : 'login', component: LoginComponent}
];