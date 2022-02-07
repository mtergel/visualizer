import { HiMenu } from "@react-icons/all-files/hi/HiMenu";
import { HiOutlineTranslate as MainIcon } from "@react-icons/all-files/hi/HiOutlineTranslate";
import IconButton from "components/IconButton/IconButton";
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
          Ancestry
        </span>
      </h1>

      <IconButton
        variant="ghost"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="transition-all"
            style={{
              width: "100%",
              height: "100%",
              transform: "translate3d(0px, 0px, 0px)",
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="__lottie_element_86">
                <rect width="24" height="24" x="0" y="0"></rect>
              </clipPath>
            </defs>
            <g clipPath="url(#__lottie_element_86)">
              <g
                transform={
                  isDark ? "matrix(1,0,0,1,12,12)" : "matrix(1.5,0,0,1.5,7,12)"
                }
                opacity="1"
                style={{
                  display: "block",
                }}
              >
                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                  <path
                    fill="currentColor"
                    fillOpacity="1"
                    d={
                      isDark
                        ? " M0,-4 C-2.2100000381469727,-4 -4,-2.2100000381469727 -4,0 C-4,2.2100000381469727 -2.2100000381469727,4 0,4 C2.2100000381469727,4 4,2.2100000381469727 4,0 C4,-2.2100000381469727 2.2100000381469727,-4 0,-4z"
                        : " M0,-4 C-2.2100000381469727,-4 -1.2920000553131104,-2.2100000381469727 -1.2920000553131104,0 C-1.2920000553131104,2.2100000381469727 -2.2100000381469727,4 0,4 C2.2100000381469727,4 4,2.2100000381469727 4,0 C4,-2.2100000381469727 2.2100000381469727,-4 0,-4z"
                    }
                  />
                </g>
              </g>
              <g transform="matrix(1,0,0,1,12,12)" opacity="1">
                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                  <path
                    fill="currentColor"
                    fillOpacity="1"
                    d=" M0,6 C-3.309999942779541,6 -6,3.309999942779541 -6,0 C-6,-3.309999942779541 -3.309999942779541,-6 0,-6 C3.309999942779541,-6 6,-3.309999942779541 6,0 C6,3.309999942779541 3.309999942779541,6 0,6z M8,-3.309999942779541 C8,-3.309999942779541 8,-8 8,-8 C8,-8 3.309999942779541,-8 3.309999942779541,-8 C3.309999942779541,-8 0,-11.3100004196167 0,-11.3100004196167 C0,-11.3100004196167 -3.309999942779541,-8 -3.309999942779541,-8 C-3.309999942779541,-8 -8,-8 -8,-8 C-8,-8 -8,-3.309999942779541 -8,-3.309999942779541 C-8,-3.309999942779541 -11.3100004196167,0 -11.3100004196167,0 C-11.3100004196167,0 -8,3.309999942779541 -8,3.309999942779541 C-8,3.309999942779541 -8,8 -8,8 C-8,8 -3.309999942779541,8 -3.309999942779541,8 C-3.309999942779541,8 0,11.3100004196167 0,11.3100004196167 C0,11.3100004196167 3.309999942779541,8 3.309999942779541,8 C3.309999942779541,8 8,8 8,8 C8,8 8,3.309999942779541 8,3.309999942779541 C8,3.309999942779541 11.3100004196167,0 11.3100004196167,0 C11.3100004196167,0 8,-3.309999942779541 8,-3.309999942779541z"
                  />
                </g>
              </g>
            </g>
          </svg>
        }
      />
    </header>
  );
};
export default Layout;
