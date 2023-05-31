import {
  User,
  PaperPlaneTilt,
  FileDotted,
  Eye,
  EyeSlash,
  EnvelopeSimple,
} from "phosphor-react";
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
      icon: EyeSlash,
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
      icon: EnvelopeSimple,
      title: label.FeatureSection.card5.title,
      description: label.FeatureSection.card5.description,
    },
    {
      id: 6,
      icon: Eye,
      title: label.FeatureSection.card6.title,
      description: label.FeatureSection.card6.description,
    },
  ];

  return (
    <div className="relative z-10 flex w-screen flex-col items-center justify-center bg-white px-5 pb-[88px] pt-32 lg:px-0">
      <div className="flex flex-col items-center justify-center space-y-6 pb-16 text-center">
        <p className="w-full max-w-[550px] justify-center text-5xl font-semibold">
          {label.FeatureSection.title}
        </p>
        <p className="pt-4 text-xl font-light text-gray-80 lg:max-w-[850px]">
          {label.FeatureSection.description}
        </p>
      </div>
      <div className="grid grid-cols-1 flex-row flex-wrap justify-center gap-8 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            className={`flex flex-col items-start justify-start space-y-6 rounded-2xl bg-gray-1 p-8 sm:p-10 md:max-w-[488px]`}
            key={card.id}
          >
            <card.icon size={54} weight="light" color="rgb(0,102,255)" />
            <div className="flex  w-full max-w-[408px] flex-col items-center gap-x-40 space-y-5 text-left lg:items-start">
              <p className="text-2xl font-medium">{card.title}</p>
              <p className="text-lg">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
