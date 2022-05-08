import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuratorsOfTheWeekComponent } from './curators-of-the-week.component';

describe('CuratorsOfTheWeekComponent', () => {
  let component: CuratorsOfTheWeekComponent;
  let fixture: ComponentFixture<CuratorsOfTheWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuratorsOfTheWeekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuratorsOfTheWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
