import { HiOutlineTranslate as MainIcon } from "@react-icons/all-files/hi/HiOutlineTranslate";
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
  return (
    <header className="flex items-center h-16 border-b">
      <div className="w-[72px] flex-shrink-0 h-full text-center lg:w-[60px]"></div>
      <h1 className="flex flex-row items-center gap-2">
        <span>
          <MainIcon className="h-6 w-6 text-indigo-300" />
        </span>
        <span className="font-logo tracking-tighter font-bold text-2xl text-indigo-300">
          Ancestry
        </span>
      </h1>
    </header>
  );
};

export default Layout;
