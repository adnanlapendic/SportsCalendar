export enum Role {
  PERSONAL_COACH = 'Personal coach',
  SPORT_FIELD_PROVIDER = 'Sport field provider',
  ATHLETE = 'Athlete',
}

export class User {
  uid: string;
  email: string;
  name: string;
  phone: string;
  image: string;
  address: string;
  role: string;
  about: string;
  city: string;
  password?: string;
}
