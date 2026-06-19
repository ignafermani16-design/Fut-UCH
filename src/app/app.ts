import { Component } from '@angular/core';
// Importamos tu componente nuevo
import { CompetitionListComponent } from './components/competition-list/competition-list'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // Sacamos RouterOutlet y metemos tu lista
  imports: [CompetitionListComponent], 
  templateUrl: './app.html'
})
export class App {
  title = 'FulboUCH';
}