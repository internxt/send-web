import { ReactNode, useEffect, useRef } from "react";
import logo from "./logo.svg";
import Card from "./components/Card";

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
    <div className="relative flex h-screen flex-col bg-white lg:bg-black">
      <div
        ref={backgroundRef}
        className="fixed inset-0 hidden opacity-0 transition-opacity duration-500 lg:block"
      />
      <header className="flex h-16 flex-shrink-0 items-center justify-center  px-6 lg:absolute lg:top-0 lg:h-20 lg:justify-start">
        <img
          className="h-3 invert lg:invert-0"
          src={logo}
          alt="Internxt's logo"
        />
      </header>
      <div className="relative min-h-0 flex-1">
        <div className="flex h-full items-center">
          <Card className="flex flex-col lg:ml-20">{children}</Card>
          <div
            ref={ctaRef}
            className="ml-36 hidden text-white opacity-0 transition-opacity duration-500 lg:block "
          >
            <h1 className="text-[56px] font-semibold" style={{ lineHeight: 1 }}>
              Share files fast, encrypted
              <br />
              and in total privacy
            </h1>
            <p className="mt-6 w-156 text-2xl font-normal">
              Internxt Send allows you to share files fast without worrying
              about the security of your documents, images or videos. Select the
              files you want to share and choose between sending them by link or
              by mail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
