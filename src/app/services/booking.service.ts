import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Term, TermType } from '../models/term';
import { SearchContext } from '../models/interfaces/search-context';
import { Helper } from '../utils/helper';
import { TermResult } from '../models/interfaces/term-result';
import { User, Role } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private termsCollection: AngularFirestoreCollection<Term>;
  private terms: Observable<Term[]>;

  constructor(private firestore: AngularFirestore) {}

  createTerm(termData: any): Promise<any> {
    return this.firestore.collection('terms').add(termData);
  }

  async createNewBooking(bookingData: any) {
    bookingData.personalCoachStatus = 'pending';
    bookingData.sportFieldProvider = 'pending';
    return await this.firestore.collection('bookings').add(bookingData);
  }

  getBookingsForSelectedTerm(termId: string) {
    return this.firestore
      .collection<any>('bookings', (ref) => ref.where('term.id', '==', termId))
      .valueChanges();
  }

  getBookingsForCurrentUser(currentUser: User) {
    if (!currentUser) {
      return null;
    }

    if (currentUser.role === Role.PERSONAL_COACH) {
      return this.firestore
        .collection<any>('bookins', (ref) =>
          ref
            .where('perosnalCoach.user.uid', '==', currentUser.uid)
            .where('canceledByPersonalCoach', '==', false)
            .orderBy('confirmedByPersonalCoach')
        )
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data() as Term;
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        );
    } else if (currentUser.role === Role.SPORT_FIELD_PROVIDER) {
      return this.firestore
        .collection<any>('bookins', (ref) =>
          ref
            .where('sportField.user.uid', '==', currentUser.uid)
            .where('canceledBySportFieldProvider', '==', false)
            .orderBy('confirmedBySportFieldProvider')
        )
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data() as Term;
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        );
    } else {
      return this.firestore
        .collection<any>('bookins', (ref) =>
          ref.where('athlete.uid', '==', currentUser.uid)
        )
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data() as Term;
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        );
    }
  }

  async updateBooking(bookingId: string, value: any, termId?: string) {
    if (termId) {
      const perosnalCoachTermRef = this.firestore
        .collection('terms')
        .doc(termId);
      await perosnalCoachTermRef.update({
        booked: false,
      });
    }
    const bookingRef = this.firestore.collection('bookins').doc(bookingId);
    return await bookingRef.update(value);
  }

  async deleteBooking(
    bookingId: string,
    perosnalCoachTermId: string,
    sportFieldTermId: string
  ) {
    const perosnalCoachTermRef = this.firestore
      .collection('terms')
      .doc(perosnalCoachTermId);
    const sportFieldTermRef = this.firestore
      .collection('terms')
      .doc(sportFieldTermId);
    await perosnalCoachTermRef.update({
      booked: false,
    });
    await sportFieldTermRef.update({
      booked: false,
    });
    return await this.firestore.collection('bookins').doc(bookingId).delete();
  }

  getTermsForCurrentUser(userId: string): Observable<Term[]> {
    return this.firestore
      .collection<Term>('terms', (ref) => ref.where('user.uid', '==', userId))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Term;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  deleteTerm(termId: string): Promise<any> {
    return this.firestore.collection('terms').doc(termId).delete();
  }

  findTerms(searchData: SearchContext): Observable<Term[]> {
    const { city, startDate, endDate, sport } = searchData;
    startDate.setHours(0);
    startDate.setMinutes(0);
    endDate.setHours(23);
    endDate.setMinutes(59);
    return this.firestore
      .collection<Term>('terms', (ref) =>
        ref
          .where('city', '==', city)
          .where('sport', '==', sport)
          .where('endDate', '>=', startDate)
          .where('endDate', '<=', endDate)
          .where('booked', '==', false)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Term;
            if (Helper.convertTimestampToDate(data?.startDate) >= startDate) {
              const id = a.payload.doc.id;
              return { id, ...data };
            }
          })
        )
      );
  }

  async updateUserImageInTerms(userId: string, imageURL: string) {
    this.firestore
      .collection('terms', (ref) => ref.where('user.uid', '==', userId))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Term;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      )
      .subscribe((terms) => {
        //TODO set images in terms
      });
  }

  getMatchingResultsForSearch(terms: Term[]) {
    const resultsArray: TermResult[] = [];
    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      term.startDate = Helper.convertTimestampToDate(term.startDate);
      term.endDate = Helper.convertTimestampToDate(term.endDate);
      let result: any = {};
      for (let j = i + 1; j < terms.length; j++) {
        const element = terms[j];
        if (term.type === TermType.PERSONAL_COACH) {
          if (term.type !== element.type) {
            resultsArray.push({
              personalCoachTerm: term,
              sportFieldTerm: element,
            });
          } else {
            continue;
          }
        } else {
          if (term.type !== element.type) {
            resultsArray.push({
              personalCoachTerm: element,
              sportFieldTerm: term,
            });
          } else {
            continue;
          }
        }
      }
    }
    return resultsArray;
  }

  async bookTerms(
    perosnalCoachTerm: any,
    sportFieldTerm: any,
    athlete: any
  ): Promise<boolean> {
    const perosnalCoachTermRef = this.firestore
      .collection('terms')
      .doc(perosnalCoachTerm.id);
    const sportFieldTermRef = this.firestore
      .collection('terms')
      .doc(sportFieldTerm.id);

    const bookingRef = this.firestore.collection('bookins');

    try {
      await perosnalCoachTermRef.update({
        booked: true,
      });
      await sportFieldTermRef.update({
        booked: true,
      });
      await bookingRef.add({
        sportField: sportFieldTerm,
        perosnalCoach: perosnalCoachTerm,
        athlete: athlete,
        confirmedByPersonalCoach: false,
        confirmedBySportFieldProvider: false,
        canceledByPersonalCoach: false,
        canceledBySportFieldProvider: false,
      });
    } catch (error) {
      return false;
    }
    return true;
  }
}
