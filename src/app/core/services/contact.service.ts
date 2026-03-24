import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

export interface ContactLead {
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private firestore: Firestore = inject(Firestore);

  saveLead(lead: ContactLead): Observable<string> {
    const leadsCollection = collection(this.firestore, 'leads');
    // Save to the 'leads' collection in Firestore
    const promise = addDoc(leadsCollection, lead).then(docRef => docRef.id);
    return from(promise);
  }
}
