import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export interface ClinicalSession {
  id?: string;
  patientId: string;
  patientName: string;
  date: string;
  duration: number;
  price: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private firestore: Firestore = inject(Firestore);

  getSessions(): Observable<ClinicalSession[]> {
    const sessionsCollection = collection(this.firestore, 'sessions');
    const orderedQuery = query(sessionsCollection, orderBy('date', 'asc'));
    return collectionData(orderedQuery, { idField: 'id' }) as Observable<ClinicalSession[]>;
  }

  getSession(id: string): Observable<ClinicalSession | undefined> {
    const sessionDoc = doc(this.firestore, `sessions/${id}`);
    return docData(sessionDoc, { idField: 'id' }) as Observable<ClinicalSession | undefined>;
  }

  addSession(session: Omit<ClinicalSession, 'id'>): Observable<string> {
    const sessionsCollection = collection(this.firestore, 'sessions');
    return from(addDoc(sessionsCollection, session).then(docRef => docRef.id));
  }

  updateSession(id: string, data: Partial<Omit<ClinicalSession, 'id'>>): Observable<void> {
    const sessionDoc = doc(this.firestore, `sessions/${id}`);
    return from(updateDoc(sessionDoc, data));
  }

  deleteSession(id: string): Observable<void> {
    const sessionDoc = doc(this.firestore, `sessions/${id}`);
    return from(deleteDoc(sessionDoc));
  }
}
