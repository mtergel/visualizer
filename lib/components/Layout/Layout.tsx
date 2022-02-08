import { CgDarkMode } from "@react-icons/all-files/cg/CgDarkMode";
import { HiMenu } from "@react-icons/all-files/hi/HiMenu";
import { HiOutlineTranslate as MainIcon } from "@react-icons/all-files/hi/HiOutlineTranslate";
import Dialog, {
  DialogDescription,
  DialogTitle,
} from "components/Dialog/Dialog";
import IconButton from "components/IconButton/IconButton";
import LinkTab from "components/LinkTab/LinkTab";
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupRadio,
} from "components/RadioGroup/RadioGroup";
import { useTheme } from "next-themes";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

const Header: React.FC<{}> = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="flex items-center h-16 border-b">
      <div className="w-[72px] flex items-center justify-center flex-shrink-0 h-full text-center lg:w-[60px]">
        <IconButton
          aria-label="toggle sidemenu"
          icon={<HiMenu />}
          variant="ghost"
        />
      </div>
      <h1 className="flex flex-row items-center gap-2">
        <span>
          <MainIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-300" />
        </span>
        <span className="font-logo tracking-tighter font-bold text-2xl dark:text-indigo-300">
          Visualizer
        </span>
      </h1>
      <nav className="h-full relative flex justify-end flex-1 text-right">
        <div className="mr-[60px] inline-flex items-center justify-center">
          <LinkTab link="/sorting" name="Sort" />
          <div className="flex items-center justify-center">
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
