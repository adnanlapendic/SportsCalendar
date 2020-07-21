import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SportFieldProviderComponent } from './sport-field-provider.component';

describe('SportFieldProviderComponent', () => {
  let component: SportFieldProviderComponent;
  let fixture: ComponentFixture<SportFieldProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SportFieldProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportFieldProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
