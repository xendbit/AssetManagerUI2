import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConnectWalletComponent } from './connect-wallet.component';

describe('ConnectWalletComponent', () => {
  let component: ConnectWalletComponent;
  let fixture: ComponentFixture<ConnectWalletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
