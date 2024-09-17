import axios from "axios";
const requester = axios.create({
  baseURL: "/",
});
export default requester;
