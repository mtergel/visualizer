import Button from "components/Button/Button";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="py-2">
      <h1 className="text-skin-base text-lg">Noto Sans Japanese</h1>
      <h2 className="text-sm text-skin-muted">Google</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button>Save</Button>
          <Button color="primary">Save</Button>
          <Button color="danger">Save</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Save</Button>
          <Button variant="outline" color="primary">
            Save
          </Button>
          <Button variant="outline" color="danger">
            Save
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost">Save</Button>
          <Button variant="ghost" color="primary">
            Save
          </Button>
          <Button variant="ghost" color="danger">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
