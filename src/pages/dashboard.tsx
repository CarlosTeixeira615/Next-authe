import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../service/api";

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
