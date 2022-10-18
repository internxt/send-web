import {
  User,
  Lock,
  PaperPlaneTilt,
  FileDotted,
  Envelope,
} from "phosphor-react";
import React from "react";
const text = require("../../assets/lang/en/Send");

const FeatureSection = () => {
  const cards = [
    {
      id: 1,
      icon: User,
      title: text.FeatureSection.card1.title,
      description: text.FeatureSection.card1.description,
    },
    {
      id: 2,
      icon: Lock,
      title: text.FeatureSection.card2.title,
      description: text.FeatureSection.card2.description,
    },
    {
      id: 3,
      icon: PaperPlaneTilt,
      title: text.FeatureSection.card3.title,
      description: text.FeatureSection.card3.description,
    },
    {
      id: 4,
      icon: FileDotted,
      title: text.FeatureSection.card4.title,
      description: text.FeatureSection.card4.description,
    },
    {
      id: 5,
      icon: Envelope,
      title: text.FeatureSection.card5.title,
      description: text.FeatureSection.card5.description,
    },
  ];

  return (
    <div className="relative z-10 flex flex-col items-center justify-center bg-white py-[88px]">
      <div className=" pb-16 text-center">
        <p className="text-4xl font-semibold">{text.FeatureSection.title}</p>
        <p className="w-[778px] pt-4 text-xl font-light text-gray-80">
          {text.FeatureSection.description}
        </p>
      </div>
      <div className="flex flex-col flex-wrap items-center justify-center pt-14 sm:flex-row sm:gap-x-24 xl:gap-x-80">
        {cards.map((card) => (
          <div className="flex flex-col items-center space-y-6" key={card.id}>
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
