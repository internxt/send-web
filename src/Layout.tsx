import { ReactNode, useEffect, useRef, useState } from "react";

import Card from "./components/Card";
import Navbar from "./components/Navbar/Navbar";
import { ArrowCircleDown, CaretLeft, CaretRight } from "phosphor-react";
import lang from "./assets/lang/en/send.json";
import Drive from "./assets/images/HeroSectionImages/Drive-1.webp";
import Photos from "./assets/images/HeroSectionImages/Photos-2.webp";
import Privacy from "./assets/images/HeroSectionImages/Privacy.svg";
import Blog from "./assets/images/HeroSectionImages/Blog.svg";
import Pricing from "./assets/images/HeroSectionImages/Pricing.svg";
import background from "./assets/images/bg.png";

const urlPrefix = process.env.REACT_APP_BASE_URL || "";

const heroSectionTextPaths = [
  lang.HeroSection.index,
  lang.HeroSection.drive,
  lang.HeroSection.photos,
  lang.HeroSection.privacy,
  lang.HeroSection.blog,
  lang.HeroSection.pricing,
];

const heroSectionImages = [Drive, Photos, Privacy, Blog, Pricing];
const backgroundColor = [
  { backgroundImage: `url(${background})` },
  {
    background: "radial-gradient(50% 50% at 50% 50%, #00A4C8 0%, #161616 100%)",
  },
  {
    background: "radial-gradient(50% 50% at 50% 50%, #31A8FF 0%, #161616 100%)",
  },
  {
    background: "radial-gradient(50% 50% at 50% 50%, #905CFF 0%, #161616 100%)",
  },
  {
    background: "radial-gradient(50% 50% at 50% 50%, #0058DB 0%, #161616 100%)",
  },
  {
    background:
      "radial-gradient(50% 50% at 50% 50%, #0058DB 0%, #161616 100%);",
  },
];

const BgLoop = (text: any) => {
  return (
    <>
      {text.cta ? (
        <div className="flex w-full flex-row justify-end">
          <div className="flex w-full max-w-[316px] flex-col">
            <h1 className="text-6xl font-semibold" style={{ lineHeight: 1 }}>
              {text.title}
            </h1>
            <p className="mt-6 text-xl font-medium">{text.description}</p>
            <div className="mt-5 flex flex-row items-center space-x-1">
              <p className="text-lg font-semibold">{text.cta}</p>
              <CaretRight size={16} className="text-white" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-[605px] flex-col">
          <h1 className="text-6xl font-semibold" style={{ lineHeight: 1 }}>
            {text.title}
          </h1>
          <p className="mt-6 text-xl font-medium">{text.description}</p>
        </div>
      )}
    </>
  );
};

export default function Layout({ children }: { children: ReactNode }) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  let height = useRef(window.innerHeight);
  const [text, setText] = useState<any>(heroSectionTextPaths[0]);
  const [image, setImage] = useState<any>();
  const [background, setBackground] = useState<any>(backgroundColor[0]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex === heroSectionTextPaths.length - 1) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }

      const newText = heroSectionTextPaths[currentIndex];
      const newImage = heroSectionImages[currentIndex - 1];
      const newBg = backgroundColor[currentIndex];

      // Fade out
      ctaRef.current?.classList.remove("opacity-100");
      ctaRef.current?.classList.add("opacity-0");
      backgroundRef.current?.classList.remove("opacity-100");
      backgroundRef.current?.classList.add("opacity-0");

      setTimeout(() => {
        // Update text and image
        if (currentIndex === 0) {
          setText(heroSectionTextPaths[0]);
          setBackground(newBg);
        } else {
          setText(newText);
          setImage(newImage);
          setBackground(newBg);
        }

        // Fade in
        ctaRef.current?.classList.remove("opacity-0");
        ctaRef.current?.classList.add("opacity-100");
        backgroundRef.current?.classList.remove("opacity-0");
        backgroundRef.current?.classList.add("opacity-100");
      }, 1000); // Wait for fade out animation to complete
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
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
    <>
      <Navbar />
      <div
        className="relative flex w-auto flex-col justify-center bg-white lg:min-h-[700px] lg:bg-black"
        style={{ height: height.current }}
      >
        <div
          ref={backgroundRef}
          style={background}
          className="fixed inset-0 block bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        />

        <div className="relative z-20 min-h-0 flex-1 lg:py-0  lg:pt-24">
          <div className="relative mx-auto flex h-full max-w-screen-xl flex-col items-center justify-center">
            <div className="flex h-full w-full flex-row items-center justify-start lg:pb-32">
              <Card className="flex flex-shrink-0 flex-col">{children}</Card>
              <div
                ref={ctaRef}
                className="ml-32 hidden text-white opacity-100 transition-opacity duration-1000 lg:block"
              >
                {BgLoop(text)}
              </div>
            </div>
            <div className="absolute bottom-12 hidden lg:flex">
              <ArrowCircleDown
                size={32}
                className="animate-bounce text-white"
              />
            </div>
          </div>
        </div>
        {text.cta && (
          <div
            ref={ctaRef}
            className={`absolute ${
              image === Pricing && "bottom-0"
            } right-0 hidden w-full max-w-[700px] translate-x-56 opacity-100 transition-opacity duration-1000 xl:flex`}
          >
            <img src={image} alt="bg" />
          </div>
        )}
      </div>
    </>
  );
}
