import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { from, Observable, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

export interface ContactLead {
  uid: string;
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
  private authService: AuthService = inject(AuthService);

  saveLead(lead: Omit<ContactLead, 'uid' | 'createdAt'>): Observable<string> {
    return this.authService.user$.pipe(
      take(1),
      switchMap((user) => {
        const completeLead: ContactLead = {
          ...lead,
          uid: user?.uid ?? 'anonymous',
          createdAt: new Date().toISOString()
        };
        const leadsCollection = collection(this.firestore, 'leads');
        const promise = addDoc(leadsCollection, completeLead).then(docRef => docRef.id);
        return from(promise);
      })
    );
  }
}
