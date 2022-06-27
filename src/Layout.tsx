import { ReactNode } from "react";
import logo from "./logo.svg";
import Card from "./components/Card";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-black">
      <header className="flex h-20 items-center px-6">
        <img className="h-3" src={logo} alt="Internxt's logo" />
      </header>
      <div className="flex-1">
        <Card className="ml-20 mt-10 flex flex-col">{children}</Card>
      </div>
    </div>
  );
}
