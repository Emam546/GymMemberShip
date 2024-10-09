import Validator from "validator-checker-js";
import { Router } from "express";
import { MessageMedia } from "whatsapp-web.js";
import whatsappClient, { isConnected } from "@serv/whatsapp";
const router = Router();
const registerValidator = new Validator({
  number: [{ regExp: /^[1-9]\d{6,14}$/i }, "string", "required"],
  messages: [
    {
      message: ["string"],
      file: ["integer"],
    },
    "array",
    ["required"],
  ],
  ".": ["required"],
});
type Message = { message: string } | { file: number };
router.use((req, res, next) => {
  if (!isConnected)
    return res.status(400).SendFailed("whatsapp is not connected");
  next();
});
export function hasOwnProperty<K extends PropertyKey, T>(
  obj: unknown,
  key: K
): obj is Record<K, T> {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

router.post("/", async (req, res) => {
  if (!req.headers["content-type"]?.startsWith("multipart/form-data"))
    return res.status(400).SendFailed("invalid Content Type");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const result = registerValidator.passes(req.body["data"]);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const chatId = `${result.data.number}@c.us`;
  for (let i = 0; i < result.data.messages.length; i++) {
    const element = (result.data.messages as Message[])[i];
    if (hasOwnProperty(element, "message")) {
      await whatsappClient.sendMessage(chatId, element.message);
      continue;
    }
    const file = req.files?.[element.file.toString()];
    if (!file)
      return res
        .status(400)
        .SendFailed(`there is no files to be upload on ${i} index`);
    if (file instanceof Array)
      return res
        .status(400)
        .SendFailed(`the ${i} index should contain one file`);
    const data = new MessageMedia(
      file.mimetype,
      file.data.toString("base64"),
      file.name
    );

    await whatsappClient.sendMessage(chatId, data);
  }
  res.status(200).sendSuccess(true);
});
export default router;
