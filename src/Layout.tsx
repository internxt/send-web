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
      <header className="flex h-16 flex-shrink-0 items-center justify-center px-6 lg:h-20 lg:justify-start">
        <img
          className="h-3 invert lg:invert-0"
          src={logo}
          alt="Internxt's logo"
        />
      </header>
      <div className="relative min-h-0 flex-1">
        <div className="flex h-full">
          <Card className="flex flex-col lg:ml-20 lg:mt-10">{children}</Card>
          <div
            ref={ctaRef}
            className="ml-36 hidden text-white opacity-0 transition-opacity duration-500 lg:block "
          >
            <h1
              className="mt-40 text-[56px] font-semibold"
              style={{ lineHeight: 1 }}
            >
              Privacy matters,
              <br /> use Internxt
            </h1>
            <p className="mt-6 w-120 text-2xl font-normal">
              Store all your files securely in total privacy with Internxt
              Drive. Sign up now and get 10GB for free, no fine print, just
              privacy.
            </p>
            <a
              className="mt-6 flex h-11 w-max items-center rounded-[100px] border border-white px-7 text-lg font-medium"
              href="https://drive.internxt.com/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get started now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
