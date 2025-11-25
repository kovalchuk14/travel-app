import axios from "axios";
export const localAPI = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api`,
  withCredentials: true,
});
