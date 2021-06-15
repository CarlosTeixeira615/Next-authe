import { useContext, useEffect } from "react";
import Can from "../components/Can";
import { AuthContext } from "../context/AuthContext";
import { api } from "../service/setupApiClient";
import withSSRAuth from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext);

  useEffect(() => {
    api.get("/me").catch((err) => console.log(err.message));
  }, []);

  return (
    <div>
      <h1>logou paranems: {user?.email}</h1>
      <Can permissions={["metrics.list"]}>
        <h1>metricas</h1>
      </Can>
      <button onClick={signOut}>TEste</button>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
