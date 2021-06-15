import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";
import decode from "jwt-decode";
import { ValidateUserPermissions } from "./ValidateUserPermissions";

interface WithSSRAuthOptions {
  permissions?: string[];
  roles?: string[];
}

export default function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthOptions
): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies["token_next_auth"];
    if (!token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (options) {
      const user = decode<{ permissions: string[]; roles: string[] }>(token);

      const { permissions, roles } = options;

      const userHasValidPermissions = ValidateUserPermissions({
        user,
        permissions,
        roles,
      });

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: "/dashboard",
            permanent: false,
          },
        };
      }
    }

    try {
      return await fn(ctx);
    } catch (err) {
      console.log(err);
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, "token_next_auth");
        destroyCookie(ctx, "refreshToken_next_auth");
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }

    return await fn(ctx);
  };
}
