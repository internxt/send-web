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
    <div className="reltive flex flex-col bg-white lg:h-screen lg:bg-black">
      <div
        ref={backgroundRef}
        className="fixed inset-0 hidden bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-500 lg:block"
      />
      <header className="z-10 flex h-16 w-screen flex-shrink-0 items-center justify-center border-b border-gray-5 bg-white px-20 lg:top-0 lg:h-20 lg:justify-start lg:border-b-0 lg:bg-transparent">
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
      <div className="relative min-h-0 flex-1 p-20 lg:py-0">
        <div className="relative flex h-full flex-row items-center pb-20">
          <Card className="flex flex-shrink-0 flex-col">{children}</Card>
          <div
            ref={ctaRef}
            className="ml-44 hidden text-white opacity-0 transition-opacity duration-500 lg:block"
          >
            <h1 className="text-5xl font-medium" style={{ lineHeight: 1 }}>
              Encrypt and send files
              <br />
              in total privacy
            </h1>
            <p className="mt-6 w-156 text-lg font-normal">
              Internxt Send allows you to share files fast without worrying
              <br />
              about the security of your documents, images, or videos.
              <br />
              Select the files you want to encrypt and send by link or email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
