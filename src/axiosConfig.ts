import axios from "axios";

const https = await import("https");

const instance = axios.create({
  baseURL: "/api",
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

export default instance;
