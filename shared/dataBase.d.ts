declare global {
  namespace DataBase {
    type WithId<T> = T & { id: string };
    interface Price {
      num: number;
      type: "EGP";
    }
    type PlansType = "day" | "year" | "month";
    namespace Models {
      interface User {
        signedIn: number;
        signedInBy: "admin";
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
        desc: string;
        price: Record<PlansType, DataBase.PlansType>;
      }
      interface Transaction {
        planId: string;
        userId: string;
        plan: { type: PlansType; num: number };
        signedIn: number;
        createdBy: { type: "Admin" };
      }
    }
  }
}
export {};
