import React from "react";

const InfoSection = () => {
  return (
    <div className="z-10 flex flex-col items-center justify-center py-10">
      <div className="flex h-36 w-[756px] flex-col space-y-6 text-center text-white">
        <p className="text-4xl font-semibold">How to use Internxt Send</p>
        <p className=" text-xl font-light">
          Simply drag and drop the files you want to share or send into the
          browser, or select the + icon and manually select the files or photos
          you wish to send. From there, you will have to choose from two options
          to complete your encrypted file transfer:
        </p>
      </div>
      <div className="pt-32">
        <div className="h-[480px] w-[960px] rounded-[34px] bg-blue-80"></div>
      </div>
    </div>
  );
};

export default InfoSection;
