import LoginPage from "@/clientpage/Login";
import { connectDB } from "@/lib/db";
import Link from "@/models/linkModel";

export default async function NotFound() {
  await connectDB();
  const links = await Link.find()
    .catch(() => [])
    .then((links) =>
      links.map((link) => ({
        link: link.link,
      }))
    );
   

  return <LoginPage links={links} />;
}
