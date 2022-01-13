import { Component, OnInit} from '@angular/core';
import { MetamaskService } from 'src/app/core/services/metamask.service';

@Component({
  selector: 'app-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss'],
})
export class ConnectWalletComponent implements OnInit {
  accountFound = false;
  constructor(public metamaskService: MetamaskService) { }

  ngOnInit(): void {
    this.metamaskService.checkConnection().then(res => {
      if (res === undefined || !localStorage.getItem('account')) {
        this.accountFound = false;
      } else {
        this.accountFound = true;
      }
    })
  }

  connectToMetamask() {
    this.metamaskService.openMetamask();
  }

  disconnectFromMetamask() {
    this.metamaskService.disconnectFromClient();
  }

}
