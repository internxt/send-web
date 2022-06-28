import { ReactNode } from "react";
import logo from "./logo.svg";
import Card from "./components/Card";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-white lg:bg-black">
      <header className="flex h-16 flex-shrink-0 items-center justify-center px-6 lg:h-20 lg:justify-start">
        <img
          className="h-3 invert lg:invert-0"
          src={logo}
          alt="Internxt's logo"
        />
      </header>
      <div className="min-h-0 flex-1">
        <Card className="flex flex-col lg:ml-20 lg:mt-10">{children}</Card>
      </div>
    </div>
  );
}
