import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCreatorsComponent } from './all-creators.component';

describe('AllCreatorsComponent', () => {
  let component: AllCreatorsComponent;
  let fixture: ComponentFixture<AllCreatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCreatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCreatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
