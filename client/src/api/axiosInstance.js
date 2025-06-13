import axios from "axios";

const SERVER_URL = import.meta.env.PROD ? "" : "https://polly-server.fly.dev";

export default axios.create({
  baseURL: SERVER_URL,
});
