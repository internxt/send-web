import label from "../../assets/lang/en/send.json";

const urlPrefix = process.env.REACT_APP_BASE_URL || "";

const InfoSection = () => {
  return (
    <div className="z-10 flex flex-col items-center justify-center px-10 pt-20">
      <div className="flex w-auto flex-col space-y-6 text-center text-white lg:w-[756px]">
        <p className="text-4xl font-semibold">{label.InfoSection.title}</p>
        <p className=" text-xl font-light">{label.InfoSection.description}</p>
      </div>
      <div className="flex w-screen flex-col items-center space-y-10 px-10 py-20 lg:py-40 lg:pt-32">
        <div className="flex w-auto flex-row justify-center rounded-[34px] bg-blue-80 lg:h-[480px] lg:w-[960px]">
          <div className="flex w-full flex-col items-start justify-center space-y-6 p-10 text-white lg:p-20">
            <p className="text-3xl font-semibold">
              {label.InfoSection.card1.title}
            </p>
            <p className="font-regular text-lg">
              {label.InfoSection.card1.description}
            </p>
          </div>
          <div className="flex">
            <img
              src={`${urlPrefix}/bylink.png`}
              alt="laptop"
              className="hidden lg:flex"
            />
          </div>
        </div>
        <div className="flex w-auto flex-row justify-center rounded-[34px] bg-blue-80 lg:h-[480px] lg:w-[960px]">
          <div className="flex w-full flex-col items-start justify-center space-y-6 p-10 text-white lg:p-20">
            <p className="text-3xl font-semibold">
              {label.InfoSection.card2.title}
            </p>
            <p className="font-regular text-lg">
              {label.InfoSection.card2.description}
            </p>
          </div>
          <div className="flex">
            <img
              src={`${urlPrefix}/byemail.png`}
              alt="laptop"
              className="hidden lg:flex"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
