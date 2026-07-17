import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PredictionService, Prediction } from '../../services/prediction.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
// Importaciones necesarias para el PDF
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-prode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 space-y-8">
      <div class="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-xl">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-white tracking-wide">Mis Predicciones (Prode)</h2>
            <p class="text-zinc-400 text-sm mt-1">Registra tus pronósticos para los próximos partidos.</p>
          </div>
          <button (click)="logout()" class="text-sm font-medium text-red-400 hover:text-red-300 transition-colors bg-red-400/10 hover:bg-red-400/20 px-4 py-2 rounded-lg">
            Cerrar Sesión
          </button>
        </div>

        <form (ngSubmit)="addPrediction()" class="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-zinc-900 rounded-xl border border-zinc-700">
          <div class="flex-1">
            <label class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Local</label>
            <input type="text" [(ngModel)]="newPrediction.localTeam" name="localTeam" required placeholder="Ej: Boca Juniors"
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all">
          </div>
          <div class="flex-none flex items-center justify-center font-bold text-zinc-500 mt-5">VS</div>
          <div class="flex-1">
            <label class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Visitante</label>
            <input type="text" [(ngModel)]="newPrediction.awayTeam" name="awayTeam" required placeholder="Ej: River Plate"
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all">
          </div>
          <div class="flex-1">
            <label class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Resultado</label>
            <select [(ngModel)]="newPrediction.result" name="result" required
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all">
              <option value="" disabled selected>Selecciona</option>
              <option value="L">Local</option>
              <option value="E">Empate</option>
              <option value="V">Visitante</option>
            </select>
          </div>
          <div class="flex items-end">
            <button type="submit" [disabled]="!isFormValid"
              class="h-[42px] px-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 outline-none">
              Guardar
            </button>
          </div>
        </form>

        <div *ngIf="isLoading" class="flex justify-center py-12">
          <svg class="w-8 h-8 text-indigo-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
                 
        <div *ngIf="!isLoading && predictions.length === 0" class="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800 border-dashed">
          <p class="text-zinc-400">Aún no has registrado ninguna predicción.</p>
        </div>

        <!-- BOTÓN DE DESCARGAR PDF (Solo se muestra si hay predicciones) -->
        <div *ngIf="!isLoading && predictions.length > 0" class="flex justify-end mb-4">
          <button (click)="exportarTicketPDF()" class="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>Descargar Ticket PDF</span>
          </button>
        </div>

        <div *ngIf="!isLoading && predictions.length > 0" class="space-y-3">
          <div *ngFor="let pred of predictions" class="group flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div class="flex-1">
              <div class="flex items-center space-x-3 text-lg font-bold text-white">
                <span class="w-1/3 text-right">{{ pred.localTeam }}</span>
                <span class="text-sm font-normal text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md">VS</span>
                <span class="w-1/3 text-left">{{ pred.awayTeam }}</span>
              </div>
              <div class="mt-2 text-sm text-zinc-400 flex justify-center space-x-2">
                <span>Tu predicción:</span>
                <span *ngIf="editingId !== pred.id" class="font-bold text-indigo-400">{{ getResultText(pred.result) }}</span>
                
                <select *ngIf="editingId === pred.id" [(ngModel)]="editResultValue"
                  class="bg-zinc-800 border border-zinc-600 rounded text-white text-xs px-2 py-1 focus:outline-none focus:border-indigo-500">
                  <option value="L">Local</option>
                  <option value="E">Empate</option>
                  <option value="V">Visitante</option>
                </select>
              </div>
            </div>

            <div class="flex items-center space-x-2 ml-4">
              <ng-container *ngIf="editingId !== pred.id">
                <button (click)="startEdit(pred)" class="p-2 text-zinc-400 hover:text-indigo-400 rounded-lg">Editar</button>
              </ng-container>
              <ng-container *ngIf="editingId === pred.id">
                <button (click)="saveEdit(pred)" class="p-2 text-green-400 rounded-lg">Guardar</button>
                <button (click)="cancelEdit()" class="p-2 text-zinc-400 rounded-lg">Cancelar</button>
              </ng-container>
              <button (click)="deletePrediction(pred.id!)" class="p-2 text-zinc-400 hover:text-red-400 rounded-lg">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProdeComponent implements OnInit, OnDestroy {
  private predictionService = inject(PredictionService);
  private authService = inject(AuthService);
  
  user: User | null = null;
  predictions: Prediction[] = [];
  isLoading = true;
  private authSub: Subscription | undefined;

  newPrediction = { localTeam: '', awayTeam: '', result: '' };
  editingId: string | null = null;
  editResultValue: string = '';

  get isFormValid(): boolean {
    return !!(this.newPrediction.localTeam.trim() && this.newPrediction.awayTeam.trim() && this.newPrediction.result);
  }

  ngOnInit() {
    this.authSub = this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadPredictions(user.uid);
      } else {
        this.isLoading = false;
        this.predictions = [];
      }
    });
  }

  async loadPredictions(userId: string) {
    this.isLoading = true;
    try {
      this.predictions = await this.predictionService.getUserPredictions(userId);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async addPrediction() {
    if (!this.isFormValid || !this.user) return;
    try {
      await this.predictionService.addPrediction({
        userId: this.user.uid,
        localTeam: this.newPrediction.localTeam.trim(),
        awayTeam: this.newPrediction.awayTeam.trim(),
        result: this.newPrediction.result,
        createdAt: Date.now()
      });
      this.newPrediction = { localTeam: '', awayTeam: '', result: '' };
      this.loadPredictions(this.user.uid);
    } catch (error) {
      console.error('Error adding prediction:', error);
    }
  }

  startEdit(pred: Prediction) {
    this.editingId = pred.id || null;
    this.editResultValue = pred.result;
  }

  cancelEdit() {
    this.editingId = null;
    this.editResultValue = '';
  }

  async saveEdit(pred: Prediction) {
    if (!pred.id || !this.editResultValue || this.editResultValue === pred.result) {
      this.cancelEdit();
      return;
    }
    try {
      await this.predictionService.updatePrediction(pred.id, this.editResultValue);
      this.cancelEdit();
      if (this.user) this.loadPredictions(this.user.uid);
    } catch (error) {
      console.error('Error updating prediction:', error);
    }
  }

  async deletePrediction(id: string) {
    if (!id || !confirm('¿Estás seguro?')) return;
    try {
      await this.predictionService.deletePrediction(id);
      if (this.user) this.loadPredictions(this.user.uid);
    } catch (error) {
      console.error('Error deleting prediction:', error);
    }
  }

  logout() {
    this.authService.logout();
  }

  getResultText(val: string): string {
    switch (val) {
      case 'L': return 'Local';
      case 'E': return 'Empate';
      case 'V': return 'Visitante';
      default: return val;
    }
  }

  // MÉTODO PARA EXPORTAR EL PDF
  exportarTicketPDF() {
    if (!this.user || this.predictions.length === 0) return;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text('FutUCH - Ticket de Pronósticos', 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Titular: ${this.user.email}`, 14, 30);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 14, 38);

    const tableBody = this.predictions.map(pred => [
      `${pred.localTeam} vs ${pred.awayTeam}`,
      this.getResultText(pred.result)
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Partido', 'Pronóstico']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
      styles: { fontSize: 11, cellPadding: 4 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save('FutUchTicket.pdf');
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }
}