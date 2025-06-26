import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { GestionAppComponent } from './components/gestion-app.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users/page/0',
    },
    {
        path: 'users',
        component: GestionAppComponent,
    },
    {
        // Ejemplo: /users/page/0, /users/page/1, etc.
        path: 'users/page/:page',
        component: GestionAppComponent
    }
];
