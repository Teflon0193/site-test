import { getUser } from "@/lib/auth-server";
import Header from "./header/Header";

export default async function HeaderWrapper({
  transparentHeader = true,
}: {
  transparentHeader?: boolean;
}) {
  const user = await getUser();
  return <Header user={user} transparentHeader={transparentHeader} />;
}
