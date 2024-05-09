/* eslint-disable max-len */
import { Transition, Disclosure } from "@headlessui/react";
import { CaretDown } from "phosphor-react";
import moment from "moment";

import textContent from "../../assets/lang/en/footer.json";
import Facebook from "../../assets/social/cool-gray-60/facebook.svg";
import Instagram from "../../assets/social/cool-gray-60/instagram.svg";
import LinkedIn from "../../assets/social/cool-gray-60/linkedin.svg";
import Twitter from "../../assets/social/cool-gray-60/twitter.svg";
import YouTube from "../../assets/social/cool-gray-60/youtube.svg";
import Internxt from "../../assets/Internxt.svg";
import iosStore from "../../assets/images/footer/app-store.svg";
import androidStore from "../../assets/images/footer/store-for-android.svg";
import urls from "../../lib/urls";

const iosURL = "https://apps.apple.com/es/app/internxt-drive/id1465869889";
const androidURL =
  "https://play.google.com/store/apps/details?id=com.internxt.cloud";

export default function Footer({
  hideNewsletter,
  darkMode,
}: Readonly<{
  hideNewsletter?: boolean;
  darkMode?: boolean;
}>) {
  const lang = "en";
  const year = moment().format("YYYY");

  return (
    <section
      id="footer"
      className={`z-50 flex w-full flex-col bg-gray-1 pb-10`}
    >
      <div className="flex w-full flex-col items-center justify-center px-6 py-16 sm:p-20 sm:py-12">
        <div className="flex w-full max-w-[896px] flex-col items-center justify-center space-y-8 pb-9 text-center lg:flex-row lg:items-start lg:space-y-0 lg:space-x-32 lg:text-left">
          {/* Download app for iOS and Android */}
          {lang === "en" ? (
            <>
              <div className="flex w-full max-w-[384px] flex-col items-center justify-center space-y-3 lg:items-start">
                <div className="flex flex-col space-y-1">
                  <h2 className="text-lg font-medium text-gray-100">
                    {textContent.DownloadApp.title}
                  </h2>
                  <p className="text-sm text-gray-80">
                    {textContent.DownloadApp.description}
                  </p>
                </div>
                {/* Images */}
                <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                  <div className="flex">
                    <img
                      src={iosStore}
                      width={148}
                      height={44}
                      className="cursor-pointer"
                      alt="Download on the App Store"
                      onClick={() => {
                        window.open(iosURL, "_blank");
                      }}
                    />
                  </div>
                  <div className="flex">
                    <img
                      src={androidStore}
                      onClick={() => {
                        window.open(androidURL, "_blank");
                      }}
                      width={148}
                      height={44}
                      className="cursor-pointer"
                      alt="Get it on Google Play"
                    />
                  </div>
                </div>
              </div>

              <div
                className={`${
                  hideNewsletter ? "hidden" : "flex"
                } mb-10 max-w-[384px] flex-col items-center justify-center space-y-3 text-center md:items-start md:text-left `}
              >
                <div className="flex w-full flex-col space-y-1 md:max-w-sm">
                  <h2 className="text-lg font-medium">
                    {textContent.NewsletterSection.title}
                  </h2>
                  <p
                    className={`text-base sm:text-sm ${
                      darkMode ? "text-cool-gray-30" : "text-gray-80"
                    }`}
                  >
                    {textContent.NewsletterSection.description}
                  </p>
                </div>

                <form
                  data-code="r3s4c1"
                  method="post"
                  target="_blank"
                  rel="noopener"
                  action="https://app.mailerlite.com/webforms/submit/r3s4c1"
                  className="flex w-full flex-col items-center justify-center md:flex-row"
                >
                  <input type="hidden" name="ml-submit" value="1" />
                  <input
                    name="fields[email]"
                    type="email"
                    placeholder={`${textContent.NewsletterSection.input}`}
                    className={`flex h-auto w-full flex-row rounded-lg px-4 py-3 text-lg outline-none sm:py-2 sm:text-base md:w-64 ${
                      darkMode
                        ? "border-cool-gray-70 bg-cool-gray-90 focus:border-primary focus:ring-opacity-30"
                        : "border-cool-gray-20 bg-white focus:border-blue-50 focus:ring-opacity-20"
                    } mb-2 appearance-none border text-left transition-all duration-150 focus:ring focus:ring-primary`}
                    required
                  />
                  <input
                    name="signup"
                    type="submit"
                    value={`${textContent.NewsletterSection.cta}`}
                    className="ml-2 flex w-full cursor-pointer items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-3 text-lg font-medium text-white transition-all duration-75 hover:bg-primary-dark focus:outline-none active:bg-primary-dark sm:mb-2 sm:py-2 sm:text-base"
                  />
                </form>
                <span className="text-sm text-gray-40">
                  {textContent.NewsletterSection.privacy}{" "}
                  <a href={urls.legal} target={"_blank"} rel="noreferrer">
                    <span className="cursor-pointer underline">
                      {textContent.NewsletterSection.privacyLink}
                    </span>
                  </a>
                </span>
              </div>
            </>
          ) : (
            <div
              className={`${
                hideNewsletter ? "hidden" : "flex"
              } mb-10 w-full flex-col items-start justify-center space-y-6 md:flex-row md:space-x-20 md:space-y-0`}
            >
              <div className="flex w-full flex-col space-y-1 md:max-w-sm">
                <h2 className="text-lg font-medium">
                  {textContent.NewsletterSection.title}
                </h2>
                <p
                  className={`text-base sm:text-sm ${
                    darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                  }`}
                >
                  {textContent.NewsletterSection.description}
                </p>
              </div>

              <form
                data-code="r3s4c1"
                method="post"
                target="_blank"
                rel="noopener"
                action="https://app.mailerlite.com/webforms/submit/r3s4c1"
                className="flex w-full flex-col items-center justify-center md:w-auto"
              >
                <input type="hidden" name="ml-submit" value="1" />
                <input
                  name="fields[email]"
                  type="email"
                  placeholder={`${textContent.NewsletterSection.input}`}
                  className={`flex h-auto w-full flex-row rounded-lg px-4 py-3 text-lg outline-none sm:py-2 sm:text-base md:w-64 ${
                    darkMode
                      ? "border-cool-gray-70 bg-cool-gray-90 focus:border-primary focus:ring-opacity-30"
                      : "border-cool-gray-20 bg-white focus:border-blue-50 focus:ring-opacity-20"
                  } mb-2 appearance-none border text-left transition-all duration-150 focus:ring focus:ring-primary`}
                  required
                />
                <input
                  name="signup"
                  type="submit"
                  value={`${textContent.NewsletterSection.cta}`}
                  className="mb-6 flex w-full cursor-pointer items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-3 text-lg font-medium text-white transition-all duration-75 hover:bg-primary-dark focus:outline-none active:bg-primary-dark sm:mb-2 sm:py-2 sm:text-base"
                />
                <span className="text-xs text-cool-gray-40 sm:text-supporting-2">
                  {textContent.NewsletterSection.privacy}{" "}
                  <a href={urls.legal} target={"_blank"} rel="noreferrer">
                    <span className="cursor-pointer underline">
                      {textContent.NewsletterSection.privacyLink}
                    </span>
                  </a>
                </span>
              </form>
            </div>
          )}
        </div>

        {/* Separator */}
        <div
          className={`${
            hideNewsletter ? "hidden" : "flex"
          } h-px  w-full max-w-[896px] ${
            darkMode ? "bg-cool-gray-90" : "bg-cool-gray-10"
          } mb-10`}
        />

        {/* Footer content */}
        <footer className="flex max-w-[896px] items-center justify-center">
          {/* Desktop version */}
          <div className="hidden w-full flex-col items-center justify-center md:space-y-16 lg:flex">
            <div className="flex w-full flex-row justify-between md:justify-center lg:space-x-20">
              <div className="flex flex-1 flex-col items-center lg:flex-none">
                <div className="flex flex-shrink-0 flex-col space-y-3">
                  <h3 className="text-lg font-medium">
                    {textContent.FooterSection.sections.products.title}
                  </h3>
                  <div
                    className={`flex flex-col space-y-1.5 text-base ${
                      darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                    }`}
                  >
                    <a
                      href={urls.products.drive}
                      target={"_blank"}
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.products.drive}
                    </a>

                    <a
                      href={urls.products.send}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-row items-center hover:text-primary"
                    >
                      <div>
                        {textContent.FooterSection.sections.products.send}
                      </div>
                    </a>

                    <a
                      href={urls.products.webdav}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-row items-center hover:text-primary"
                    >
                      <div>
                        {textContent.FooterSection.sections.products.webDAV}
                      </div>
                      <div className=" ml-2 flex h-max items-center justify-center rounded-full bg-primary bg-opacity-15 py-1 px-2 text-xs font-medium uppercase text-primary">
                        {textContent.FooterSection.new}
                      </div>
                    </a>

                    <a
                      href={urls.products.pricing}
                      target={"_blank"}
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.products.pricing}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center lg:flex-none">
                <div className="flex flex-shrink-0 flex-col space-y-3">
                  <h3 className="text-lg font-medium">
                    {textContent.FooterSection.sections.company.title}
                  </h3>
                  <div
                    className={`flex flex-col space-y-1.5 text-base ${
                      darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                    }`}
                  >
                    <a
                      href={urls.company.about}
                      target={"_blank"}
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.company.about}
                    </a>

                    <a
                      href={urls.company.privacy}
                      target={"_blank"}
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.company.privacy}
                    </a>

                    <a
                      href={urls.company.security}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.company.security}
                    </a>

                    <a
                      href={urls.company.openSource}
                      target={"_blank"}
                      rel="noreferrer"
                      className="flex max-w-[200px] flex-row items-center hover:text-primary"
                    >
                      {textContent.FooterSection.sections.company.openSource}
                      {lang !== "en" && (
                        <div className=" ml-2 flex h-max items-center justify-center rounded-full bg-primary bg-opacity-15 py-1 px-2 text-xs font-medium uppercase text-primary">
                          {textContent.FooterSection.new}
                        </div>
                      )}
                    </a>

                    <a
                      href={urls.company.legal}
                      className="hover:text-primary"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {textContent.FooterSection.sections.company.legal}
                    </a>

                    <a
                      href={urls.company.mediaArea}
                      className="flex max-w-[200px] flex-row items-center hover:text-primary"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {textContent.FooterSection.sections.company.mediaArea}
                    </a>

                    <a
                      href={urls.company.useCases}
                      className="hover:text-primary"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {textContent.FooterSection.sections.company.useCases}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center lg:flex-none">
                <div className="flex flex-shrink-0 flex-col space-y-3">
                  <h3 className="text-lg font-medium">
                    {textContent.FooterSection.sections.join.title}
                  </h3>
                  <div
                    className={`flex flex-col space-y-1.5 text-base ${
                      darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                    }`}
                  >
                    <a
                      href={urls.join.newsletter}
                      target="_top"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.join.newsletter}
                    </a>

                    <a
                      href={urls.join.signup}
                      target="_top"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.join.signup}
                    </a>

                    <a
                      href={urls.join.support}
                      className="cursor-pointer hover:text-primary"
                    >
                      {textContent.FooterSection.sections.join.support}
                    </a>

                    <a
                      href={urls.join.login}
                      target="_top"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.join.login}
                    </a>

                    <a
                      href={urls.join.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.join.github}
                    </a>

                    <a
                      href={urls.join.whitePaper}
                      download
                      className="hover:text-primary"
                      rel="noreferrer"
                    >
                      {textContent.FooterSection.sections.join.whitePaper}
                    </a>
                    <a
                      href={urls.join.affiliates}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.join.affiliates}
                    </a>
                    <a
                      href={urls.join.storageForEducation}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      {
                        textContent.FooterSection.sections.join
                          .storageForEducation
                      }
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex max-w-[180px] flex-col items-center lg:flex-none">
                <div className="flex flex-shrink-0 flex-col space-y-3">
                  <h3 className="text-lg font-medium">
                    {textContent.FooterSection.sections.resources.title}
                  </h3>
                  <div
                    className={`flex flex-col space-y-1.5 text-base ${
                      darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                    }`}
                  >
                    <a
                      href={urls.resources.blog}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.resources.blog}
                    </a>

                    <a
                      href={urls.resources.storageComparison}
                      target={"_blank"}
                      rel="noreferrer"
                      className="w-full max-w-[160px] hover:text-primary"
                    >
                      {textContent.FooterSection.sections.resources.comparison}
                    </a>

                    <a
                      href={urls.resources.privacyDirectory}
                      target={"_blank"}
                      rel="noreferrer"
                      className="w-full max-w-[265px] hover:text-primary"
                    >
                      {
                        textContent.FooterSection.sections.resources
                          .directoryOfPrivacyOrganizations
                      }
                    </a>

                    <a
                      href={urls.resources.cyberAwareness}
                      target={"_blank"}
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      {
                        textContent.FooterSection.sections.resources
                          .cyberAwareness
                      }
                    </a>

                    <a
                      className="flex  items-center hover:text-primary"
                      href={urls.resources.whatGoogleKnows}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {
                        textContent.FooterSection.sections.resources
                          .whatGoogleKnowsAboutMe
                      }
                    </a>

                    <a
                      className="flex  items-center hover:text-primary"
                      href={urls.resources.whatGoogleKnows}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {textContent.FooterSection.sections.resources.library}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex max-w-[220px] flex-col items-center lg:flex-none">
                <div className="flex flex-shrink-0 flex-col space-y-3">
                  <h3 className="text-lg font-medium">
                    {textContent.FooterSection.sections.tools.title}
                  </h3>
                  <div
                    className={`flex flex-col space-y-1.5 text-base ${
                      darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                    }`}
                  >
                    <a
                      className="hover:text-primary"
                      href={urls.tools.byteConverter}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {textContent.FooterSection.sections.tools.byteConverter}
                    </a>

                    <a
                      href={urls.tools.tempMail}
                      target={"_blank"}
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.tools.temporaryEmail}
                    </a>

                    <a
                      className="hover:text-primary"
                      href={urls.tools.passwordChecker}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {textContent.FooterSection.sections.tools.passwordChecker}
                    </a>

                    <a
                      href={urls.tools.virusScanner}
                      rel="noreferrer"
                      target={"_blank"}
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.tools.fileVirusScan}
                    </a>

                    <a
                      href={urls.tools.passwordGenerator}
                      className="flex items-center hover:text-primary"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {
                        textContent.FooterSection.sections.tools
                          .passwordGenerator
                      }
                    </a>

                    <a
                      href={urls.tools.fileConverter}
                      className="flex items-center hover:text-primary"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {textContent.FooterSection.sections.tools.fileConverter}
                      <div className="ml-2 flex h-max items-center justify-center rounded-full bg-primary bg-opacity-15 py-1 px-2 text-xs font-medium uppercase text-primary">
                        {textContent.FooterSection.new}
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div
              className={`${hideNewsletter ? "hidden" : "flex"} h-px w-full ${
                darkMode ? "bg-cool-gray-90" : "bg-cool-gray-10"
              } mb-10`}
            />

            {/* Logos */}
            <div className="flex w-full max-w-[900px] flex-row justify-between">
              <div className="flex flex-row items-center space-x-4">
                <a
                  href="https://internxt.com"
                  target={"_blank"}
                  rel="noreferrer"
                  className="flex flex-shrink-0"
                >
                  <img loading="lazy" src={Internxt} alt="Internxt logo" />
                </a>

                <p
                  className={`text-xs ${
                    darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                  }`}
                >
                  {textContent.FooterSection.copyright.line1 +
                    year +
                    textContent.FooterSection.copyright.line2}
                </p>
              </div>
              <div className="flex flex-row space-x-1">
                <a
                  href={urls.social.twitter}
                  target="_blank"
                  className="h-6 py-1.5 pr-2"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    className="h-4"
                    src={Twitter}
                    draggable="false"
                    alt="twitter icon"
                  />
                </a>
                <a
                  href={urls.social.facebook}
                  target="_blank"
                  className="h-6 py-1.5 pr-2"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    className="h-4"
                    src={Facebook}
                    draggable="false"
                    alt="facebook icon"
                  />
                </a>
                <a
                  href={urls.social.linkedin}
                  target="_blank"
                  className="h-6 py-1.5 pr-2"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    className="h-4"
                    src={LinkedIn}
                    draggable="false"
                    alt="linkedin icon"
                  />
                </a>
                <a
                  href={urls.social.youtube}
                  target="_blank"
                  className="h-6 py-1.5 pr-2"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    className="h-4"
                    src={YouTube}
                    draggable="false"
                    alt="youtube icon"
                  />
                </a>
                <a
                  href={urls.social.instagram}
                  target="_blank"
                  className="h-6 py-1.5 pr-2"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    className="h-4"
                    src={Instagram}
                    draggable="false"
                    alt="instagram icon"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile version */}
          <div className="flex flex-col lg:hidden">
            <Disclosure
              as="div"
              className={`border-b ${
                darkMode ? "border-cool-gray-90" : "border-cool-gray-10"
              }`}
            >
              {({ open }) => (
                <div>
                  <Disclosure.Button className="flex w-full items-center justify-between py-4 text-lg font-medium">
                    <span className="flex flex-row">
                      {textContent.FooterSection.sections.products.title}
                    </span>
                    <span className="relative h-5 w-5">
                      <CaretDown
                        className={`absolute top-0 left-0 h-full w-full ${
                          (open && darkMode) || (!open && !darkMode)
                            ? "text-cool-gray-30"
                            : "text-cool-gray-60"
                        } transition duration-300 ${
                          open ? "text-cool-gray-30" : "-rotate-180"
                        }`}
                      />
                      <CaretDown
                        className={`absolute top-0 left-0 h-full w-full ${
                          (open && darkMode) || (!open && !darkMode)
                            ? "text-cool-gray-30"
                            : "text-cool-gray-60"
                        } transition duration-300 ${
                          open ? "text-cool-gray-30" : "-rotate-90"
                        }`}
                      />
                    </span>
                  </Disclosure.Button>

                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-0"
                  >
                    <Disclosure.Panel
                      className={`flex flex-col ${
                        darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                      } space-y-4 p-4 pt-2`}
                    >
                      <a
                        href={urls.products.drive}
                        target={"_blank"}
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        {textContent.FooterSection.sections.products.drive}
                      </a>

                      <a
                        href={urls.products.send}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row items-center hover:text-primary"
                      >
                        <div>
                          {textContent.FooterSection.sections.products.send}
                        </div>
                      </a>

                      <a
                        href={urls.products.webdav}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row items-center hover:text-primary"
                      >
                        <div>
                          {textContent.FooterSection.sections.products.webDAV}
                        </div>
                        <div className=" ml-2 flex h-max items-center justify-center rounded-full bg-primary bg-opacity-15 py-1 px-2 text-xs font-medium uppercase text-primary">
                          {textContent.FooterSection.new}
                        </div>
                      </a>

                      <a
                        href={urls.products.pricing}
                        target={"_blank"}
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        {textContent.FooterSection.sections.products.pricing}
                      </a>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>

            <Disclosure
              as="div"
              className={`border-b ${
                darkMode ? "border-cool-gray-90" : "border-cool-gray-10"
              }`}
            >
              {({ open }) => (
                <div>
                  <Disclosure.Button className="flex w-full items-center justify-between py-4 text-lg font-medium">
                    <span className="flex flex-row">
                      {textContent.FooterSection.sections.company.title}
                    </span>
                    <span className="relative h-5 w-5">
                      <CaretDown
                        className={`absolute top-0 left-0 h-full w-full ${
                          (open && darkMode) || (!open && !darkMode)
                            ? "text-cool-gray-30"
                            : "text-cool-gray-60"
                        } transition duration-300 ${
                          open ? "text-cool-gray-30" : "-rotate-180"
                        }`}
                      />
                      <CaretDown
                        className={`absolute top-0 left-0 h-full w-full ${
                          (open && darkMode) || (!open && !darkMode)
                            ? "text-cool-gray-30"
                            : "text-cool-gray-60"
                        } transition duration-300 ${
                          open ? "text-cool-gray-30" : "-rotate-90"
                        }`}
                      />
                    </span>
                  </Disclosure.Button>

                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-0"
                  >
                    <Disclosure.Panel
                      className={`flex flex-col ${
                        darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                      } space-y-4 p-4 pt-2`}
                    >
                      <a
                        href={urls.company.about}
                        target={"_blank"}
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        {textContent.FooterSection.sections.company.about}
                      </a>

                      <a
                        href={urls.company.privacy}
                        target={"_blank"}
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        {textContent.FooterSection.sections.company.privacy}
                      </a>

                      <a
                        href={urls.company.security}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        {textContent.FooterSection.sections.company.security}
                      </a>

                      <a
                        href={urls.company.openSource}
                        target={"_blank"}
                        rel="noreferrer"
                        className="flex max-w-[200px] flex-row items-center hover:text-primary"
                      >
                        {textContent.FooterSection.sections.company.openSource}
                        {lang !== "en" && (
                          <div className=" ml-2 flex h-max items-center justify-center rounded-full bg-primary bg-opacity-15 py-1 px-2 text-xs font-medium uppercase text-primary">
                            {textContent.FooterSection.new}
                          </div>
                        )}
                      </a>

                      <a
                        href={urls.company.legal}
                        className="hover:text-primary"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {textContent.FooterSection.sections.company.legal}
                      </a>

                      <a
                        href={urls.company.mediaArea}
                        className="flex max-w-[200px] flex-row items-center hover:text-primary"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {textContent.FooterSection.sections.company.mediaArea}
                      </a>

                      <a
                        href={urls.company.useCases}
                        className="hover:text-primary"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {textContent.FooterSection.sections.company.useCases}
                      </a>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>

            <Disclosure
              as="div"
              className={`border-b ${
                darkMode ? "border-cool-gray-90" : "border-cool-gray-10"
              }`}
            >
              {({ open }) => (
                <div>
                  <Disclosure.Button className="flex w-full items-center justify-between py-4 text-lg font-medium">
                    <span className="flex flex-row">
                      {textContent.FooterSection.sections.join.title}
                    </span>
                    <span className="relative h-5 w-5">
                      <CaretDown
                        className={`absolute top-0 left-0 h-full w-full ${
                          (open && darkMode) || (!open && !darkMode)
                            ? "text-cool-gray-30"
                            : "text-cool-gray-60"
                        } transition duration-300 ${
                          open ? "text-cool-gray-30" : "-rotate-180"
                        }`}
                      />
                      <CaretDown
                        className={`absolute top-0 left-0 h-full w-full ${
                          (open && darkMode) || (!open && !darkMode)
                            ? "text-cool-gray-30"
                            : "text-cool-gray-60"
                        } transition duration-300 ${
                          open ? "text-cool-gray-30" : "-rotate-90"
                        }`}
                      />
                    </span>
                  </Disclosure.Button>

                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-0"
                  >
                    <Disclosure.Panel
                      className={`flex flex-col ${
                        darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                      } space-y-4 p-4 pt-2`}
                    >
                      <a
                        href={urls.join.newsletter}
                        target="_top"
                        className="hover:text-primary"
                      >
                        {textContent.FooterSection.sections.join.newsletter}
                      </a>

                      <a
                        href={urls.join.signup}
                        target="_top"
                        className="hover:text-primary"
                      >
                        {textContent.FooterSection.sections.join.signup}
                      </a>

                      <a
                        href={urls.join.support}
                        className="cursor-pointer hover:text-primary"
                      >
                        {textContent.FooterSection.sections.join.support}
                      </a>

                      <a
                        href={urls.join.login}
                        target="_top"
                        className="hover:text-primary"
                      >
                        {textContent.FooterSection.sections.join.login}
                      </a>

                      <a
                        href={urls.join.github}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        {textContent.FooterSection.sections.join.github}
                      </a>

                      <a
                        href={urls.join.whitePaper}
                        download
                        className="hover:text-primary"
                        rel="noreferrer"
                      >
                        {textContent.FooterSection.sections.join.whitePaper}
                      </a>
                      <a
                        href={urls.join.affiliates}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        {textContent.FooterSection.sections.join.affiliates}
                      </a>
                      <a
                        href={urls.join.storageForEducation}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        {
                          textContent.FooterSection.sections.join
                            .storageForEducation
                        }
                      </a>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>

            <Disclosure
              as="div"
              className={`border-b ${
                darkMode ? "border-cool-gray-90" : "border-cool-gray-10"
              }`}
            >
              {({ open }) => (
                <div>
                  <Disclosure.Button className="flex w-full items-center justify-between py-4 text-lg font-medium">
                    <span className="flex flex-row">
                      {textContent.FooterSection.sections.resources.title}
                    </span>
                    <span className="relative h-5 w-5">
                      <CaretDown
                        className={`absolute top-0 left-0 h-full w-full ${
                          (open && darkMode) || (!open && !darkMode)
                            ? "text-cool-gray-30"
                            : "text-cool-gray-60"
                        } transition duration-300 ${
                          open ? "text-cool-gray-30" : "-rotate-180"
                        }`}
                      />
                      <CaretDown
                        className={`absolute top-0 left-0 h-full w-full ${
                          (open && darkMode) || (!open && !darkMode)
                            ? "text-cool-gray-30"
                            : "text-cool-gray-60"
                        } transition duration-300 ${
                          open ? "text-cool-gray-30" : "-rotate-90"
                        }`}
                      />
                    </span>
                  </Disclosure.Button>

                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-0"
                  >
                    <Disclosure.Panel
                      className={`flex flex-col ${
                        darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                      } space-y-4 p-4 pt-2`}
                    >
                      <a
                        href={urls.resources.blog}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {textContent.FooterSection.sections.resources.blog}
                      </a>

                      <a href={urls.resources.privacyDirectory}>
                        {
                          textContent.FooterSection.sections.resources
                            .directoryOfPrivacyOrganizations
                        }
                      </a>

                      <a
                        href={urls.resources.storageComparison}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {
                          textContent.FooterSection.sections.resources
                            .comparison
                        }
                      </a>

                      <a
                        href={urls.resources.cyberAwareness}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {
                          textContent.FooterSection.sections.resources
                            .cyberAwareness
                        }
                      </a>

                      <a
                        href={urls.resources.whatGoogleKnows}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {
                          textContent.FooterSection.sections.resources
                            .whatGoogleKnowsAboutMe
                        }
                      </a>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
            <Disclosure
              as="div"
              className={`border-b ${
                darkMode ? "border-cool-gray-90" : "border-cool-gray-10"
              }`}
            >
              {({ open }) => (
                <div>
                  <Disclosure.Button className="flex w-full items-center justify-between py-4 text-lg font-medium">
                    <span className="flex flex-row">
                      {textContent.FooterSection.sections.tools.title}
                    </span>
                    <span className="relative h-5 w-5">
                      <CaretDown
                        className={`absolute top-0 left-0 h-full w-full ${
                          (open && darkMode) || (!open && !darkMode)
                            ? "text-cool-gray-30"
                            : "text-cool-gray-60"
                        } transition duration-300 ${
                          open ? "text-cool-gray-30" : "-rotate-180"
                        }`}
                      />
                      <CaretDown
                        className={`absolute top-0 left-0 h-full w-full ${
                          (open && darkMode) || (!open && !darkMode)
                            ? "text-cool-gray-30"
                            : "text-cool-gray-60"
                        } transition duration-300 ${
                          open ? "text-cool-gray-30" : "-rotate-90"
                        }`}
                      />
                    </span>
                  </Disclosure.Button>

                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-0"
                  >
                    <Disclosure.Panel
                      className={`flex flex-col ${
                        darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                      } space-y-4 p-4 pt-2`}
                    >
                      <a
                        href={urls.tools.byteConverter}
                        lang={lang}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {textContent.FooterSection.sections.tools.byteConverter}
                      </a>

                      <a
                        href={urls.tools.tempMail}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {
                          textContent.FooterSection.sections.tools
                            .temporaryEmail
                        }
                      </a>

                      <a
                        href={urls.tools.passwordChecker}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {
                          textContent.FooterSection.sections.tools
                            .passwordChecker
                        }
                      </a>

                      <a
                        href={urls.tools.virusScanner}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {textContent.FooterSection.sections.tools.fileVirusScan}
                      </a>
                      <a
                        href={urls.tools.passwordGenerator}
                        className="flex items-center hover:text-primary"
                      >
                        {
                          textContent.FooterSection.sections.tools
                            .passwordGenerator
                        }
                      </a>

                      <a
                        href={urls.tools.fileConverter}
                        className="flex items-center hover:text-primary"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {textContent.FooterSection.sections.tools.fileConverter}
                        <div className="ml-2 flex h-max items-center justify-center rounded-full bg-primary bg-opacity-15 py-1 px-2 text-xs font-medium uppercase text-primary">
                          {textContent.FooterSection.new}
                        </div>
                      </a>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>

            <div className="mt-16 flex flex-col items-center space-y-4">
              <div className="flex flex-row space-x-1">
                <a
                  href={urls.social.twitter}
                  target="_blank"
                  className="h-8 py-1.5 pr-6"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    className="h-5"
                    src={Twitter}
                    draggable="false"
                    alt="twitter icon"
                  />
                </a>
                <a
                  href={urls.social.facebook}
                  target="_blank"
                  className="h-8 py-1.5 pr-6"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    className="h-5"
                    src={Facebook}
                    draggable="false"
                    alt="facebook icon"
                  />
                </a>
                <a
                  href={urls.social.linkedin}
                  target="_blank"
                  className="h-8 py-1.5 pr-6"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    className="h-5"
                    src={LinkedIn}
                    draggable="false"
                    alt="linkedin icon"
                  />
                </a>
                <a
                  href={urls.social.youtube}
                  target="_blank"
                  className="h-8 py-1.5 pr-6"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    className="h-5"
                    src={YouTube}
                    draggable="false"
                    alt="youtube icon"
                  />
                </a>
                <a
                  href={urls.social.instagram}
                  target="_blank"
                  className="h-8 py-1.5 pr-6"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    className="h-5"
                    src={Instagram}
                    draggable="false"
                    alt="instagram icon"
                  />
                </a>
              </div>

              <p
                className={`text-xs ${
                  darkMode ? "text-cool-gray-30" : "text-cool-gray-60"
                }`}
              >
                {textContent.FooterSection.copyright.line1 +
                  year +
                  textContent.FooterSection.copyright.line2}
              </p>

              <a href="https://internxt.com" className="flex flex-shrink-0">
                <img loading="lazy" src={Internxt} alt="Internxt logo" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
