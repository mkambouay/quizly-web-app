import { getAuthSession } from "@/lib/nextauth";
import React from "react";

type Props = {};

export const NavBar = async (props: Props) => {
  const session = await getAuthSession();
  if (session?.user) {
    return <pre>{JSON.stringify(session.user, null, 2)}</pre>;
  } else {
    return <div>Not signed in</div>;
  }
};
