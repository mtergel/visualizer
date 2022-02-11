import { CgDarkMode } from "@react-icons/all-files/cg/CgDarkMode";
import { HiMenu } from "@react-icons/all-files/hi/HiMenu";
import { HiOutlineTranslate as MainIcon } from "@react-icons/all-files/hi/HiOutlineTranslate";
import clsx from "clsx";
import Dialog, {
  DialogDescription,
  DialogTitle,
} from "components/Dialog/Dialog";
import Drawer from "components/Drawer/Drawer";
import IconButton from "components/IconButton/IconButton";
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupRadio,
} from "components/RadioGroup/RadioGroup";
import useDisclosure from "hooks/useDisclosure";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

const Header: React.FC<{}> = () => {
  const { isOpen, onClose, onOpen, setIsOpen } = useDisclosure();

  return (
    <header className="flex items-center h-16 border-b">
      <div className="w-[72px] flex items-center justify-center flex-shrink-0 h-full text-center lg:w-[60px]">
        <Drawer
          side="left"
          contentClassname="max-w-[320px]"
          open={isOpen}
          onOpenChange={setIsOpen}
          content={
            <div className="h-full">
              <header className="flex items-center h-16 border-b mb-1 pl-6">
                <Link href="/" passHref>
                  <a
                    className="flex flex-row items-center gap-2"
                    onClick={onClose}
                  >
                    <span>
                      <MainIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-300" />
                    </span>
                    <span className="font-logo tracking-tighter font-bold text-2xl dark:text-indigo-300">
                      Visualizer
                    </span>
                  </a>
                </Link>
              </header>
              <nav className="pr-2 pt-2 font-medium text-sm">
                <DrawerLink link="/sorting" name="Sorting" onClick={onClose} />
                <DrawerLink
                  link="/pathfinding"
                  name="Pathfinding"
                  onClick={onClose}
                />
              </nav>
            </div>
          }
        >
          <IconButton
            aria-label="toggle sidemenu"
            icon={<HiMenu />}
            variant="ghost"
            className="md:hidden"
            onClick={onOpen}
          />
        </Drawer>
      </div>
      <h1>
        <Link href="/" passHref>
          <a className="flex flex-row items-center gap-2">
            <span>
              <MainIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-300" />
            </span>
            <span className="font-logo tracking-tighter font-bold text-2xl dark:text-indigo-300">
              Visualizer
            </span>
          </a>
        </Link>
      </h1>
      <nav className="h-full relative flex justify-end flex-1 text-right">
        <div className="mr-0 inline-flex items-center justify-center md:mr-[60px]">
          <LinkTab
            link="/sorting"
            name="Sorting"
            className="hidden md:inline-flex"
          />
          <LinkTab
            link="/pathfinding"
            name="Pathfinding"
            className="hidden md:inline-flex"
          />

          <div className="flex items-center justify-center mx-[14px]">
            <Dialog
              contentClassname="flex flex-col"
              content={<ApperanceTheme />}
            >
              <IconButton
                aria-label="Change appearance"
                icon={<CgDarkMode />}
                variant="ghost"
              />
            </Dialog>
          </div>
        </div>
      </nav>
    </header>
  );
};

interface DrawerLink {
  name: string;
  link: string;
  onClick: () => void;
  className?: string;
}
const DrawerLink: React.FC<DrawerLink> = ({
  name,
  link,
  onClick,
  className,
}) => {
  const router = useRouter();
  return (
    <Link href={link}>
      <a
        className={clsx(
          "drawer-link",
          router.pathname === link && "drawer-link-active",
          className
        )}
        onClick={onClick}
      >
        <div className="drawer-link-inner">{name}</div>
      </a>
    </Link>
  );
};

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

const ApperanceTheme: React.FC<{}> = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="h-full flex flex-col">
      <div className="pt-5 px-6 pb-4 flex-grow">
        <DialogTitle className="dialog-title">Appearance</DialogTitle>
        <DialogDescription className="dialog-description">
          You can change the appearance of the website here.
        </DialogDescription>
        <RadioGroup
          aria-label="Change appearance"
          value={theme}
          onValueChange={setTheme}
          className="mt-4 flex flex-col gap-2"
        >
          <div className="flex items-center">
            <RadioGroupRadio value="light" id="light">
              <RadioGroupIndicator />
            </RadioGroupRadio>
            <label htmlFor="light" className="pl-3 text-sm">
              Light Theme
            </label>
          </div>
          <div className="flex items-center">
            <RadioGroupRadio value="dark" id="dark">
              <RadioGroupIndicator />
            </RadioGroupRadio>
            <label htmlFor="dark" className="pl-3 text-sm">
              Dark Theme
            </label>
          </div>
          <div className="flex items-center">
            <RadioGroupRadio value="system" id="system">
              <RadioGroupIndicator />
            </RadioGroupRadio>
            <label htmlFor="system" className="pl-3 text-sm">
              Default to device theme
            </label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
export default Layout;
