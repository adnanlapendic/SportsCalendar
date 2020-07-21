import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalCoachComponent } from './personal-coach.component';

describe('PersonalCoachComponent', () => {
  let component: PersonalCoachComponent;
  let fixture: ComponentFixture<PersonalCoachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalCoachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
