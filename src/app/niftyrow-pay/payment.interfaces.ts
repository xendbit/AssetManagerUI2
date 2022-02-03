// import * as ns from '../../../../node_modules/core/src/ts/util/util.interfaces';

// import {PaymentGatewayMode} from '../rave-payment/rave-payment.service';

export enum PaymentGatewayMode{
  TEST = 'test',
  LIVE = 'live'
}
export enum GatewayTypes{
  PAYSTACK = 'paystack',
  RAVE = 'ravepay',
  FLUTTERWAVE = 'flutterwave'
}
export type IErrorHandler = (_type: string, _function: string, _message: string) => void;

export type IPaymentSuccess = (orderId?: number | string, transactionRef?: string, paymentMethod?: GatewayTypes, _reference?: any) => void;

export interface IErrorResult {
    success: boolean,
    error: string,
    resultSet: any
}
export interface IFieldlist {
    // field: string,
    // value: any
  [key: string]: any;
}
export interface IPaystackEnvData{
  publicKey: string;
  isProduction?:boolean;
  callbackUrl: string;
}
export interface IPaymentGatewayDetails {
  activeMode: PaymentGatewayMode;
  modes: {
    [key: string]: IPaystackEnvData;
  };
  redirectUrl?: string;
  currency?: string;
  paymentMethod?: string;
  initializeUrl?: string;
}
export interface IPaystackDetails extends IPaymentGatewayDetails{

}
export interface ISingleItemPayment{
  qty: string;
  userId: string;
  itemId: string;
}


/**
 *
 */
export interface IPayment {

    /**
     * used to make a payment via a payment Handler that implements this interface
     *
     * @param _transactionId unique reference or transactionId
     * @param _amount the amount being paid
     * @param _options a fieldlist of key > value pairs that can be used by the implementing classes to pass in additional value not supported in the argument list
     * @param _onSuccess inovked when a payment has been made succesfully
     * @param _onComplete? the function to be invoked when a payment has been succesfull
     * @param _onStart? the function to be invoked before a call to the payment gateway
     * @param _onCancel? function to be invoked when the user cancels a payment
     * @param _onFail? the function to be invoked if the payment fails
     * @param _itemId? the id/reference of the the item being purchased
     */
    makePayment(
      _transactionId: string,
      _amount: number,
      _options: IFieldlist,
      _onSuccess: Function,
      _onComplete?: Function,
      _onStart?: Function,
      _onCancel?: Function,
      _onFail?: Function,
      _item?:ISingleItemPayment
    ):  void;

    /**
     * invoked when a user cancels a payment request after attempting to make a payment
     *
     * @param _fieldset a key:value object of optional parameters
     */
    onCancel(_fieldset: IFieldlist): void;

    /**
     * invoked when a response is returned after the result of a payment or cancellation request
     *
     * @param _fieldset a key:value object of optional parameters
     */
    onReceiveMsg(_fieldset: IFieldlist): void;

    /**
     * A function to be used to perform any pre-usage intialisations that the implementing gateway may require
     *
     * @param _fieldset initialises the gateway with any parameters required by it, e.g. unique public key
     */
    init(_fieldset?: IFieldlist[]): void;


    /**
     * updates the payment gateway keys and other settings
     * @param IPaymentGatewayDetails _details
     */
    updateDetails(_details:IPaymentGatewayDetails);


    initPayment(_dataSet:any):Promise<any>;

    getDetails():IPaymentGatewayDetails;
}

