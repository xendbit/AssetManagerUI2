import {
  Component,
  OnInit,
  Output,
  Input,
  ComponentFactoryResolver,
  OnDestroy,
  ViewContainerRef, ViewChild, ComponentRef, AfterViewInit, Inject, Optional
} from '@angular/core';
// import {PAYSTACK_KEY} from './paystack-key.token';
import { EventEmitter } from '@angular/core';
// import { Angular4PaystackEmbed } from 'angular4-paystack';

export interface ITransactionFields {
  // text: string
  key?: string;
  email: string;
  amount: number;
  metadata?: {};
  ref: string;
  currency?: string;
  plan?: string;
  quantity?: string;
  subaccount?: string;
  transaction_charge?: number;
  bearer?: string;
  walletType?:string;
  [key: string]: any;
}

@Component({
  selector: 'app-payment',
  template: '<ng-template #target><ng-content></ng-content></ng-template>',
  // styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() transactionFields: ITransactionFields = {key: null, email: '', ref: '', amount: 0};
  @Input() class: string;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  // @Output() onFailure: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel:  EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('target', { read: ViewContainerRef })
  target: ViewContainerRef;
  // private componentRef: ComponentRef<Angular4PaystackEmbed>;
  constructor(
    // private appConfig,
    // private Authenticate,
    private compiler: ComponentFactoryResolver,
    // @Inject(PAYSTACK_KEY) @Optional() private paystackKey: string
  ) {
    // if (this.paystackKey) {
    //   this.transactionFields.key = this.paystackKey;
    // }
  }
  paymentDone($event: any) {
    // this.paystack.onReceiveMsg($event);
    this.onSuccess.emit($event);
  }
  paymentCancel() {
    // this.paystack.onCancel(null);
    this.onCancel.emit();
  }
  ngOnInit() {}
  ngAfterViewInit() {
    // const componentFactory = this.compiler.resolveComponentFactory(
    //   Angular4PaystackEmbed
    // );
    // this.componentRef = this.target.createComponent(componentFactory);
    // const paystackComponent = this.componentRef.instance;
    // Object.keys(this.transactionFields).forEach((key) => {
    //   (<any>paystackComponent)[key] = (<any>this.transactionFields)[key];
    // });
    // paystackComponent = Object.assign({}, paystackComponent, this.transactionFields);
    // if (!paystackComponent.key && !this.paystackKey) {
    //     throw Error('Missing Public Key');
    // }
    // paystackComponent.class = this.class || '';
    // paystackComponent.key = paystackComponent.key || this.paystackKey;
    // paystackComponent.text = 'Pay with Paystack';
    // paystackComponent.callback.subscribe(($event: any) => {
    //   return this.paymentDone($event);
    // });
    // paystackComponent.close.subscribe(() => this.paymentCancel());
  }
  ngOnDestroy() {
    // if (this.componentRef) {
    //   this.componentRef.destroy();
    //   this.componentRef = null;
    // }
  }
}
