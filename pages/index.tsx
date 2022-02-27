import { VscGithubAlt } from "@react-icons/all-files/vsc/VscGithubAlt";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex-grow">
      <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-[56px]">
        <header className="w-full px-4 pt-8 md:w-[720px] md:mx-auto md:pt-20">
          <h1 className="mb-6 text-4xl font-semibold tracking-tighter">
            Visualizer
          </h1>
          <p className="text-lg mb-5">
            Welcome to Visualizer! I built this web application because I was
            learning about algorithms, and I wanted to visualize them in action.
            Currently, there are sorting and pathfinding algorithms. I hope you
            enjoy playing around with this visualization tool just as much as I
            enjoyed building it.
          </p>
          <p className="text-lg text-indigo-500 dark:text-indigo-300 font-semibold mb-10">
            The sorting visualizer might cause seizure viewer discretion is
            advised.
          </p>
          <a
            href="https://github.com/mtergel/visualizer"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 text-center text-skin-muted hover:text-skin-base"
          >
            <span>Made by Tergel</span>
            <VscGithubAlt />
          </a>
        </header>
      </div>
    </div>
  );
};

export default Home;
