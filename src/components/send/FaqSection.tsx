import React from 'react';
import FaqAccordion from '../FaqAccordion';

import label from '../../assets/lang/en/send.json';

const FaqSection = () => {
  return (
    <section className="z-10 overflow-hidden bg-white">
      <div className="flex flex-col items-center justify-center space-y-10 px-10 py-20">
        <p className="text-center text-4xl font-semibold">{label.FaqSection.title}</p>
        <div className="flex w-full max-w-[850px] flex-col space-y-2">
          {label.FaqSection.faq.map((item) => (
            <div className="rounded-lg border border-gray-20 px-5" key={item.question}>
              <FaqAccordion key={item.question} question={item.question} answer={item.answer} isQuestionBigger />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
