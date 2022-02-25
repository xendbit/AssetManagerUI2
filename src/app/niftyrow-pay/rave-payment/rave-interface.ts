export interface IRaveParameters{
  PBFPubKey?: string;
  integrity_hash?: string; //This is a sha256 hash of your getpaidSetup values, it is used for passing secured values to the payment gateway
  txref: string; //Unique transaction reference provided by the merchant
  payment_method?: string; // This allows you select the payment option you want for your users, possible values are card, account or both.
  amount: number; //Amount to charge.
  currency?: string; // defaults to NGN currency to charge the card in
  country?: string; // defaults to NG route country.
  customer_email:  string; // ( if customer phone number is not passed )
  customer_phone : string;
  customer_firstname?: string;
  customer_lastname?: string;
  pay_button_text?: string; // Text to be displayed on the Rave Checkout Button.
  custom_title?: string; // Text to be displayed on the Rave Checkout Button.
  custom_description?: string; // Text to be displayed as a short modal description.
  redirect_url?: string; // Text to be displayed as a short modal description.
  custom_logo?: string; // Link to the Logo image.
  onclose?: () => void; // A function to be called when the pay modal is closed.
  callback?: () => void; //A function to be called on successful card charge. User’s can always be redirected to a successful or failed page supplied by the merchant here based on response.
  meta?: IMetaData[];
}
export interface IMetaData {
  metaname: string,
  metavalue: string
}

export module Checkout {

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
}
declare module CheckoutFailed {

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
declare module CheckoutFraudulentTransaction {

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
declare module RecurringTransactionResponse {

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
declare module VBVNotEnrolled {

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



// @todo add Rave Checkout response
export interface IRaveCheckoutResponse extends Checkout.Data {

}

export interface ICheckoutResponse{
  status: string,
  message: string,
  data2:Checkout.Data2,
  customer:Checkout.Customer,
  chargeToken:Checkout.ChargeToken,
  tx:Checkout.Tx,
  data:Checkout.Data
}
export interface ICheckoutFailedResponse {
  status: string,
  message: string,
  data2:CheckoutFailed.Data2,
  customer:CheckoutFailed.Customer,
  tx:CheckoutFailed.Tx,
  data:CheckoutFailed.Data,
  rootObject:CheckoutFailed.RootObject,
}
export interface ICheckoutFraudulentTransaction {
  status: string,
  message: string,
  customer:CheckoutFraudulentTransaction.Customer,
  tx:CheckoutFraudulentTransaction.Tx,
  data:CheckoutFraudulentTransaction.Data,
  rootObject:CheckoutFraudulentTransaction.RootObject,
}
export interface IRecurringTransactionResponse {
  status: string,
  message: string,
  data2:RecurringTransactionResponse.Data2,
  customer:RecurringTransactionResponse.Customer,
  chargeToken:RecurringTransactionResponse.ChargeToken,
  tx:RecurringTransactionResponse.Tx,
  data:RecurringTransactionResponse.Data,
  rootObject:RecurringTransactionResponse.RootObject,
}
export interface IVBVNotEnrolled {
  status: string,
  message: string,
  customer:VBVNotEnrolled.Customer,
  tx:VBVNotEnrolled.Tx,
  data:VBVNotEnrolled.Data,
  rootObject:VBVNotEnrolled.RootObject,
}
export interface IInsufficentFunds {
  customer:InsufficentFunds.Customer,
  tx:InsufficentFunds.Tx,
  data:InsufficentFunds.Data,
  rootObject:InsufficentFunds.RootObject,
}
export interface IDeclinedTransaction {
  customer:DeclinedTransaction.Customer,
  tx:DeclinedTransaction.Tx,
  data:DeclinedTransaction.Data,
  rootObject:DeclinedTransaction.RootObject,
}
