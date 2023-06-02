import { ReactNode, useEffect, useRef } from "react";
import logo from "./logo.svg";

import Card from "./components/Card";
import Navbar from "./components/Navbar/Navbar";
import { ArrowCircleDown, ArrowDown } from "phosphor-react";

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

      <Navbar />

      <div className="relative min-h-0 flex-1 lg:py-0  lg:pt-24">
        <div className="relative mx-auto flex h-full max-w-screen-xl flex-col items-center justify-center">
          <div className="flex h-full w-full flex-row items-center justify-start lg:pb-32">
            <Card className="flex flex-shrink-0 flex-col">{children}</Card>

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
          <div className="absolute bottom-12 hidden lg:flex">
            <ArrowCircleDown size={32} className="animate-bounce text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
