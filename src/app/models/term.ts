import { Sport } from './sport';
import { User } from 'firebase';
import { FirebaseTimestamp } from './interfaces/firebase-timestamp';
export enum TermType {
  PERSONAL_COACH = 'PersonalCoach',
  SPORT_FIELD_PROVIDER = 'SportField',
}
export class Term {
  city: string;
  description: string;
  endDate: any;
  price: number;
  sport: Sport;
  startDate: any;
  title: string;
  profileImage: string;
  type: TermType;
  personalCoach?: User;
  sportFieldProvider: User;
}
