export enum AppEventType {
    ClickedOnNotification = 'CLICKED_ON_NOTIFICATION',
    SocketEvent = 'SOCKET_EVENT',
  }

  export class AppEvent<T> {
    constructor(
      public type: AppEventType,
      public payload: T,
    ) {}
  }