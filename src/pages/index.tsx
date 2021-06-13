import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import withSSRGuest from "../utils/withSSRGuest";

export default function Home() {
  const { signIn } = useContext(AuthContext);
  const [login, setLogin] = useState({ email: "", password: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await signIn(login);
  }
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        height: "800%",
        flexDirection: "column",
      }}
    >
      <input
        type="email"
        value={login.email}
        onChange={(e) => setLogin({ ...login, email: e.target.value })}
      />
      <input
        type="password"
        value={login.password}
        onChange={(e) => setLogin({ ...login, password: e.target.value })}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
