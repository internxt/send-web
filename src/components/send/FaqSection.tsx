import React from "react";
import FaqAccordion from "../FaqAccordion";

const text = require("../../assets/lang/en/send");

const FaqSection = () => {
  return (
    <div className="z-10 flex flex-col items-center bg-gray-1 py-20 lg:px-44">
      <div className="center flex flex-col items-center text-center">
        <p className="text-4xl font-semibold">{text.FaqSection.title}</p>
      </div>
      <div className="flex w-full max-w-screen-sm flex-col pt-10">
        {text.FaqSection.faq.map((item: any) => (
          <div className="border border-gray-20 px-5" key={item.title}>
            <FaqAccordion
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
