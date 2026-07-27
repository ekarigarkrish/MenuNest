declare module "@cashfreepayments/cashfree-js" {
  export interface Cashfree {
    checkout(options: {
      paymentSessionId: string;
      redirectTarget?: "_self" | "_blank";
    }): Promise<any>;
  }

  export function load(options?: {
    mode?: "sandbox" | "production" | undefined;
  }): Promise<Cashfree>;
}