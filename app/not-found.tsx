import LoginPage from "@/clientpage/Login";
import Link from "@/models/linkModel";

export default async function NotFound() {
    const links = await Link.find().catch(() => [])
      .then((links) => links.map((link) => ({
        link: link.link,
      })));

    return <LoginPage links={links}/>;

}