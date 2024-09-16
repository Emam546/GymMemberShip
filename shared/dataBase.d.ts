declare global {
  namespace DataBase {
    type WithId<T> = T & { _id: string };
    interface Price {
      num: number;
      type: "EGP";
    }
    type PlansType = "day" | "year" | "month";
    namespace Models {
      interface User {
        createdAt: number;
        createdBy: "admin";
        name?: string;
        age?: number;
        tall?: number;
        weight?: number;
        sex?: "male" | "female";
        email?: string;
        phone?: string;
        details: {
          whyDidYouCame?: string;
        };
        providerId?: string;
        provider_type?: "facebook" | "google" | "linkedin";
      }
      interface Plans {
        name: string;
        createdAt: number;
        prices: Partial<Record<PlansType, Price>>;
        details: {
          desc?: string;
        };
      }
      interface Transaction {
        planId: string;
        userId: string;
        separated: boolean;
        plan: { type: PlansType; num: number };
        createdAt: number;
        createdBy: { type: "Admin" };
      }
    }
  }
}
export {};
