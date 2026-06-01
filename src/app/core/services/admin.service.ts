import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ContactLead } from './contact.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private firestore: Firestore = inject(Firestore);

  /**
   * Returns all leads from the 'leads' collection, ordered by createdAt descending (newest first).
   */
  getLeads(): Observable<ContactLead[]> {
    const leadsCollection = collection(this.firestore, 'leads');
    const orderedQuery = query(leadsCollection, orderBy('createdAt', 'desc'));
    return collectionData(orderedQuery, { idField: 'id' }) as Observable<ContactLead[]>;
  }
}
