import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthTokenError } from "../errors/AuthTokenError";
import { setupApiClient } from "../service/api";
import { api } from "../service/setupApiClient";
import withSSRAuth from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    api.get("/me").catch((err) => console.log(err.message));
  }, []);
  return (
    <div>
      <h1>logou paranems: {user?.email}</h1>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);

  return {
    props: {},
  };
});
