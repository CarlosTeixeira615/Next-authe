import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";
import { api } from "../service/setupApiClient";
interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  email: string;
  permissions: string[];
  roles: string[];
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, "token_next_auth");
  destroyCookie(undefined, "refreshToken_next_auth");
  authChannel.postMessage("signOut");
  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const [isAuthenticated] = useState(!!user);
  useEffect(() => {
    authChannel = new BroadcastChannel("auth");
    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut();
          authChannel.close();
          break;
        case "sigIn":
          window.location.replace("http://localhost:3000/dashboard");
          break;
        default:
          break;
      }
    };
  }, []);
  useEffect(() => {
    const { token_next_auth } = parseCookies();
    if (token_next_auth) {
      api
        .get("/me")
        .then((response) => {
          const { permissions, roles, email } = response.data;

          setUser({
            email,
            permissions,
            roles,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      console.log(email, password);
      const response = await api.post("sessions", {
        email,
        password,
      });
      const { permissions, roles, token, refreshToken } = response.data;
      console.log(refreshToken);
      setCookie(undefined, "token_next_auth", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: "/",
      });
      console.log(refreshToken);
      setCookie(undefined, "refreshToken_next_auth", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: "/",
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      setUser({
        email,
        permissions,
        roles,
      });
      Router.push("/dashboard");
      // authChannel.postMessage("sigIn");
    } catch (err) {
      console.log(err.message);
    }
  }
  return (
    <AuthContext.Provider
      value={{ signIn, signOut, isAuthenticated, user: user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
