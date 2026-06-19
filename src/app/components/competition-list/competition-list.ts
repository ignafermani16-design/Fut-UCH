import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FootballService } from '../../services/football';

@Component({
  selector: 'app-competition-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './competition-list.html'
})
export class CompetitionListComponent implements OnInit {
  private footballService = inject(FootballService);
  
  // Controles de bÃºsqueda
  searchControl = new FormControl('');
  teamSearchControl = new FormControl(''); // <- Nuevo buscador para equipos

  // Variables de Ligas
  competitions: any[] = [];
  filteredCompetitions: any[] = [];

  // Variables de Equipos
  selectedTeams: any[] = [];
  filteredTeams: any[] = []; // <- Array para mostrar los equipos filtrados
  selectedLeagueName: string = '';

  ngOnInit(): void {
    // 1. Carga inicial de ligas
    this.footballService.getCompetitions().subscribe({
      next: (data: any) => {
        const ligasGrandes = ['PL', 'PD', 'SA', 'BL1', 'FL1', 'CL', 'CLI'];
        this.competitions = data.competitions.filter((c: any) => ligasGrandes.includes(c.code));
        this.filteredCompetitions = this.competitions;
      },
      error: (err: any) => console.error('Error trayendo las ligas', err)
    });

    // 2. Filtro reactivo de ligas
    this.searchControl.valueChanges.subscribe((value) => {
      const searchTerm = value?.toLowerCase() || ''; 
      this.filteredCompetitions = this.competitions.filter(comp => 
        comp.name.toLowerCase().includes(searchTerm) || 
        comp.area.name.toLowerCase().includes(searchTerm)
      );
    });

    // 3. Filtro reactivo de equipos (NUEVO)
    this.teamSearchControl.valueChanges.subscribe((value) => {
      const searchTerm = value?.toLowerCase() || '';
      this.filteredTeams = this.selectedTeams.filter(team => 
        team.name.toLowerCase().includes(searchTerm) ||
        (team.shortName && team.shortName.toLowerCase().includes(searchTerm))
      );
    });
  }

  cargarEquipos(leagueCode: string, leagueName: string) {
    this.selectedLeagueName = leagueName;
    this.teamSearchControl.setValue(''); // Limpiar el buscador al abrir una liga nueva
    
    this.footballService.getTeams(leagueCode).subscribe({
      next: (data: any) => {
        this.selectedTeams = data.teams;
        this.filteredTeams = data.teams; // Inicialmente mostramos todos los equipos
      },
      error: (err: any) => console.error('Error trayendo equipos', err)
    });
  }

  cerrarModal() {
    this.selectedTeams = [];
    this.filteredTeams = [];
  }
}