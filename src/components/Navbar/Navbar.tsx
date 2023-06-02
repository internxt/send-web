import { useEffect, useState } from "react";
import { Transition, Disclosure } from "@headlessui/react";
import textContent from "../../assets/lang/en/navbar.json";
import { CaretDown, UserCircleMinus } from "phosphor-react";
import { Squeeze as Hamburger } from "hamburger-react";
import { goToLoginURL, goToSignUpURL } from "../../lib/auth";
import logo from "../../logo.svg";
import logo_dark from "../../logo_dark.svg";

const INTERNXT_URL = "https://internxt.com";

export default function Navbar() {
  const [menuState, setMenuState] = useState(false);
  const [scrolled, setScrolled] = useState(true);

  // DIALOG MANAGEMENT

  // SCROLL EFFECTS

  const handleScroll = () => setScrolled(window.pageYOffset > 0);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
  });

  return (
    <div
      id="navbar"
      className={`absolute
       z-30 flex h-20 w-full items-center bg-transparent text-black
      transition-all duration-100 lg:h-16 lg:text-white`}
    >
      <div className="mx-4 w-full lg:mx-10 xl:mx-32">
        <div className="navbar mx-auto flex max-w-screen-xl items-center justify-between">
          {/* Left side of navbar: Logo / Hamburguer menu */}
          <div className=" flex flex-1 flex-shrink-0 flex-grow flex-row items-center justify-start space-x-4 lg:space-x-0">
            <div className="flex lg:hidden">
              <Hamburger
                label="Show menu"
                size={24}
                color={"black"}
                toggled={menuState}
                toggle={setMenuState}
              />

              {/* Mobile hamburger menu background */}
              <div
                className={`pointer-events-none fixed left-0 top-14 flex h-full w-full bg-white transition-all duration-500 ${
                  menuState ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Mobile hamburger menu */}
              {
                <div
                  className={`fixed left-0 top-14 flex w-full flex-col overflow-hidden bg-white text-xl transition-all duration-500 ${
                    menuState ? "h-screen overflow-y-auto pb-14" : "h-0"
                  }`}
                >
                  <div className="my-6 font-medium">
                    <a
                      href={`${INTERNXT_URL}/pricing`}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={0}
                      onClick={() => {
                        setMenuState(false);
                      }}
                      className={`flex w-full translate-y-0 px-8 py-3 outline-none transition delay-100 duration-300 ${
                        menuState ? "opacity-100" : "-translate-y-4 opacity-0"
                      }`}
                    >
                      {textContent.links.pricing}
                    </a>

                    <Disclosure as="div">
                      {({ open }) => (
                        <div
                          className={`translate-y-0 transition delay-150 duration-300 ${
                            menuState
                              ? "opacity-100"
                              : "-translate-y-4 opacity-0"
                          }`}
                        >
                          <div className={`${open ? "bg-cool-gray-5" : ""}`}>
                            <Disclosure.Button
                              className={`flex w-full items-center justify-between px-8 py-3 font-medium ${
                                open ? "bg-cool-gray-10" : ""
                              }`}
                            >
                              <span>{textContent.links.products}</span>
                              <span className="relative h-6 w-6">
                                <UserCircleMinus
                                  className={`absolute left-0 top-0 h-6 w-6 transition duration-300 ${
                                    open
                                      ? "text-cool-gray-60"
                                      : "-rotate-180 text-cool-gray-40"
                                  }`}
                                />
                                <UserCircleMinus
                                  className={`absolute left-0 top-0 h-6 w-6 transition duration-300 ${
                                    open
                                      ? "text-cool-gray-60"
                                      : "-rotate-90 text-cool-gray-40"
                                  }`}
                                />
                              </span>
                            </Disclosure.Button>

                            <Transition
                              enter="transition duration-200 ease-out"
                              enterFrom="scale-95 opacity-0"
                              enterTo="scale-100 opacity-100"
                              leave="transition duration-200 ease-out"
                              leaveFrom="scale-100 opacity-100"
                              leaveTo="scale-95 opacity-0"
                            >
                              <Disclosure.Panel className="mb-4 flex flex-col py-3 text-cool-gray-80">
                                <a
                                  href={`${INTERNXT_URL}/drive`}
                                  tabIndex={0}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => {
                                    setMenuState(false);
                                  }}
                                  className="flex w-full justify-start px-8 py-3 text-lg font-medium text-cool-gray-80 outline-none"
                                >
                                  {textContent.products.drive}
                                </a>

                                <a
                                  href={`${INTERNXT_URL}/photos`}
                                  tabIndex={0}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => {
                                    setMenuState(false);
                                  }}
                                  className="flex w-full justify-start px-8 py-3 text-lg font-medium text-cool-gray-80 outline-none"
                                >
                                  {textContent.products.photos}
                                </a>

                                <a
                                  href="https://send.internxt.com"
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex w-full items-center justify-start px-8 py-3 text-lg font-medium text-cool-gray-80 outline-none"
                                >
                                  <span>{textContent.products.send}</span>
                                  <span className="pointer-events-none ml-2 flex flex-row items-center whitespace-nowrap rounded-full bg-orange bg-opacity-15 px-2 text-supporting-2 font-medium uppercase text-orange">
                                    {textContent.products.new}
                                  </span>
                                </a>
                              </Disclosure.Panel>
                            </Transition>
                          </div>
                        </div>
                      )}
                    </Disclosure>

                    <a
                      href={`${INTERNXT_URL}/privacy`}
                      tabIndex={0}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        setMenuState(false);
                      }}
                      className={`flex w-full translate-y-0 cursor-pointer px-8 py-3 outline-none transition delay-200 duration-300 ${
                        menuState ? "opacity-100" : "-translate-y-4 opacity-0"
                      }`}
                    >
                      {textContent.links.privacy}
                    </a>

                    <a
                      href={`${INTERNXT_URL}/about`}
                      tabIndex={0}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        setMenuState(false);
                      }}
                      className={`delay-250 flex w-full translate-y-0 cursor-pointer px-8 py-3 outline-none transition duration-300 ${
                        menuState ? "opacity-100" : "-translate-y-4 opacity-0"
                      }`}
                    >
                      {textContent.links.about}
                    </a>

                    <a
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        setMenuState(false);
                      }}
                      tabIndex={0}
                      href="https://drive.internxt.com/login"
                      className={`flex w-full translate-y-0 px-8 py-3 text-primary outline-none transition delay-300 duration-300 ${
                        menuState ? "opacity-100" : "-translate-y-4 opacity-0"
                      }`}
                    >
                      {textContent.links.login}
                    </a>
                  </div>
                </div>
              }
            </div>

            {/* Logo */}

            <a target="_blank" rel="noreferrer" href={"https://internxt.com"}>
              <img
                className="flex h-3 lg:hidden"
                src={logo_dark}
                alt="Internxt's logo"
              />
              <img
                className="hidden h-3 lg:flex"
                src={logo}
                alt="Internxt's logo"
              />
            </a>
          </div>

          {/* Desktop links */}

          <div className="links">
            <div className="hidden space-x-2 lg:inline-flex">
              <a
                href={`${INTERNXT_URL}/pricing`}
                target="_blank"
                rel="noreferrer"
                className={`whitespace-nowrap px-4 py-1.5 text-base font-medium transition duration-150 ease-in-out`}
              >
                {textContent.links.pricing}
              </a>

              <div
                className={`group relative flex cursor-default space-x-1 rounded-lg px-4 py-1.5 pr-2 font-medium transition duration-150 ease-in-out`}
              >
                <span>{textContent.links.products}</span>
                <CaretDown className="h-6 w-6 translate-y-px text-gray-40 transition duration-150 ease-in-out group-hover:text-cool-gray-30" />

                {/* Menu items */}
                <div className="pointer-events-none absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 translate-y-0 border border-black border-opacity-5 bg-transparent bg-white p-1.5 opacity-0 shadow-subtle transition duration-150 ease-in-out group-hover:pointer-events-auto group-hover:translate-y-1 group-hover:opacity-100">
                  <div className="absolute -top-4 left-1/2 h-4 w-4/5 -translate-x-1/2" />

                  <div className="relative grid gap-0 whitespace-nowrap rounded-xl bg-white lg:grid-cols-1 ">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`${INTERNXT_URL}/drive`}
                      className={`flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium text-cool-gray-80 hover:bg-gray-5 `}
                    >
                      {textContent.products.drive}
                    </a>

                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`${INTERNXT_URL}/photos`}
                      className={`flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium text-cool-gray-80 hover:bg-gray-5 `}
                    >
                      {textContent.products.photos}
                    </a>

                    <a
                      href="https://send.internxt.com"
                      target="_blank"
                      rel="noreferrer"
                      className={`flex flex-row items-center justify-start rounded-xl px-4 py-2 text-base font-medium text-cool-gray-80 hover:bg-gray-5`}
                    >
                      <span>{textContent.products.send}</span>
                    </a>
                  </div>
                </div>
              </div>

              <a
                target="_blank"
                rel="noreferrer"
                href={`${INTERNXT_URL}/privacy`}
                className={`whitespace-nowrap px-4 py-1.5 text-base font-medium transition duration-150 ease-in-out`}
              >
                {textContent.links.privacy}
              </a>

              <a
                target="_blank"
                rel="noreferrer"
                href={`${INTERNXT_URL}/about`}
                className={`whitespace-nowrap px-4 py-1.5 text-base font-medium text-white transition duration-150 
                         ease-in-out hover:text-cool-gray-20`}
              >
                {textContent.links.about}
              </a>
            </div>
          </div>

          {/* Login and CTA */}
          <div className="flex flex-1 flex-shrink-0 flex-grow flex-row items-center justify-end">
            <button
              onClick={() => goToLoginURL()}
              className={`mr-2 hidden whitespace-nowrap rounded-lg border px-4 py-1.5 text-sm font-medium transition duration-150 ease-in-out focus:border focus:outline-none md:flex`}
            >
              {textContent.links.login}
            </button>

            <button
              onClick={() => goToSignUpURL()}
              id="get-started-link"
              className={`flex justify-center rounded-lg border border-transparent bg-primary px-4 py-1.5 text-sm font-medium text-white transition-all duration-75 focus:outline-none sm:inline-flex`}
            >
              <p className="whitespace-nowrap">
                {textContent.links.getStarted}
              </p>
            </button>

            {/* <div className="hidden items-center justify-center bg-transparent lg:flex">
              <LanguageBox darkMode={props.darkMode} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
