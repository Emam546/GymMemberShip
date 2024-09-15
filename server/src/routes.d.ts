declare global {
  namespace Routes {
    type ResponseSuccess<T = null> = { success: true; msg: string; data: T };
    interface Paths {
      admin: {
        user: {
          create: {
            post: {
              user: DataBase.WithId<DataBase.Models.User>;
            };
          };
        };
      };
    }
  }
}
export {};
