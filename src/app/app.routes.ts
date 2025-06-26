import { Routes } from '@angular/router';
import { GestionAppComponent } from './components/gestion-app.component';
import { AuthComponent } from './components/auth/auth.component';
import { UserComponent } from './components/user/user.component';

export const routes: Routes = [

        {  
            path: '', 
            redirectTo: 'users/page/0', 
            pathMatch: 'full' 
        },
        {
            path: 'users', 
            component: UserComponent
        },
        {
            path: 'users/page/:page', 
            component: UserComponent 
        },
        {
            path: 'login',
            component: AuthComponent
        }
];
