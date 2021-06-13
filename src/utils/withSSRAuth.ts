import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";

export default function withSSRAuth<P>(
  fn: GetServerSideProps<P>
): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    if (!cookies["token_next_auth"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
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
