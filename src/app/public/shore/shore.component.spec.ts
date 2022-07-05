import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoreComponent } from './shore.component';

describe('ShoreComponent', () => {
  let component: ShoreComponent;
  let fixture: ComponentFixture<ShoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
