import {PaymentGatewayMode} from '../interfaces/payment.interfaces';

export interface IFlutterwaveCredentials{
  activeMode: PaymentGatewayMode;
  modes: {
    [key: string]: IFlutterwaveEnvData;
  };
  redirectUrl?: string;
  currency?: string;
  paymentMethod?: string;
  initializeUrl?: string;
}
export interface IFlutterwaveEnvData{
  publicKey: string,
  isProduction?:boolean
}

export interface ICustomer{
  email:string,
  phonenumber:string,
  name:string
}
export interface  ICustomise{
  title:string,
  description:string,
  logo:string
}

export interface IFlutterwaveParameters{
  public_key:string;
  tx_ref: string; //Unique transaction reference provided by the merchant
  amount: number; //Amount to charge.
  currency?: string; // defaults to NGN currency to charge the card in
  country?:string;
  integrity_hash?: string; //This is a sha256 hash of your getpaidSetup values, it is used for passing secured values to the payment gateway
  payment_options: string; // This allows you select the payment option you want for your users, possible values are card, account or both.
  payment_plan?: string; // This is the payment plan ID used for Recurring billing
  redirect_url: string; // Text to be displayed as a short modal description.
  customer:ICustomer;
  subaccounts?:Array<any>;
  meta?: IFwMetaData[];
  customizations:ICustomise;
  onclose?: () => void; // A function to be called when the pay modal is closed.
  callback?: (response: IFlutterwaveCheckoutResponse) => void; //A function to be called on successful card charge. User’s can always be redirected to a successful or failed page supplied by the merchant here based on response.
}
export interface IFwMetaData {
  metaname: string,
  metavalue: string
}

export module ICheckout {

    export interface Data2 {
        // responsecode: string = '00';
        // responsemessage: string = 'successful';
        responsecode: string ;
        responsemessage: string
    }

    export interface Customer {
        id: number;
        phone?: any;
        fullName: string;
        customertoken?: any;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        AccountId: number;
    }

    export interface ChargeToken {
        user_token: string;
        embed_token: string;
    }

    export interface Tx {
        id: number;
        txRef: string;
        orderRef: string;
        flwRef: string;
        redirectUrl: string;
        device_fingerprint: string;
        settlement_token?: any;
        cycle: string;
        amount: number;
        charged_amount: number;
        appfee: number;
        merchantfee: number;
        merchantbearsfee: number;
        chargeResponseCode: string //= '00';
        chargeResponseMessage: string;
        authModelUsed: string;
        currency: string;
        IP: string;
        narration: string;
        status: string;
        vbvrespmessage: string;
        authurl: string;
        vbvrespcode: string //= '00';
        acctvalrespmsg?: any;
        acctvalrespcode?: any;
        paymentType: string;
        paymentId: string;
        fraud_status: string;
        charge_type: string;
        is_live: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        customerId: number;
        AccountId: number;
        customer: Customer;
        chargeToken: ChargeToken;
    }

    export interface Data {
        data: Data2;
        tx: Tx;
    }

    export interface RootObject {
        status: string;
        message: string;
        data: Data;
    }

    export interface IFlutterwaveResponse {
      amount:number;
      currency:string;
      customer:ICustomer;
      flw_ref:string;
      status:string;
      tx_ref:string;
      transaction_id:string;
    }
}
declare module ICheckoutFailed {

    export interface Data2 {
        responsetoken?: any;
        responsecode: string //='RR';
        responsemessage: string;
        transactionreference: string;
        otptransactionidentifier?: any;
        responsehtml?: any;
        redirecturl?: any;
        avsresponsecode?: any;
        avsresponsemessage?: any;
    }

    export interface Customer {
        id: number;
        phone?: any;
        fullName: string;
        customertoken?: any;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        AccountId: number;
    }

    export interface Tx {
        id: number;
        txRef: string;
        orderRef: string;
        flwRef: string;
        redirectUrl: string;
        device_fingerprint: string;
        settlement_token?: any;
        cycle: string;
        amount: number;
        charged_amount: number;
        appfee: number;
        merchantfee: number;
        merchantbearsfee: number;
        chargeResponseCode: string //= '02';
        chargeResponseMessage: string;
        authModelUsed: string;
        currency: string;
        IP: string;
        narration: string;
        status: string;
        vbvrespmessage: string;
        authurl: string;
        vbvrespcode: string //='02';
        acctvalrespmsg?: any;
        acctvalrespcode?: any;
        paymentType: string;
        paymentId: string;
        fraud_status: string;
        charge_type: string;
        is_live: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        customerId: number;
        AccountId: number;
        customer: Customer;
    }

    export interface Data {
        data: Data2;
        tx: Tx;
    }

    export interface RootObject {
        status: string;
        message: string;
        data: Data;
    }

}
declare module ICheckoutFraudulentTransaction {

    export interface Customer {
        id: number;
        phone?: any;
        fullName: string;
        customertoken?: any;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        AccountId: number;
    }

    export interface Tx {
        id: number;
        txRef: string;
        orderRef: string;
        flwRef: string;
        redirectUrl: string;
        device_fingerprint: string;
        settlement_token?: any;
        cycle: string;
        amount: number;
        charged_amount: number;
        appfee: number;
        merchantfee: number;
        merchantbearsfee: number;
        chargeResponseCode: string;
        chargeResponseMessage: string;
        authModelUsed: string;
        currency: string;
        IP: string;
        narration: string;
        status: string;
        vbvrespmessage: string;
        authurl: string;
        vbvrespcode: string //= 'MRA';
        acctvalrespmsg?: any;
        acctvalrespcode?: any;
        paymentType: string;
        paymentId: string;
        fraud_status: string;
        charge_type: string;
        is_live: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        customerId: number;
        AccountId: number;
        customer: Customer;
    }

    export interface Data {
        code: string //= 'FLW_ERR';
        message: string;
        tx: Tx;
    }

    export interface RootObject {
        status: string;
        message: string;
        data: Data;
    }

}
declare module IRecurringTransactionResponse {

    export interface Data2 {
        responsecode: string //= '00';
        responsemessage: string //= 'successful';
    }

    export interface Customer {
        id: number;
        phone?: any;
        fullName: string;
        customertoken?: any;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        AccountId: number;
    }

    export interface ChargeToken {
        user_token: string;
        embed_token: string;
    }

    export interface Tx {
        id: number;
        txRef: string;
        orderRef: string;
        flwRef: string;
        redirectUrl: string;
        device_fingerprint: string;
        settlement_token?: any;
        cycle: string;
        amount: number;
        charged_amount: number;
        appfee: number;
        merchantfee: number;
        merchantbearsfee: number;
        chargeResponseCode: string //= '00';
        chargeResponseMessage: string;
        authModelUsed: string;
        currency: string;
        IP: string;
        narration: string;
        status: string;
        vbvrespmessage: string //= 'successful';
        authurl: string;
        vbvrespcode: string // = '00';
        acctvalrespmsg?: any;
        acctvalrespcode?: any;
        paymentType: string;
        paymentId: string;
        fraud_status: string;
        charge_type: string;
        is_live: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        customerId: number;
        AccountId: number;
        customer: Customer;
        chargeToken: ChargeToken;
    }

    export interface Data {
        data: Data2;
        tx: Tx;
    }

    export interface RootObject {
        status: string;
        message: string;
        data: Data;
    }

}
declare module IVBVNotEnrolled {

    export interface Customer {
        id: number;
        phone?: any;
        fullName: string;
        customertoken?: any;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        AccountId: number;
    }

    export interface Tx {
        id: number;
        txRef: string;
        orderRef: string;
        flwRef: string;
        redirectUrl: string;
        device_fingerprint: string;
        settlement_token?: any;
        cycle: string;
        amount: number;
        charged_amount: number;
        appfee: number;
        merchantfee: number;
        merchantbearsfee: number;
        chargeResponseCode: string //= 'RR';
        chargeResponseMessage: string;
        authModelUsed: string;
        currency: string;
        IP: string;
        narration: string;
        status: string;
        vbvrespmessage: string;
        authurl: string;
        vbvrespcode: string //= 'RR';
        acctvalrespmsg?: any;
        acctvalrespcode?: any;
        paymentType: string;
        paymentId: string;
        fraud_status: string;
        charge_type: string;
        is_live: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        customerId: number;
        AccountId: number;
        customer: Customer;
    }

    export interface Data {
        code: string //= 'FLW_ERR';
        message: string //= 'NOT_ENROLLED_NO_ERROR_DETAILS';
        tx: Tx;
    }

    export interface RootObject {
        status: string //= 'error';
        message: string //= 'NOT_ENROLLED_NO_ERROR_DETAILS';
        data: Data;
    }

}
declare module InsufficentFunds {

    export interface Customer {
        id: number;
        phone?: any;
        fullName: string;
        customertoken?: any;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        AccountId: number;
    }

    export interface Tx {
        id: number;
        txRef: string;
        orderRef: string;
        flwRef: string;
        redirectUrl: string;
        device_fingerprint: string;
        settlement_token?: any;
        cycle: string;
        amount: number;
        charged_amount: number;
        appfee: number;
        merchantfee: number;
        merchantbearsfee: number;
        chargeResponseCode: string //= 'FLW_ERR';
        chargeResponseMessage: string;
        authModelUsed: string;
        currency: string;
        IP: string;
        narration: string;
        status: string;
        vbvrespmessage: string //= 'Insufficient Funds';
        authurl: string;
        vbvrespcode: string //= 'ISF';
        acctvalrespmsg?: any;
        acctvalrespcode?: any;
        paymentType: string;
        paymentId: string;
        fraud_status: string;
        charge_type: string;
        is_live: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        customerId: number;
        AccountId: number;
        customer: Customer;
    }

    export interface Data {
        code: string //= 'FLW_ERR';
        message: string //= 'Insufficient Funds';
        tx: Tx;
    }

    export interface RootObject {
        status: string // = 'error';
        message: string //= 'Insufficient Funds';
        data: Data;
    }

}
declare module DeclinedTransaction {

    export interface Customer {
        id: number;
        phone?: any;
        fullName: string;
        customertoken?: any;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        AccountId: number;
    }

    export interface Tx {
        id: number;
        txRef: string;
        orderRef: string;
        flwRef: string;
        redirectUrl: string;
        device_fingerprint: string;
        settlement_token?: any;
        cycle: string;
        amount: number;
        charged_amount: number;
        appfee: number;
        merchantfee: number;
        merchantbearsfee: number;
        chargeResponseCode: string //= 'DBN';
        chargeResponseMessage: string;
        authModelUsed: string;
        currency: string;
        IP: string;
        narration: string;
        status: string;
        vbvrespmessage: string;
        authurl: string;
        vbvrespcode: string //= 'DBN';
        acctvalrespmsg?: any;
        acctvalrespcode?: any;
        paymentType: string;
        paymentId: string;
        fraud_status: string;
        charge_type: string;
        is_live: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: any;
        customerId: number;
        AccountId: number;
        customer: Customer;
    }

    export interface Data {
        code: string //= 'FLW_ERR';
        message: string;
        tx: Tx;
    }

    export interface RootObject {
        status: string //= 'error';
        message: string;
        data: Data;
    }

}



// @todo add Flutterwave Checkout response
export interface IFlutterwaveCheckoutResponse extends ICheckout.IFlutterwaveResponse {

}
