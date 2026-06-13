import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, map, from } from 'rxjs';
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
    return (collectionData(orderedQuery, { idField: 'id' }) as Observable<ContactLead[]>).pipe(
      map(leads => leads.filter(lead => lead.status !== 'converted'))
    );
  }

  markLeadAsConverted(leadId: string): Observable<void> {
    const leadDoc = doc(this.firestore, `leads/${leadId}`);
    return from(updateDoc(leadDoc, { status: 'converted' }));
  }
}
