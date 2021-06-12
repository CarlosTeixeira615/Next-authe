import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../context/AuthContext";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["token_next_auth"]}`,
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === "token.expired") {
        //refrash token
        cookies = parseCookies();
        const { refreshToken_next_auth } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;
          api
            .post("/refresh", {
              refreshToken: refreshToken_next_auth,
            })
            .then((response) => {
              const tokens = response?.data;
              api.defaults.headers["Authorization"] = `Bearer ${tokens.token}`;

              setCookie(undefined, "token_next_auth", tokens.token, {
                maxAge: 60 * 60 * 24 * 30, // 30 dias
                path: "/",
              });

              setCookie(
                undefined,
                "refreshToken_next_auth",
                tokens.refreshToken_next_auth,
                {
                  maxAge: 60 * 60 * 24 * 30, // 30 dias
                  path: "/",
                }
              );
              failedRequestsQueue.forEach((request) =>
                request.onSuccess(tokens.token)
              );
              failedRequestsQueue = [];
            })
            .catch((err) => {
              failedRequestsQueue.forEach((request) => request.onSuccess(err));
              failedRequestsQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      } else {
        // deslogar da aplicacao
        signOut();
      }
    }
    return Promise.reject(error);
  }
);
