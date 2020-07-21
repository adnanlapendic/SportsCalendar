import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Sport } from '../models/sport';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SportService {
  private sportsCollection: AngularFirestoreCollection<Sport>;
  private sports: Observable<Sport[]>;

  constructor(private firestore: AngularFirestore) {
    this.sportsCollection = firestore.collection<Sport>('sports');

    this.sports = this.sportsCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Sport;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getSports(): Observable<Sport[]> {
    return this.sports;
  }
}
