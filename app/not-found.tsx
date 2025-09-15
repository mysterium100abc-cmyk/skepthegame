import LoginPage from "@/clientpage/Login";
import { connectDB } from "@/lib/db";
import Link from "@/models/linkModel";

export default async function NotFound() {
  await connectDB();
  const links = await Link.find()
    .then((links) => links.map((link) => ({ link: link.link })))
    .catch(() => []);
   

  return <LoginPage links={links} />;
}
