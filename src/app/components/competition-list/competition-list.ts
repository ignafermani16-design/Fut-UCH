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
  
  // Controles del formulario
  searchControl = new FormControl('');
  typeControl = new FormControl('ALL'); // <-- Nuevo control para Copas/Ligas
  teamSearchControl = new FormControl('');

  competitions: any[] = [];
  filteredCompetitions: any[] = [];
  selectedTeams: any[] = [];
  filteredTeams: any[] = [];
  selectedLeagueName: string = '';

  ngOnInit(): void {
    this.footballService.getCompetitions().subscribe({
      next: (data: any) => {
        const ligasGrandes = ['PL', 'PD', 'SA', 'BL1', 'FL1', 'CL', 'CLI', 'WC']; // Agregué el Mundial (WC) por si salta
        this.competitions = data.competitions.filter((c: any) => ligasGrandes.includes(c.code));
        this.filteredCompetitions = this.competitions;
      },
      error: (err: any) => console.error('Error trayendo las ligas', err)
    });

    // Escuchamos ambos controles para aplicar el filtro combinado
    this.searchControl.valueChanges.subscribe(() => this.aplicarFiltros());
    this.typeControl.valueChanges.subscribe(() => this.aplicarFiltros());

    this.teamSearchControl.valueChanges.subscribe((value) => {
      const searchTerm = value?.toLowerCase() || '';
      this.filteredTeams = this.selectedTeams.filter(team => 
        team.name.toLowerCase().includes(searchTerm) ||
        (team.shortName && team.shortName.toLowerCase().includes(searchTerm))
      );
    });
  }

  // NUEVA FUNCIÓN: Filtra por texto y por tipo (Liga o Copa)
  aplicarFiltros() {
    const text = this.searchControl.value?.toLowerCase() || '';
    const type = this.typeControl.value || 'ALL';

    this.filteredCompetitions = this.competitions.filter(comp => {
      const coincideTexto = comp.name.toLowerCase().includes(text) || comp.area.name.toLowerCase().includes(text);
      const coincideTipo = type === 'ALL' || comp.type === type;
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