import { setupApiClient } from "../service/api";
import withSSRAuth from "../utils/withSSRAuth";
export default function Metric() {
  return (
    <div>
      <h1>metrics</h1>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupApiClient(ctx);
    const response = await apiClient.get("/me");
    console.log(response.data);
    return {
      props: {},
    };
  },
  {
    permissions: ["metrics.list"],
    roles: ["administrator"],
  }
);
