import { Injectable, inject } from '@angular/core';
// TODO debe venir de @angular/fire/firestore
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';

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

  async addPrediction(prediction: Prediction): Promise<any> {
    const predictionsRef = collection(this.firestore, 'predictions');
    return addDoc(predictionsRef, prediction);
  }

  async getUserPredictions(userId: string): Promise<Prediction[]> {
    const predictionsRef = collection(this.firestore, 'predictions');
    const q = query(predictionsRef, where('userId', '==', userId));
    
    const querySnapshot = await getDocs(q);
    const predictions: Prediction[] = [];
    
    querySnapshot.forEach((docSnap) => {
      predictions.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Prediction, 'id'>)
      });
    });
    
    return predictions.sort((a, b) => b.createdAt - a.createdAt);
  }

  async updatePrediction(id: string, newResult: string): Promise<void> {
    const predictionDocRef = doc(this.firestore, `predictions/${id}`);
    return updateDoc(predictionDocRef, { result: newResult });
  }

  async deletePrediction(id: string): Promise<void> {
    const predictionDocRef = doc(this.firestore, `predictions/${id}`);
    return deleteDoc(predictionDocRef);
  }
}