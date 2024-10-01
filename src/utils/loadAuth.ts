import EnvVars from "@serv/declarations/major/EnvVars";
import axios from "axios";
import { IncomingMessage } from "http";

export async function loadAuthData(req?: IncomingMessage) {
  if (typeof window != "undefined") {
    const response = await axios.get(`/api/admin/admins/auth/check`, {
      validateStatus(status) {
        return status < 500;
      },
      withCredentials: true,
    });
    const data = response.data;
    if (!data.status) return null;
    else return data.data as Express.User;
  } else if (req) {
    const protocol = req.headers.referer
      ? req.headers.referer.split(":")[0]
      : "http";
    const response = await axios.get(
      `${protocol}://localhost:${EnvVars.port}/api/admin/admins/auth/check`,
      {
        validateStatus(status) {
          return status < 500;
        },
        headers: req.headers,
      }
    );
    const data = response.data;
    if (!data.status) return null;
    else return data.data as Express.User;
  }
  return null;
}
