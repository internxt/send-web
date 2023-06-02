import { Transition, Disclosure } from "@headlessui/react";
import { Minus } from "phosphor-react";
import Facebook from "../../assets/social/cool-gray-60/facebook.svg";
import Instagram from "../../assets/social/cool-gray-60/instagram.svg";
import LinkedIn from "../../assets/social/cool-gray-60/linkedin.svg";
import Twitter from "../../assets/social/cool-gray-60/twitter.svg";
import YouTube from "../../assets/social/cool-gray-60/youtube.svg";
import Internxt from "../../assets/Internxt.svg";

import label from "../../assets/lang/en/footer.json";

export default function Footer() {
  return (
    <div className="z-10 flex w-full flex-col items-center justify-center bg-white px-6 py-16 sm:p-20 sm:py-12">
      {/* Newsletter */}
      <div
        className={`mb-10 flex w-full flex-col items-start justify-center space-y-6 md:flex-row md:space-x-20 md:space-y-0`}
      >
        <div className="flex w-full flex-col space-y-1 md:max-w-sm">
          <h2 className="text-lg font-medium">
            {label.NewsletterSection.title}
          </h2>
          <p className={`text-base text-cool-gray-60 sm:text-sm`}>
            {label.NewsletterSection.description}
          </p>
        </div>

        <form
          data-code="r3s4c1"
          method="post"
          target="_blank"
          action="https://app.mailerlite.com/webforms/submit/r3s4c1"
          className="flex w-full flex-col items-center justify-center md:w-auto"
        >
          <input type="hidden" name="ml-submit" value="1" />
          <input
            name="fields[email]"
            type="email"
            placeholder={`${label.NewsletterSection.input}`}
            className={`} mb-2 flex h-auto w-full appearance-none flex-row rounded-lg border border-cool-gray-20 bg-white px-4 
                py-3 text-left text-lg outline-none
              transition-all duration-150 focus:border-blue-50 focus:ring focus:ring-primary focus:ring-opacity-20 sm:py-2 sm:text-base md:w-64`}
            required
          />
          <input
            name="signup"
            type="submit"
            value={`${label.NewsletterSection.cta}`}
            className="mb-6 flex w-full cursor-pointer items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-3 text-lg font-medium text-white transition-all duration-75 focus:outline-none active:bg-primary-dark sm:mb-2 sm:py-2 sm:text-base"
          />
          <span className="text-xs text-cool-gray-40 sm:text-supporting-2">
            {label.NewsletterSection.privacy}{" "}
            <a href="https://internxt.com/legal">
              <span className="cursor-pointer underline">
                {label.NewsletterSection.privacyLink}
              </span>
            </a>
          </span>
        </form>
      </div>

      {/* Separator */}
      <div className={`mb-10 flex h-px w-full bg-cool-gray-10`} />

      {/* Footer content */}
      <footer className="w-full">
        {/* Desktop version */}
        <div className="hidden flex-col items-center md:flex md:space-y-16">
          <div className="flex w-full flex-row justify-between md:justify-center lg:space-x-20 xl:space-x-32">
            <div className="flex flex-1 flex-col items-center lg:flex-none">
              <div className="flex flex-shrink-0 flex-col space-y-3">
                <h3 className="text-lg font-medium">
                  {label.FooterSection.sections.products.title}
                </h3>
                <div
                  className={`flex flex-col space-y-1.5 text-base text-cool-gray-60`}
                >
                  <a
                    href="https://internxt.com/drive"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.products.drive}
                  </a>

                  <a
                    href="https://internxt.com/photos"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.products.photos}
                  </a>

                  <a
                    href="https://send.internxt.com"
                    target={"_blank"}
                    rel="noerrer noreferrer"
                    className="flex flex-row items-center hover:text-primary"
                  >
                    <div>{label.FooterSection.sections.products.send}</div>
                  </a>

                  <a
                    href="https://internxt.com/token"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.products.token}
                  </a>

                  <a
                    href="https://internxt.com/pricing"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.products.pricing}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center lg:flex-none">
              <div className="flex flex-shrink-0 flex-col space-y-3">
                <h3 className="text-lg font-medium">
                  {label.FooterSection.sections.company.title}
                </h3>
                <div
                  className={`flex flex-col space-y-1.5 text-base text-cool-gray-60`}
                >
                  <a
                    href="https://internxt.com/about"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.company.about}
                  </a>

                  <a
                    href="https://internxt.com/privacy"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.company.privacy}
                  </a>

                  <a
                    href={`https://blog.internxt.com/how-internxt-protects-your-data/
                    `}
                    rel="noerrer noreferrer"
                    className="hover:text-primary"
                    target={"_blank"}
                  >
                    {label.FooterSection.sections.company.security}
                  </a>

                  <a
                    href="https://internxt.com/legal"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.company.legal}
                  </a>

                  <a
                    href="https://help.internxt.com/"
                    rel="noerrer noreferrer"
                    className="hover:text-primary"
                    target={"_blank"}
                  >
                    {label.FooterSection.sections.company.support}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center lg:flex-none">
              <div className="flex flex-shrink-0 flex-col space-y-3">
                <h3 className="text-lg font-medium">
                  {label.FooterSection.sections.join.title}
                </h3>
                <div
                  className={`flex flex-col space-y-1.5 text-base text-cool-gray-60`}
                >
                  <a
                    href="https://drive.internxt.com/new"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.join.signup}
                  </a>

                  <a
                    className="hover:text-primary"
                    target={"_blank"}
                    href="https://drive.internxt.com/login"
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.join.login}
                  </a>

                  <a
                    href="https://github.com/internxt"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary"
                  >
                    {label.FooterSection.sections.join.github}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center lg:flex-none">
              <div className="flex flex-shrink-0 flex-col space-y-3">
                <h3 className="text-lg font-medium">
                  {label.FooterSection.sections.resources.title}
                </h3>
                <div
                  className={`flex flex-col space-y-1.5 text-base text-cool-gray-60`}
                >
                  <a
                    className="hover:text-primary"
                    target={"_blank"}
                    href="https://blog.internxt.com/"
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.resources.blog}
                  </a>

                  <a
                    href="https://internxt.com/cloud-storage-comparison"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.resources.comparison}
                  </a>

                  <a
                    className="line-clamp-2 max-w-[150px] hover:text-primary"
                    target={"_blank"}
                    href="https://internxt.com/privacy-directory"
                    rel="noreferrer"
                  >
                    {
                      label.FooterSection.sections.resources
                        .directoryOfPrivacyOrganizations
                    }
                  </a>

                  <a
                    className="hover:text-primary"
                    target={"_blank"}
                    href="https://internxt.com/cyber-awareness"
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.resources.cyberAwareness}
                  </a>
                  <a
                    className="hover:text-primary"
                    target={"_blank"}
                    href="https://internxt.com/what-does-google-know-about-me"
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.resources.whatGoogleKnows}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center lg:flex-none">
              <div className="flex flex-shrink-0 flex-col space-y-3">
                <h3 className="text-lg font-medium">
                  {label.FooterSection.sections.tools.title}
                </h3>
                <div
                  className={`flex flex-col space-y-1.5 text-base text-cool-gray-60`}
                >
                  <a
                    href="https://internxt.com/password-checker"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.tools.passwordChecker}
                  </a>

                  <a
                    href="https://internxt.com/virus-scanner"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.tools.fileVirusScan}
                  </a>
                  <a
                    href="https://internxt.com/byte-converter"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.tools.byteConverter}
                  </a>

                  <a
                    href="https://internxt.com/temporary-email"
                    className="hover:text-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    {label.FooterSection.sections.tools.temporaryEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center space-y-4">
            <div className="flex flex-row space-x-1">
              <a
                href="https://twitter.com/Internxt"
                target="_blank"
                className="h-6 py-1.5 pr-2"
                rel="noerrer noreferrer"
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
                href="https://www.facebook.com/internxt"
                target="_blank"
                className="h-6 py-1.5 pr-2"
                rel="noerrer noreferrer"
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
                href="https://www.linkedin.com/company/internxt/mycompany/"
                target="_blank"
                className="h-6 py-1.5 pr-2"
                rel="noerrer noreferrer"
              >
                <img
                  loading="lazy"
                  className="h-4"
                  src={LinkedIn}
                  draggable="false"
                  alt="LinkedIn icon"
                />
              </a>
              <a
                href="https://www.youtube.com/channel/UCW2SxWdVEAEACYuejCgpGwg/featured"
                target="_blank"
                className="h-6 py-1.5 pr-2"
                rel="noerrer noreferrer"
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
                href="https://instagram.com/internxt/"
                target="_blank"
                className="h-6 py-1.5 pr-2"
                rel="noerrer noreferrer"
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

            <p className={`$text-cool-gray-60 text-xs`}>
              {label.FooterSection.copyright}
            </p>

            <a className="flex flex-shrink-0" href="https://internxt.com/">
              <img loading="lazy" src={Internxt} alt="Internxt logo" />
            </a>
          </div>
        </div>

        {/* Mobile version */}
        <div className="flex flex-col md:hidden">
          <Disclosure as="div" className={`border-b border-cool-gray-10`}>
            {({ open }) => (
              <div>
                <Disclosure.Button className="flex w-full items-center justify-between py-4 text-lg font-medium">
                  <span className="flex flex-row">
                    {label.FooterSection.sections.products.title}
                  </span>
                  <span className="relative h-5 w-5">
                    <Minus
                      className={`absolute left-0 top-0 h-full w-full ${
                        open ? "text-cool-gray-30" : "text-cool-gray-60"
                      } transition duration-300 ${
                        open ? "text-cool-gray-30" : "-rotate-180"
                      }`}
                    />
                    <Minus
                      className={`absolute left-0 top-0 h-full w-full ${
                        open ? "text-cool-gray-30" : "text-cool-gray-60"
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
                    className={`flex flex-col space-y-4 p-4 pt-2 text-cool-gray-60`}
                  >
                    <a href="https://internxt.com/drive">
                      {label.FooterSection.sections.products.drive}
                    </a>

                    <a href="https://internxt.com/photos">
                      {label.FooterSection.sections.products.photos}
                    </a>

                    <a
                      href="https://send.internxt.com"
                      target="_blank"
                      rel="noerrer noreferrer"
                      className="flex flex-row items-center"
                    >
                      <div>{label.FooterSection.sections.products.send}</div>
                      <div className="pointer-events-none ml-2 flex flex-row items-center whitespace-nowrap rounded-full bg-orange bg-opacity-15 px-2 py-1 text-supporting-1 font-medium uppercase text-orange">
                        {label.FooterSection.new}
                      </div>
                    </a>

                    <a href="https://internxt.com/token">
                      {label.FooterSection.sections.products.token}
                    </a>

                    <a href="https://internxt.com/pricing">
                      {label.FooterSection.sections.products.pricing}
                    </a>

                    {/*
                      <a h="/security" >
                        <a>{text.FooterSection.sections.products.security}</a>
                      </a>
                      */}
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>

          <Disclosure as="div" className={`border-b border-cool-gray-10`}>
            {({ open }) => (
              <div>
                <Disclosure.Button className="flex w-full items-center justify-between py-4 text-lg font-medium">
                  <span className="flex flex-row">
                    {label.FooterSection.sections.company.title}
                  </span>
                  <span className="relative h-5 w-5">
                    <Minus
                      className={`absolute left-0 top-0 h-full w-full ${
                        open ? "text-cool-gray-30" : "text-cool-gray-60"
                      } transition duration-300 ${
                        open ? "text-cool-gray-30" : "-rotate-180"
                      }`}
                    />
                    <Minus
                      className={`absolute left-0 top-0 h-full w-full ${
                        open ? "text-cool-gray-30" : "text-cool-gray-60"
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
                    className={`flex flex-col space-y-4 p-4 pt-2 text-cool-gray-60`}
                  >
                    <a href="https://internxt.com/about">
                      {label.FooterSection.sections.company.about}
                    </a>

                    <a href="https://internxt.com/privacy">
                      {label.FooterSection.sections.company.privacy}
                    </a>

                    <a
                      href={`https://blog.internxt.com/how-internxt-protects-your-data/
                        `}
                      target="_blank"
                      rel="noerrer noreferrer"
                    >
                      {label.FooterSection.sections.company.security}
                    </a>

                    <a href="https://internxt.com/legal">
                      {label.FooterSection.sections.company.legal}
                    </a>

                    <a
                      href="https://help.internxt.com/"
                      target="_blank"
                      rel="noerrer noreferrer"
                    >
                      {label.FooterSection.sections.company.support}
                    </a>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>

          <Disclosure
            as="div"
            className={`border-b border-cool-gray-10
              `}
          >
            {({ open }) => (
              <div>
                <Disclosure.Button className="flex w-full items-center justify-between py-4 text-lg font-medium">
                  <span className="flex flex-row">
                    {label.FooterSection.sections.join.title}
                  </span>
                  <span className="relative h-5 w-5">
                    <Minus
                      className={`absolute left-0 top-0 h-full w-full ${
                        open ? "text-cool-gray-30" : "text-cool-gray-60"
                      } transition duration-300 ${
                        open ? "text-cool-gray-30" : "-rotate-180"
                      }`}
                    />
                    <Minus
                      className={`absolute left-0 top-0 h-full w-full ${
                        open ? "text-cool-gray-30" : "text-cool-gray-60"
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
                    className={`flex flex-col space-y-4
                      p-4 pt-2 text-cool-gray-60`}
                  >
                    <a href="https://drive.internxt.com/new">
                      {label.FooterSection.sections.join.signup}
                    </a>

                    <a href="https://drive.internxt.com/login">
                      {label.FooterSection.sections.join.login}
                    </a>

                    <a
                      href="https://t.me/internxt"
                      target="_blank"
                      rel="noerrer noreferrer"
                    >
                      {label.FooterSection.sections.join.community}
                    </a>

                    <a
                      href="https://github.com/internxt"
                      target="_blank"
                      rel="noerrer noreferrer"
                    >
                      {label.FooterSection.sections.join.github}
                    </a>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>

          <Disclosure as="div" className={`border-b border-cool-gray-10`}>
            {({ open }) => (
              <div>
                <Disclosure.Button className="flex w-full items-center justify-between py-4 text-lg font-medium">
                  <span className="flex flex-row">
                    {label.FooterSection.sections.resources.title}
                  </span>
                  <span className="relative h-5 w-5">
                    <Minus
                      className={`absolute left-0 top-0 h-full w-full ${
                        open ? "text-cool-gray-30" : "text-cool-gray-60"
                      } transition duration-300 ${
                        open ? "text-cool-gray-30" : "-rotate-180"
                      }`}
                    />
                    <Minus
                      className={`absolute left-0 top-0 h-full w-full ${
                        open ? "text-cool-gray-30" : "text-cool-gray-60"
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
                    className={`flex flex-col space-y-4 p-4 pt-2 text-cool-gray-60`}
                  >
                    <a
                      href={`https://blog.internxt.com/`}
                      target="_blank"
                      rel="noerrer noreferrer"
                    >
                      {label.FooterSection.sections.resources.blog}
                    </a>

                    {/*
                      <a h="/library" >
                        <a>{text.FooterSection.sections.resources.library}</a>
                      </a>

                      <a h="/write-for-us" >
                        <a>{text.FooterSection.sections.resources.writeForUs}</a>
                      </a>

                      <a h="/glossary" >
                        <a>{text.FooterSection.sections.resources.cyberSecurityGlossary}</a>
                      </a>
                      */}

                    <a href="https://internxt.com/password-checker">
                      {
                        label.FooterSection.sections.resources
                          .directoryOfPrivacyOrganizations
                      }
                    </a>
                    <a href="https://internxt.com/cyber-awareness">
                      {label.FooterSection.sections.resources.cyberAwareness}
                    </a>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
          <Disclosure as="div" className={`border-b border-cool-gray-10`}>
            {({ open }) => (
              <div>
                <Disclosure.Button className="flex w-full items-center justify-between py-4 text-lg font-medium">
                  <span className="flex flex-row">
                    {label.FooterSection.sections.tools.title}
                  </span>
                  <span className="relative h-5 w-5">
                    <Minus
                      className={`absolute left-0 top-0 h-full w-full ${
                        open ? "text-cool-gray-30" : "text-cool-gray-60"
                      } transition duration-300 ${
                        open ? "text-cool-gray-30" : "-rotate-180"
                      }`}
                    />
                    <Minus
                      className={`absolute left-0 top-0 h-full w-full ${
                        open ? "text-cool-gray-30" : "text-cool-gray-60"
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
                    className={`flex flex-col space-y-4 p-4 pt-2 text-cool-gray-60`}
                  >
                    <a
                      href="https://internxt.com/byte-converter"
                      className="hover:text-primary"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {label.FooterSection.sections.tools.byteConverter}
                    </a>

                    <a
                      href="https://internxt.com/temporary-email"
                      className="hover:text-primary"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {label.FooterSection.sections.tools.temporaryEmail}
                    </a>

                    <a
                      href="https://internxt.com/password-checker"
                      className="hover:text-primary"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {label.FooterSection.sections.tools.passwordChecker}
                    </a>

                    <a
                      href="https://internxt.com/virus-scanner"
                      className="hover:text-primary"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {label.FooterSection.sections.tools.fileVirusScan}
                    </a>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>

          <div className="mt-16 flex flex-col items-center space-y-4">
            <div className="flex flex-row space-x-1">
              <a
                href="https://twitter.com/Internxt"
                target="_blank"
                className="h-8 py-1.5 pr-6"
                rel="noerrer noreferrer"
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
                href="https://www.facebook.com/internxt"
                target="_blank"
                className="h-8 py-1.5 pr-6"
                rel="noerrer noreferrer"
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
                href="https://www.linkedin.com/company/internxt/mycompany/"
                target="_blank"
                className="h-8 py-1.5 pr-6"
                rel="noerrer noreferrer"
              >
                <img
                  loading="lazy"
                  className="h-5"
                  src={LinkedIn}
                  draggable="false"
                  alt="LinkedIn icon"
                />
              </a>
              <a
                href="https://www.youtube.com/channel/UCW2SxWdVEAEACYuejCgpGwg/featured"
                target="_blank"
                className="h-8 py-1.5 pr-6"
                rel="noerrer noreferrer"
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
                href="https://instagram.com/internxt/"
                target="_blank"
                className="h-8 py-1.5 pr-6"
                rel="noerrer noreferrer"
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

            <p className={`text-xs text-cool-gray-60`}>
              {label.FooterSection.copyright}
            </p>

            <a className="flex flex-shrink-0" href="https://internxt.com/">
              <img loading="lazy" src={Internxt} alt="Internxt logo" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
