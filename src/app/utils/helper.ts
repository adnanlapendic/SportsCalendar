import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { FirebaseTimestamp } from '../models/interfaces/firebase-timestamp';

export class Helper {
  static convertTimestampToDate(timestamp: FirebaseTimestamp): Date {
    return new Date(timestamp.seconds * 1000);
  }
}
