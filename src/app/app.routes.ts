import { Routes } from '@angular/router';
import { CompetitionListComponent } from './components/competition-list/competition-list';
import { AuthComponent } from './components/auth/auth.component';
import { ProdeComponent } from './components/prode/prode.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: CompetitionListComponent },
  { path: 'login', component: AuthComponent },
  { path: 'mis-predicciones', component: ProdeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
