import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCollectorsComponent } from './all-collectors.component';

describe('AllCollectorsComponent', () => {
  let component: AllCollectorsComponent;
  let fixture: ComponentFixture<AllCollectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCollectorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCollectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
