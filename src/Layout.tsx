import { ReactNode, useEffect, useRef } from "react";
import logo from "./logo.svg";
import logo_dark from "./logo_dark.svg";
import Card from "./components/Card";
import { Link } from "react-router-dom";

const urlPrefix = process.env.REACT_APP_BASE_URL || "";
export default function Layout({ children }: { children: ReactNode }) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  let height = useRef(window.innerHeight);

  useEffect(() => {
    const background = new Image();
    background.src = `${urlPrefix}/bg.png`;
    background.addEventListener("load", () => {
      if (backgroundRef.current && ctaRef.current) {
        backgroundRef.current.style.backgroundImage = `url(${urlPrefix}/bg.png)`;
        backgroundRef.current.style.opacity = "1";
        ctaRef.current.style.opacity = "1";
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      height.current = window.innerHeight;
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <div
      className="relative flex w-auto flex-col bg-white lg:min-h-[700px] lg:bg-black"
      style={{ height: height.current }}
    >
      <div
        ref={backgroundRef}
        className="fixed inset-0 block bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-500"
      />
      <header className="z-10 flex h-16 w-full flex-shrink-0 items-center justify-center border-b border-gray-5 bg-white px-20 lg:top-0 lg:h-20 lg:justify-start lg:border-b-0 lg:bg-transparent">
        <a href={"https://internxt.com"}>
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
        </a>
      </header>
      <div className="relative min-h-0 flex-1 lg:py-0 lg:pt-16 lg:pb-32">
        <div className="relative flex h-full flex-row items-center">
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
