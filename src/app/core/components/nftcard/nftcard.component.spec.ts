import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NFTCardComponent } from './nftcard.component';

describe('NFTCardComponent', () => {
  let component: NFTCardComponent;
  let fixture: ComponentFixture<NFTCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NFTCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NFTCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
