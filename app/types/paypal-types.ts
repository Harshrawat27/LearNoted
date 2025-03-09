// PayPal API typings

export interface PayPalCreateActions {
  subscription: {
    create: (options: { plan_id: string }) => Promise<string>;
  };
}

export interface PayPalOnApproveData {
  subscriptionID: string;
  orderID?: string;
  payerID?: string;
  facilitatorAccessToken?: string;
}

export interface PayPalOnApproveActions {
  redirect: () => Promise<void>;
  restart: () => Promise<void>;
  subscription: {
    get: () => Promise<any>;
  };
}
