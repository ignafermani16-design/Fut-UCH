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
  
  searchControl = new FormControl('');
  typeControl = new FormControl('ALL');
  teamSearchControl = new FormControl('');

  competitions: any[] = [];
  filteredCompetitions: any[] = [];
  selectedTeams: any[] = [];
  filteredTeams: any[] = [];
  selectedLeagueName: string = '';

  ngOnInit(): void {
    this.footballService.getCompetitions().subscribe({
      next: (data: any) => {
        const ligasGrandes = ['PL', 'PD', 'SA', 'BL1', 'FL1', 'CL', 'CLI', 'WC'];
        this.competitions = data.competitions.filter((c: any) => ligasGrandes.includes(c.code));
        this.filteredCompetitions = this.competitions;
      },
      error: (err: any) => console.error('Error trayendo las ligas', err)
    });

    this.searchControl.valueChanges.subscribe(() => this.aplicarFiltros());
    this.typeControl.valueChanges.subscribe(() => this.aplicarFiltros());

    this.teamSearchControl.valueChanges.subscribe((value) => {
      const searchTerm = value?.toLowerCase() || ''; // <--- CORREGIDO: faltaba ||
      this.filteredTeams = this.selectedTeams.filter(team => 
        team.name.toLowerCase().includes(searchTerm) || // <--- CORREGIDO: faltaba ||
        (team.shortName && team.shortName.toLowerCase().includes(searchTerm))
      );
    });
  }

  aplicarFiltros() {
    const text = this.searchControl.value?.toLowerCase() || ''; // <--- CORREGIDO: faltaba ||
    const type = this.typeControl.value || 'ALL'; // <--- CORREGIDO: faltaba ||

    this.filteredCompetitions = this.competitions.filter(comp => {
      const coincideTexto = comp.name.toLowerCase().includes(text) || comp.area.name.toLowerCase().includes(text); // <--- CORREGIDO: faltaba ||
      const coincideTipo = type === 'ALL' || comp.type === type; // <--- CORREGIDO: faltaba ||
      return coincideTexto && coincideTipo;
    });
  }

  cargarEquipos(leagueCode: string, leagueName: string) {
    this.selectedLeagueName = leagueName;
    this.teamSearchControl.setValue(''); 
    this.footballService.getTeams(leagueCode).subscribe({
      next: (data: any) => {
        this.selectedTeams = data.teams;
        this.filteredTeams = data.teams;
      },
      error: (err: any) => console.error('Error trayendo equipos', err)
    });
  }

  cerrarModal() {
    this.selectedTeams = [];
    this.filteredTeams = [];
  }
}