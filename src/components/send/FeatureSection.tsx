import {
  User,
  Lock,
  PaperPlaneTilt,
  FileDotted,
  Envelope,
} from "phosphor-react";
import React from "react";
import label from "../../assets/lang/en/send.json";

const FeatureSection = () => {
  const cards = [
    {
      id: 1,
      icon: User,
      title: label.FeatureSection.card1.title,
      description: label.FeatureSection.card1.description,
    },
    {
      id: 2,
      icon: Lock,
      title: label.FeatureSection.card2.title,
      description: label.FeatureSection.card2.description,
    },
    {
      id: 3,
      icon: PaperPlaneTilt,
      title: label.FeatureSection.card3.title,
      description: label.FeatureSection.card3.description,
    },
    {
      id: 4,
      icon: FileDotted,
      title: label.FeatureSection.card4.title,
      description: label.FeatureSection.card4.description,
    },
    {
      id: 5,
      icon: Envelope,
      title: label.FeatureSection.card5.title,
      description: label.FeatureSection.card5.description,
    },
  ];

  return (
    <div className="relative z-10 flex w-screen flex-col items-center justify-center bg-white px-5 pt-32 pb-[88px] lg:px-0">
      <div className="pb-16 text-center">
        <p className="text-4xl font-semibold">{label.FeatureSection.title}</p>
        <p className="pt-4 text-xl font-light text-gray-80 lg:w-[778px]">
          {label.FeatureSection.description}
        </p>
      </div>
      <div className="flex max-w-screen-xl flex-col flex-wrap items-center justify-center pt-14 sm:flex-row sm:gap-x-32">
        {cards.map((card) => (
          <div
            className="lg: flex flex-col items-center space-y-6"
            key={card.id}
          >
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
