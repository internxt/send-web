import React from "react";
import textContent from "../../assets/lang/en/send.json";

const CtaSection = () => {
  return (
    <section className="z-10 overflow-hidden bg-gradient-to-l from-primary to-primary-dark">
      <div className="flex flex-col items-center justify-center py-12 pb-12 lg:px-20">
        <div className="flex flex-col text-center text-white">
          <p className="text-3xl font-semibold">
            {textContent.CtaSection.title}
          </p>
          <p className="pt-4 pb-5 text-base font-normal">
            {textContent.CtaSection.description}
          </p>
        </div>
        <div
          onClick={() => {
            window.open("https://internxt.com/pricing", "_blank");
          }}
          className="flex max-w-[260px] cursor-pointer flex-col items-center rounded-lg bg-white text-center hover:bg-blue-10"
        >
          <p className="px-9 py-3 text-lg font-medium text-primary">
            {textContent.CtaSection.cta}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
