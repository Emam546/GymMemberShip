declare global {
  namespace DataBase {
    type Populate<T, Key extends keyof T, New> = Omit<T, Key> & {
      [key in Key]: New;
    };
    type WithId<T> = T & { _id: string };
    type WithIdOrg<T> = T & { id: string };
    type Price = number;
    type PlansType = "day" | "year" | "month";
    namespace Populate {
      interface _G {
        adminId: Models.Admins;
        planId: Models.Plans;
        userId: Models.User;
        trainerId: Models.Trainers;
        paymentId: Models.Payments;
      }
      type _Dic<T, Name extends keyof _G & keyof T> = DataBase.WithId<_G[Name]>;

      type Model<T, C extends keyof _G & keyof T> = Omit<T, C> & {
        [key in C]?: _Dic<T, key>;
      };
    }
    namespace Models {
      interface Counter {
        name: string;
        seq: number;
      }
      interface Trainers {
        name: string;
        email?: string;
        phone?: string;
      }
      interface User {
        createdAt: Date;
        createdBy: "admin";
        adminId: string;
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
        barcode: number;
        provider_type?: "facebook" | "google" | "linkedin";
      }
      interface Plans {
        name: string;
        createdAt: Date;
        adminId: string;
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
        createdBy: "Admin";
        adminId: string;
        trainerId?: string;
      }
      interface Payments {
        logsCount: number;
        planId: string;
        userId: string;
        plan: { type: PlansType; num: number };
        createdAt: Date;
        startAt: Date;
        endAt: Date;
        createdBy: "Admin";
        adminId: string;
        trainerId?: string;
        paid: Price;
        remaining: Price;
      }
      interface Admins {
        name: string;
        password: string;
        email?: string;
        phone?: string;
        type: "admin" | "assistant";
      }
    }
    namespace Queries {
      namespace Payments {
        interface Profit {
          _id: {
            year?: number;
            day?: number;
            month?: number;
          };
          profit: number;
          paymentCount: number;
        }
      }
      namespace Logs {
        interface LogsCount {
          _id: {
            year?: number;
            day?: number;
            month?: number;
          };
          count: number;
        }
      }
    }
  }
}
export {};
