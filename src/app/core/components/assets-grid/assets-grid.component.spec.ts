import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetsGridComponent } from './assets-grid.component';

describe('AssetsGridComponent', () => {
  let component: AssetsGridComponent;
  let fixture: ComponentFixture<AssetsGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
