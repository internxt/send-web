import {
  User,
  Lock,
  PaperPlaneTilt,
  FileDotted,
  Envelope,
} from "phosphor-react";
import React from "react";

const FeatureSection = () => {
  const cards = [
    {
      icon: User,
      title: "User-first file sharing",
      description:
        "Internxt Send respects users' right to privacy and doesn't scan, store, or save any information you send through the service.",
    },
    {
      icon: Lock,
      title: "Private, encrypted file transfer",
      description:
        "All files and photos are end-to-end encrypted, meaning all your information is scrambled and fragmented before ever leaving your device.",
    },
    {
      icon: PaperPlaneTilt,
      title: "Send large files in secrecy",
      description:
        "Send and share files no matter the size. Internxt Send has no file size limits and can send large files in no time.",
    },
    {
      icon: FileDotted,
      title: "Private, encrypted file transfer",
      description:
        "All file formats are supported and can easily be encrypted and shared with Internxt Send. PDF, JPEG, DOC, PNG, XLS, and many more.",
    },
    {
      icon: Envelope,
      title: "Private, encrypted file transfer",
      description:
        "Share files and photos via a password-protected link or email to anyone, whether they have an Internxt account or not.",
    },
  ];

  return (
    <div className="relative z-10 flex flex-col items-center justify-center bg-white py-[88px]">
      <div className=" pb-16 text-center">
        <p className="text-4xl font-semibold">
          Secure from the moment you hit send
        </p>
        <p className="w-[778px] pt-4 text-xl font-light text-gray-80">
          Files uploaded and sent through Internxt Send use Internxt's
          disruptive zero-knowledge architecture to maximize the security and
          privacy of files. Maintain rock-solid confidentiality and safely
          transmit sensitive information with Internxt Send.
        </p>
      </div>
      <div className="flex flex-col flex-wrap items-center justify-center pt-14 sm:flex-row sm:gap-x-24 xl:gap-x-48">
        {cards.map((card) => (
          <div className="flex flex-col items-center space-y-6">
            <card.icon size={54} weight="light" color="rgb(0,102,255)" />
            <div className="flex  flex-col items-center gap-x-40 space-y-5 text-center">
              <p className="text-xl font-semibold">{card.title}</p>
              <p className="h-[218px] w-[280px] text-base">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
