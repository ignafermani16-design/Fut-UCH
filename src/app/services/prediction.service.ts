import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Prediction {
  id?: string;
  userId: string;
  localTeam: string;
  awayTeam: string;
  result: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private firestore: Firestore = inject(Firestore);

  // CREATE
  addPrediction(prediction: Prediction): Promise<any> {
    const predictionsRef = collection(this.firestore, 'predictions');
    return addDoc(predictionsRef, prediction);
  }

  // READ (Reescrito usando onSnapshot nativo para evadir el error de instancia)
  getUserPredictions(userId: string): Observable<Prediction[]> {
    return new Observable<Prediction[]>(observer => {
      const predictionsRef = collection(this.firestore, 'predictions');
      const q = query(predictionsRef, where('userId', '==', userId));

      // onSnapshot escucha los cambios en tiempo real sin requerir validaciones de SDK
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const predictions = snapshot.docs.map(docSnap => ({
          id: docSnap.id, // Extraemos el ID del documento
          ...docSnap.data() // Extraemos los datos (localTeam, awayTeam, etc.)
        })) as Prediction[];
        
        observer.next(predictions); // Enviamos los datos procesados al componente
      }, (error) => {
        console.error("Error en Firebase Listener:", error);
        observer.error(error);
      });

      // Se ejecuta al destruir el componente para liberar memoria
      return () => unsubscribe();
    });
  }

  // UPDATE
  updatePrediction(id: string, newResult: string): Promise<void> {
    const predictionDocRef = doc(this.firestore, `predictions/${id}`);
    return updateDoc(predictionDocRef, { result: newResult });
  }

  // DELETE
  deletePrediction(id: string): Promise<void> {
    const predictionDocRef = doc(this.firestore, `predictions/${id}`);
    return deleteDoc(predictionDocRef);
  }
}