import { ReactNode, useEffect, useRef } from "react";
import logo from "./logo.svg";
import logo_dark from "./logo_dark.svg";
import Card from "./components/Card";
import { Link } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const background = new Image();
    background.src = "/bg.png";
    background.addEventListener("load", () => {
      if (backgroundRef.current && ctaRef.current) {
        backgroundRef.current.style.backgroundImage = "url(/bg.png)";
        backgroundRef.current.style.opacity = "1";
        ctaRef.current.style.opacity = "1";
      }
    });
  }, []);

  return (
    <div className="relative flex lg:h-screen flex-col bg-white lg:bg-black">
      <div
        ref={backgroundRef}
        className="fixed inset-0 hidden bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-500 lg:block"
      />
      <header className=" z-10 flex h-16 w-screen bg-white lg:bg-transparent flex-shrink-0 items-center justify-center px-20 border-b border-gray-5 lg:border-b-0 fixed lg:top-0 lg:h-20 lg:justify-start">
        <Link to="/">
          <img
            className="flex h-3 lg:hidden"
            src={logo_dark}
            alt="Internxt's logo"
          />
          <img
            className="hidden h-3 lg:flex"
            src={logo}
            alt="Internxt's logo"
          />
        </Link>
      </header>
      <div className="relative min-h-0 flex-1 pt-16 pb-32 lg:py-0">
        <div className="relative flex h-full flex-row items-center lg:py-20">
          <Card className="flex flex-shrink-0 flex-col lg:ml-20">
            {children}
          </Card>
          <div
            ref={ctaRef}
            className="ml-32 hidden text-white opacity-0 transition-opacity duration-500 lg:block"
          >
            <h1 className="text-5xl font-medium" style={{ lineHeight: 1 }}>
              Encrypt and send files
              <br />
              in total privacy
            </h1>
            <p className="mt-6 w-156 text-xl font-normal">
              Internxt Send allows you to share files fast without
              <br />
              worrying about the security of your documents,
              <br />
              images, or videos. Select the files you want to
              <br />
              encrypt and send by link or email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
