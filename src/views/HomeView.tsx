import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import FileArea from "../components/FileArea";
import Switch from "../components/Switch";
import logo from "../logo.svg";

export default function HomeView() {
  const options = ["Send link", "Send email"] as const;
  const [switchValue, setSwitchValue] = useState<typeof options[number]>(
    options[0]
  );

  return (
    <div className="flex h-screen flex-col bg-black">
      <header className="flex h-20 items-center px-6">
        <img className="h-3" src={logo} alt="Internxt's logo" />
      </header>
      <div className="flex-1">
        <Card className="ml-20 mt-10 flex flex-col">
          <div className="min-h-0 flex-1">
            <FileArea />
          </div>
          <div className=" border-t border-gray-5 py-4 px-5">
            <Switch
              options={options}
              onClick={setSwitchValue}
              value={switchValue}
            />
            <Button className="mt-4">Get a link</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
