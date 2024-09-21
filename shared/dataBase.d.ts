declare global {
  namespace DataBase {
    type Populate<T, Key extends keyof T, New> = Omit<T, Key> & {
      [key in Key]: New;
    };
    type WithId<T> = T & { _id: string };
    type WithIdOrg<T> = T & { id: string };
    interface Price {
      num: number;
      type: "EGP";
    }
    type PlansType = "day" | "year" | "month";
    namespace Models {
      interface User {
        createdAt: Date;
        createdBy: "admin";
        blocked?: boolean;
        name?: string;
        age?: number;
        tall?: number;
        weight?: number;
        sex?: "male" | "female";
        email?: string;
        emailVerified?: boolean;
        phone?: string;
        details: {
          whyDidYouCame?: string;
        };
        providerId?: string;
        provider_type?: "facebook" | "google" | "linkedin";
      }
      interface Plans {
        name: string;
        createdAt: Date;
        prices: Record<PlansType, Price>;
        details: {
          desc?: string;
        };
      }
      interface Logs {
        createdAt: Date;
        userId: string;
        paymentId: string;
        planId: string;
        createdBy: { type: "Admin" };
      }
      interface Payments {
        planId: string;
        userId: string;
        separated: boolean;
        plan: { type: PlansType; num: number };
        createdAt: Date;
        createdBy: { type: "Admin" };
        paid: Price;
      }
    }
    namespace Queries {
      namespace Payments {
        interface Profit {
          _id: {
            year?: number;
            day?: number;
            month?: number;
            currency: string;
          };
          profit: number;
          paymentCount: number;
        }
      }
    }
  }
}
export {};
