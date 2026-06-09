import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, orderBy, deleteField } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export interface ActivePackage {
  totalSessions: number;
  usedSessions: number;
  totalValue: number;
  createdAt: string;
}

export interface Patient {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  ageGroup?: 'Criança' | 'Adolescente' | 'Adulto' | 'Idoso';
  clinicPercentage?: number;
  activePackage?: ActivePackage;
  status: 'active' | 'inactive';
  createdAt: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private firestore: Firestore = inject(Firestore);

  getPatients(): Observable<Patient[]> {
    const patientsCollection = collection(this.firestore, 'patients');
    const orderedQuery = query(patientsCollection, orderBy('createdAt', 'desc'));
    return collectionData(orderedQuery, { idField: 'id' }) as Observable<Patient[]>;
  }

  getPatient(id: string): Observable<Patient | undefined> {
    const patientDoc = doc(this.firestore, `patients/${id}`);
    return docData(patientDoc, { idField: 'id' }) as Observable<Patient | undefined>;
  }

  addPatient(patient: Omit<Patient, 'id'>): Observable<string> {
    const patientsCollection = collection(this.firestore, 'patients');
    return from(addDoc(patientsCollection, patient).then(docRef => docRef.id));
  }

  updatePatient(id: string, data: Partial<Omit<Patient, 'id'>>): Observable<void> {
    const patientDoc = doc(this.firestore, `patients/${id}`);
    return from(updateDoc(patientDoc, data));
  }

  deleteActivePackage(id: string): Observable<void> {
    const patientDoc = doc(this.firestore, `patients/${id}`);
    return from(updateDoc(patientDoc, { activePackage: deleteField() }));
  }

  deletePatient(id: string): Observable<void> {
    const patientDoc = doc(this.firestore, `patients/${id}`);
    return from(deleteDoc(patientDoc));
  }
}
