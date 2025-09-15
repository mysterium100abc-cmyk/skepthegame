import LoginPage from "@/clientpage/Login";
import axios from "axios";

export default async function NotFound() {
  const links = await axios
    .get("/api/admin/links")
    .then((res) => res.data.data);
  const formattedLinks = links.map((link: { link: string }) => link.link);

  return <LoginPage links={formattedLinks} />;
}
