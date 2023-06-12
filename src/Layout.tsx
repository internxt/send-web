import { ReactNode, RefObject, useEffect, useRef, useState } from "react";

import Card from "./components/Card";
import Navbar from "./components/Navbar/Navbar";
import { ArrowCircleDown, CaretRight } from "phosphor-react";
import lang from "./assets/lang/en/send.json";
import Privacy from "./assets/images/HeroSectionImages/Privacy.svg";
import Blog from "./assets/images/HeroSectionImages/Blog.svg";
import Pricing from "./assets/images/HeroSectionImages/Pricing.svg";

const heroSectionTextPaths = [
  lang.HeroSection.index,
  lang.HeroSection.drive,
  lang.HeroSection.photos,
  lang.HeroSection.privacy,
  lang.HeroSection.blog,
  lang.HeroSection.pricing,
];

const heroSectionImages = [
  `${window.origin}/Drive-1.webp`,
  `${window.origin}/Photos-2.webp`,
  Privacy,
  Blog,
  Pricing,
];
const backgroundColor = [
  { backgroundImage: `url(${window.origin}/bg.png)` },
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
    background: "radial-gradient(50% 50% at 50% 50%, #0058DB 0%, #161616 100%)",
  },
];

const BgLoop = (text: any, ctaRef: RefObject<HTMLDivElement>) => {
  return (
    <div
      ref={ctaRef}
      className="flex opacity-100 transition-opacity duration-1000"
    >
      {text.cta ? (
        <div className="flex w-full flex-row justify-end">
          <div className="flex w-full max-w-[316px] flex-col">
            <h1 className="text-6xl font-semibold" style={{ lineHeight: 1 }}>
              {text.title}
            </h1>
            <p className="mt-6 text-xl font-medium">{text.description}</p>
            <div
              onClick={() => {
                window.open(text.ctaLink, "_blank");
              }}
              className="mt-5 flex cursor-pointer flex-row items-center space-x-1 hover:underline"
            >
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
    </div>
  );
};

export default function Layout({ children }: { children: ReactNode }) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  let height = useRef(window.innerHeight);
  const [item, setItem] = useState<Record<string, any>>({
    text: heroSectionTextPaths[0],
    image: "",
    background: backgroundColor[0],
  });

  useEffect(() => {
    //Preload images before rendering the component to avoid flickering (heroSectionImages)
    heroSectionImages.forEach((image) => {
      const img = new Image();
      img.src = image;
    }, []);

    const background = new Image();
    background.src = `${window.origin}/bg.png`;
    background.addEventListener("load", () => {
      backgroundRef.current?.classList.remove("opacity-0");
      backgroundRef.current?.classList.add("opacity-100");
    });
  }, []);

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
      imageRef.current?.classList.remove("opacity-100");
      imageRef.current?.classList.add("opacity-0");

      // Update text and image
      setTimeout(() => {
        if (currentIndex === 0) {
          setItem({
            text: newText,
            background: newBg,
          });
        } else {
          setItem({
            text: newText,
            image: newImage,
            background: newBg,
          });
        }
      }, 800);

      setTimeout(() => {
        // Fade in
        ctaRef.current?.classList.remove("opacity-0");
        ctaRef.current?.classList.add("opacity-100");
        backgroundRef.current?.classList.remove("opacity-0");
        backgroundRef.current?.classList.add("opacity-100");
        imageRef.current?.classList.remove("opacity-0");
        imageRef.current?.classList.add("opacity-100");
      }, 1000); // Wait for fade out animation to complete
    }, 7000); // 10 seconds

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
          style={item.background}
          className="absolute inset-0 block bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-500"
        />
        <div className="relative z-20 min-h-0 flex-1 lg:py-0  lg:pt-24">
          <div className="relative flex h-full max-w-screen-xl flex-col items-center justify-center md:px-10 xl:mx-auto xl:px-0">
            <div className="flex h-full w-full flex-row items-center justify-start space-x-20 lg:pb-32">
              <Card className="flex flex-shrink-0 flex-col">{children}</Card>
              <div className="hidden text-white  lg:block">
                {BgLoop(item.text, ctaRef)}
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
        {item.image && (
          <div
            ref={imageRef}
            className={`absolute ${
              item.image === Pricing && "bottom-0"
            } right-0 z-30 hidden w-full max-w-[700px] translate-x-50 opacity-0 transition-opacity duration-1000 xl:flex`}
          >
            <img
              src={item.image}
              alt={item.text.title}
              draggable={false}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </>
  );
}
