import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";

interface LinkTabProps {
  name: string;
  link: string;
  className?: string;
}
const LinkTab: React.FC<LinkTabProps> = ({ name, link, className }) => {
  const router = useRouter();

  return (
    <Link href={link}>
      <a
        className={clsx(
          "link-tab",
          router.pathname === link && "link-tab-active",
          className
        )}
      >
        {name}
      </a>
    </Link>
  );
};

export default LinkTab;
