import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';

import Card from './components/Card';
import Navbar from './components/Navbar/Navbar';
import { ArrowCircleDown, CaretRight } from 'phosphor-react';
import lang from './assets/lang/en/send.json';
import Privacy from './assets/images/HeroSectionImages/Privacy.webp';
import Blog from './assets/images/HeroSectionImages/Blog.webp';
import Pricing from './assets/images/HeroSectionImages/Pricing.webp';
import PrivacyLaptop from './assets/images/HeroSectionImages/Privacy.svg';
import BlogLaptop from './assets/images/HeroSectionImages/Blog.svg';
import PricingLaptop from './assets/images/HeroSectionImages/Pricing.svg';

interface Item {
  text: {
    title: string;
    description: string;
    cta?: string;
    ctaLink?: string;
  };
  image?: string;
  background:
    | {
        backgroundImage: string;
        background?: undefined;
      }
    | {
        background: string;
        backgroundImage?: undefined;
      };
}

const heroSectionTextPaths = [
  lang.HeroSection.index,
  lang.HeroSection.drive,
  lang.HeroSection.privacy,
  lang.HeroSection.blog,
  lang.HeroSection.pricing,
];

const heroSectionImages = [`${window.origin}/Drive-1.webp`, Privacy, Blog, Pricing];
const heroSectionImagesForLaptop = [`${window.origin}/Drive-1.webp`, PrivacyLaptop, BlogLaptop, PricingLaptop];
const backgroundColor = [
  { backgroundImage: `url(${window.origin}/bg.png)` },
  {
    background: 'radial-gradient(50% 50% at 50% 50%, #00A4C8 0%, #161616 100%)',
  },
  {
    background: 'radial-gradient(50% 50% at 50% 50%, #905CFF 0%, #161616 100%)',
  },
  {
    background: 'radial-gradient(50% 50% at 50% 50%, #0058DB 0%, #161616 100%)',
  },
  {
    background: 'radial-gradient(50% 50% at 50% 50%, #0058DB 0%, #161616 100%)',
  },
];

const BgLoop = (text: Item['text'], ctaRef: RefObject<HTMLDivElement | null>) => {
  return (
    <div ref={ctaRef} className="flex select-none opacity-100 transition-opacity duration-1000">
      <div className="flex w-full flex-row justify-end">
        <div className={`flex w-full ${text.cta ? 'max-w-[316px]' : 'max-w-[605px]'} flex-col 3xl:max-w-4xl`}>
          <h1 className="text-6xl font-semibold 3xl:text-7xl" style={{ lineHeight: 1 }}>
            {text.title}
          </h1>
          <p className="mt-6 text-xl font-medium 3xl:text-2xl">{text.description}</p>
          {text.cta ? (
            <div
              onClick={() => {
                window.open(text.ctaLink, '_blank');
              }}
              className="mt-5 flex cursor-pointer flex-row items-center space-x-1 hover:underline"
            >
              <p className="text-lg font-semibold 3xl:text-2xl">{text.cta}</p>
              <CaretRight size={16} className="text-white" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default function Layout({
  children,
  hasContentBelow = true,
}: {
  children: ReactNode;
  hasContentBelow?: boolean;
}) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState<string[]>([]);
  const height = useRef(window.innerHeight);
  const [item, setItem] = useState<Item>({
    text: heroSectionTextPaths[0],
    image: '',
    background: backgroundColor[0],
  });

  useEffect(() => {
    //Preload images before rendering the component to avoid flickering (heroSectionImages)
    if (window.innerWidth >= 2300) {
      heroSectionImages.forEach((image) => {
        const img = new Image();
        img.src = image;

        setImagesLoaded((prev) => [...prev, img.src]);
      }, []);
    } else {
      heroSectionImagesForLaptop.forEach((image) => {
        const img = new Image();
        img.src = image;

        setImagesLoaded((prev) => [...prev, img.src]);
      }, []);
    }

    const background = new Image();
    background.src = `${window.origin}/bg.png`;
    background.addEventListener('load', () => {
      backgroundRef.current?.classList.remove('opacity-0');
      backgroundRef.current?.classList.add('opacity-100');
    });
  }, []);

  ctaRef.current?.classList.add('opacity-100');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex === heroSectionTextPaths.length - 1) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }

      const newText = heroSectionTextPaths[currentIndex];
      const newImage = imagesLoaded[currentIndex - 1];
      const newBg = backgroundColor[currentIndex];

      // Fade out
      ctaRef.current?.classList.remove('opacity-100');
      ctaRef.current?.classList.add('opacity-0');
      backgroundRef.current?.classList.remove('opacity-100');
      backgroundRef.current?.classList.add('opacity-0');
      imageRef.current?.classList.remove('opacity-100');
      imageRef.current?.classList.add('opacity-0');

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
        ctaRef.current?.classList.remove('opacity-0');
        ctaRef.current?.classList.add('opacity-100');
        backgroundRef.current?.classList.remove('opacity-0');
        backgroundRef.current?.classList.add('opacity-100');
        imageRef.current?.classList.remove('opacity-0');
        imageRef.current?.classList.add('opacity-100');
      }, 1000); // Wait for fade out animation to complete
    }, 7000); // 10 seconds

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      height.current = window.innerHeight;
    });

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="relative flex w-auto flex-col justify-center overflow-hidden bg-white lg:min-h-[700px] lg:bg-black"
        style={{ height: height.current }}
      >
        <div
          ref={backgroundRef}
          style={item.background}
          className="absolute inset-0 block bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-500"
        />
        <div className="relative min-h-0 flex-1 lg:py-0  lg:pt-24">
          <div
            className="relative flex h-full max-w-screen-xl flex-col items-center justify-center md:px-10
            xl:mx-auto xl:px-0 3xl:max-w-full"
          >
            <div className="relative h-full w-full items-center justify-start space-x-20 lg:pb-32 3xl:translate-x-50">
              <div className="relative flex h-full w-full items-center lg:w-max">
                <Card className="relative z-30 flex shrink-0 flex-col pt-12 md:pt-0">{children}</Card>
              </div>
              <div className="hidden text-white  lg:block">{BgLoop(item.text, ctaRef)}</div>
            </div>
            {hasContentBelow && (
              <div className="absolute bottom-12 hidden lg:flex">
                <ArrowCircleDown size={32} className="animate-bounce text-white" />
              </div>
            )}
          </div>
        </div>

        {item.image && (
          <div
            ref={imageRef}
            className={`absolute ${item.image === imagesLoaded[3] && 'bottom-0'} right-0 hidden w-full max-w-[700px]
            translate-x-50 opacity-0 transition-opacity duration-1000 xl:flex 3xl:right-10 3xl:w-full 3xl:max-w-4xl
            3xl:translate-x-0 3xl:items-center 3xl:justify-center`}
          >
            <img src={item.image} alt={item.text.title} draggable={false} loading="lazy" />
          </div>
        )}
      </div>
    </>
  );
}
