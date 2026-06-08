import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

export interface ClinicalEvolution {
  id?: string;
  patientId: string;
  psychologistId: string;
  date: string; // ISO String
  content: string; // Rich text HTML
  sessionId?: string; // Optional session ref
}

@Injectable({
  providedIn: 'root'
})
export class EvolutionService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  getEvolutions(patientId: string): Observable<ClinicalEvolution[]> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    const evolutionsCollection = collection(this.firestore, 'evolutions');
    const q = query(
      evolutionsCollection,
      where('patientId', '==', patientId),
      where('psychologistId', '==', userId)
    );
    return collectionData(q, { idField: 'id' }) as Observable<ClinicalEvolution[]>;
  }

  addEvolution(evolution: Omit<ClinicalEvolution, 'id' | 'psychologistId'>): Observable<string> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    const data: Omit<ClinicalEvolution, 'id'> = {
      ...evolution,
      psychologistId: userId
    };

    const evolutionsCollection = collection(this.firestore, 'evolutions');
    return from(addDoc(evolutionsCollection, data).then(docRef => docRef.id));
  }

  updateEvolution(id: string, data: Partial<Omit<ClinicalEvolution, 'id' | 'psychologistId'>>): Observable<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }
    const evolutionDoc = doc(this.firestore, `evolutions/${id}`);
    return from(updateDoc(evolutionDoc, data));
  }

  deleteEvolution(id: string): Observable<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }
    const evolutionDoc = doc(this.firestore, `evolutions/${id}`);
    return from(deleteDoc(evolutionDoc));
  }
}
