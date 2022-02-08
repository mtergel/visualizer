import Link from "next/link";

interface LinkTabProps {
  name: string;
  link: string;
}
const LinkTab: React.FC<LinkTabProps> = ({ name, link }) => {
  return (
    <Link href={link}>
      <a className="link-tab">{name}</a>
    </Link>
  );
};

export default LinkTab;
