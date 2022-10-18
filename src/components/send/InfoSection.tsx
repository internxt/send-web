import React from "react";

import label from "../../assets/lang/en/send.json";

const InfoSection = () => {
  return (
    <div className="z-10 flex flex-col items-center justify-center py-20">
      <div className="flex h-36 w-[756px] flex-col space-y-6 text-center text-white">
        <p className="text-4xl font-semibold">{label.InfoSection.title}</p>
        <p className=" text-xl font-light">{label.InfoSection.description}</p>
      </div>
      <div className="flex flex-col space-y-10 pt-32">
        <div className="flex h-[480px] w-[960px] rounded-[34px] bg-blue-80">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col items-start justify-center space-y-6 p-20 text-white">
              <p className="text-3xl font-semibold">
                {label.InfoSection.card1.title}
              </p>
              <p className="font-regular text-lg">
                {label.InfoSection.card1.description}
              </p>
            </div>
            <img src="/bylink.png" alt="laptop" />
          </div>
        </div>
        <div className="flex h-[480px] w-[960px] rounded-[34px] bg-blue-80">
          <div className="items-between flex flex-row justify-between">
            <div className="flex flex-col items-start justify-center space-y-6 p-20 text-white">
              <p className="text-3xl font-semibold">
                {label.InfoSection.card2.title}
              </p>
              <p className="font-regular text-lg">
                {label.InfoSection.card2.description}
              </p>
            </div>
            <img src="/byemail.png" alt="laptop" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
