import Admins from "@serv/models/admins";
export async function InitDataBase() {
  const count = await Admins.countDocuments({});
  if (count > 0) return;
  await Admins.create({
    name: "admin",
    password: "admin",
    type: "admin",
  });
}
