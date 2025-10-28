import label from "../../assets/lang/en/send.json";
import RevealX from "../RevealX";

const InfoSection = () => {
  return (
    <div className="z-10 flex flex-col items-center justify-center bg-gray-1 px-10 pt-20">
      <div className="flex w-auto flex-col space-y-6 text-center text-black lg:w-[756px]">
        <p className="text-5xl font-semibold">{label.InfoSection.title}</p>
        <p className=" text-xl">{label.InfoSection.description}</p>
      </div>
      <div className="flex w-screen flex-col items-center space-y-10 px-10 pb-20 pt-16">
        <RevealX
          direction="right"
          className="flex overflow-hidden rounded-2xl bg-gray-100 lg:grid lg:grid-cols-2 lg:grid-rows-1 lg:gap-0"
        >
          <div className="flex h-full flex-col items-center justify-center p-7 text-center lg:items-start lg:pl-20 lg:text-start">
            <h4 className="mb-10 max-w-xs text-4xl font-semibold text-white lg:text-4xl">
              {label.InfoSection.card1.title}
            </h4>
            <div className="mb-4 max-w-[340px] space-y-5 text-xl text-white">
              <p className="font-regular text-lg">
                {label.InfoSection.card1.description.line1}
              </p>
              <p className="font-regular text-lg">
                {label.InfoSection.card1.description.line2}
              </p>
            </div>
            <div className="flex justify-start"></div>
          </div>

          <div className="lg:pl-15 relative mt-16 flex self-stretch  lg:mt-0">
            <div className="hidden lg:flex lg:max-w-[480px]">
              <img src="/bylink.png" alt="Internxt Photos" />
            </div>
          </div>
        </RevealX>

        <RevealX
          direction="left"
          className="flex overflow-hidden rounded-2xl bg-gray-100 lg:grid lg:grid-cols-2 lg:grid-rows-1 lg:gap-0"
        >
          <div className="flex h-full flex-col items-center justify-center p-7 text-center lg:items-start lg:pl-20 lg:text-start">
            <h4 className="mb-10 max-w-xs text-4xl font-semibold text-white lg:text-4xl">
              {label.InfoSection.card2.title}
            </h4>
            <div className="mb-4 max-w-[340px] space-y-5 text-xl text-white">
              <p className="font-regular text-lg">
                {label.InfoSection.card2.description.line1}
              </p>
              <p className="font-regular text-lg">
                {label.InfoSection.card2.description.line2}
              </p>
            </div>
            <div className="flex justify-start"></div>
          </div>

          <div className="lg:pl-15 relative mt-16 flex self-stretch  lg:mt-0">
            <div className="hidden lg:flex lg:max-w-[480px]">
              <img src="/byemail.png" alt="Internxt Photos" />
            </div>
          </div>
        </RevealX>
      </div>
    </div>
  );
};

export default InfoSection;
