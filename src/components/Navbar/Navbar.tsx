import { useEffect, useState } from 'react';
import { Transition, Disclosure } from '@headlessui/react';
import textContent from '../../assets/lang/en/navbar.json';
import { CaretDown, UserCircleMinus } from 'phosphor-react';
import { Squeeze as Hamburger } from 'hamburger-react';
import { goToLoginURL } from '../../lib/auth';
import logo from '../../logo.svg';
import logo_dark from '../../logo_dark.svg';
import urls from '../../lib/urls';

export default function Navbar() {
  const [menuState, setMenuState] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scrolled, setScrolled] = useState(true);

  const handleScroll = () => setScrolled(window.pageYOffset > 0);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
  });

  return (
    <div
      id="navbar"
      className={`fixed z-50
       flex h-20 w-full items-center bg-white text-black transition-all duration-100
      lg:absolute lg:h-16 lg:bg-transparent lg:text-white`}
    >
      <div className="mx-4 w-full lg:mx-10 xl:mx-20">
        <div className="navbar mx-auto flex max-w-screen-xl items-center justify-between">
          {/* Left side of navbar: Logo / Hamburger menu */}
          <div className=" flex w-full grow flex-row items-center justify-start space-x-4 lg:space-x-0">
            <div className="flex lg:hidden">
              <Hamburger label="Show menu" size={24} color={'black'} toggled={menuState} toggle={setMenuState} />

              {/* Mobile hamburger menu background */}
              <div
                className={`pointer-events-none fixed left-0 top-14 flex h-full w-full bg-white transition-all
                  duration-500 ${menuState ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Mobile hamburger menu */}
              {
                <div
                  className={`fixed left-0 top-14 flex w-full flex-col overflow-hidden bg-white text-xl transition-all
                    duration-500 ${menuState ? 'h-screen overflow-y-auto pb-14' : 'h-0'}`}
                >
                  <div className="my-6 font-medium">
                    <a
                      href={urls.pricing}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={0}
                      onClick={() => {
                        setMenuState(false);
                      }}
                      className={`flex w-full translate-y-0 px-8 py-3 outline-hidden transition
                        delay-100 duration-300 ${menuState ? 'opacity-100' : '-translate-y-4 opacity-0'}`}
                    >
                      {textContent.links.pricing}
                    </a>

                    <Disclosure as="div">
                      {({ open }) => (
                        <div
                          className={`translate-y-0 transition delay-150 duration-300 ${
                            menuState ? 'opacity-100' : '-translate-y-4 opacity-0'
                          }`}
                        >
                          <div className={`${open ? 'bg-cool-gray-5' : ''}`}>
                            <Disclosure.Button
                              className={`flex w-full items-center justify-between px-8 py-3 font-medium ${
                                open ? 'bg-cool-gray-10' : ''
                              }`}
                            >
                              <span>{textContent.links.products}</span>
                              <span className="relative h-6 w-6">
                                <UserCircleMinus
                                  className={`absolute left-0 top-0 h-6 w-6 transition duration-300 ${
                                    open ? 'text-cool-gray-60' : '-rotate-180 text-cool-gray-40'
                                  }`}
                                />
                                <UserCircleMinus
                                  className={`absolute left-0 top-0 h-6 w-6 transition duration-300 ${
                                    open ? 'text-cool-gray-60' : '-rotate-90 text-cool-gray-40'
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
                                  href={urls.products.drive}
                                  tabIndex={0}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => {
                                    setMenuState(false);
                                  }}
                                  className="flex w-full justify-start px-8 py-3 text-lg font-medium
                                    text-cool-gray-80 outline-hidden"
                                >
                                  {textContent.products.drive}
                                </a>

                                <a
                                  href={urls.products.antivirus}
                                  tabIndex={0}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => {
                                    setMenuState(false);
                                  }}
                                  className="flex w-full justify-start px-8 py-3 text-lg font-medium
                                    text-cool-gray-80 outline-hidden"
                                >
                                  {textContent.products.antivirus}
                                </a>

                                <a
                                  href={urls.products.vpn}
                                  tabIndex={0}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => {
                                    setMenuState(false);
                                  }}
                                  className="flex w-full justify-start px-8 py-3 text-lg font-medium
                                    text-cool-gray-80 outline-hidden"
                                >
                                  {textContent.products.vpn}
                                </a>

                                <a
                                  href={urls.products.cleaner}
                                  tabIndex={0}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => {
                                    setMenuState(false);
                                  }}
                                  className="flex w-full justify-start px-8 py-3 text-lg font-medium
                                    text-cool-gray-80 outline-hidden"
                                >
                                  {textContent.products.cleaner}
                                </a>

                                <a
                                  href={urls.products.meet}
                                  tabIndex={0}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => {
                                    setMenuState(false);
                                  }}
                                  className="flex w-full justify-start px-8 py-3 text-lg font-medium
                                    text-cool-gray-80 outline-hidden"
                                >
                                  {textContent.products.meet}
                                </a>

                                <a
                                  href={urls.products.ai}
                                  tabIndex={0}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => {
                                    setMenuState(false);
                                  }}
                                  className="flex w-full justify-start px-8 py-3 text-lg font-medium
                                    text-cool-gray-80 outline-hidden"
                                >
                                  {textContent.products.ai}
                                </a>
                              </Disclosure.Panel>
                            </Transition>
                          </div>
                        </div>
                      )}
                    </Disclosure>
                    <a
                      href={urls.products.objectStorage}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={0}
                      onClick={() => {
                        setMenuState(false);
                      }}
                      className={`flex w-full translate-y-0 px-8 py-3 outline-hidden transition
                        delay-100 duration-300 ${menuState ? 'opacity-100' : '-translate-y-4 opacity-0'}`}
                    >
                      {textContent.links.pricing}
                    </a>

                    <Disclosure as="div">
                      {({ open }) => (
                        <div
                          className={`translate-y-0 transition delay-150 duration-300 ${
                            menuState ? 'opacity-100' : '-translate-y-4 opacity-0'
                          }`}
                        >
                          <div className={`${open ? 'bg-cool-gray-5' : ''}`}>
                            <Disclosure.Button
                              className={`flex w-full items-center justify-between px-8 py-3 font-medium ${
                                open ? 'bg-cool-gray-10' : ''
                              }`}
                            >
                              <span>{textContent.links.ourValues}</span>
                              <span className="relative h-6 w-6">
                                <UserCircleMinus
                                  className={`absolute left-0 top-0 h-6 w-6 transition duration-300 ${
                                    open ? 'text-cool-gray-60' : '-rotate-180 text-cool-gray-40'
                                  }`}
                                />
                                <UserCircleMinus
                                  className={`absolute left-0 top-0 h-6 w-6 transition duration-300 ${
                                    open ? 'text-cool-gray-60' : '-rotate-90 text-cool-gray-40'
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
                                  href={urls.company.privacy}
                                  tabIndex={0}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => {
                                    setMenuState(false);
                                  }}
                                  className="flex w-full justify-start px-8 py-3 text-lg font-medium text-cool-gray-80
                                    outline-hidden"
                                >
                                  {textContent.ourValues.privacy}
                                </a>

                                <a
                                  href={urls.company.openSource}
                                  tabIndex={0}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => {
                                    setMenuState(false);
                                  }}
                                  className="flex w-full justify-start px-8 py-3 text-lg font-medium text-cool-gray-80
                                    outline-hidden"
                                >
                                  {textContent.ourValues.openSource}
                                </a>
                              </Disclosure.Panel>
                            </Transition>
                          </div>
                        </div>
                      )}
                    </Disclosure>

                    <a
                      href={urls.company.about}
                      tabIndex={0}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        setMenuState(false);
                      }}
                      className={`delay-250 flex w-full translate-y-0 cursor-pointer px-8 py-3 outline-hidden
                        transition duration-300 ${menuState ? 'opacity-100' : '-translate-y-4 opacity-0'}`}
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
                      href={urls.login}
                      className={`flex w-full translate-y-0 px-8 py-3 text-primary outline-hidden transition delay-300
                        duration-300 ${menuState ? 'opacity-100' : '-translate-y-4 opacity-0'}`}
                    >
                      {textContent.links.login}
                    </a>
                  </div>
                </div>
              }
            </div>

            {/* Desktop links */}
            <div className="flex w-full flex-row items-center gap-10">
              {/* Logo */}
              <div className="flex w-max">
                <a target="_blank" rel="noreferrer" href={urls.home}>
                  <img className="flex h-3 lg:hidden" src={logo_dark} alt="Internxt's logo" />
                  <img className="hidden h-3 lg:flex" src={logo} alt="Internxt's logo" />
                </a>
              </div>

              <div className="hidden w-full flex-row items-center space-x-2 lg:inline-flex">
                <a
                  href={urls.pricing}
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap px-4 py-1.5 text-base font-medium transition duration-150 ease-in-out"
                >
                  {textContent.links.pricing}
                </a>

                <div
                  className="group relative flex cursor-default items-center space-x-1 rounded-lg px-4 py-1.5 pr-2
                  font-medium transition duration-150 ease-in-out"
                >
                  <span>{textContent.links.products}</span>
                  <CaretDown
                    size={16}
                    className="translate-y-px text-white transition duration-150 ease-in-out
                      group-hover:text-cool-gray-30"
                  />

                  {/* Menu items */}
                  <div
                    className="pointer-events-none absolute left-1/2 top-full z-50 w-52 -translate-x-1/2
                    translate-y-0 border border-black  bg-transparent rounded-xl p-1.5
                    opacity-0 shadow-subtle transition duration-150 ease-in-out group-hover:pointer-events-auto
                    group-hover:translate-y-1 group-hover:opacity-100"
                  >
                    <div className="absolute -top-4 left-1/2 h-4 w-4/5 -translate-x-1/2" />

                    <div className="relative grid gap-0 whitespace-nowrap rounded-xl bg-white lg:grid-cols-1 ">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={urls.products.drive}
                        className="flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium
                          text-cool-gray-80 hover:bg-gray-5"
                      >
                        {textContent.products.drive}
                      </a>

                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={urls.products.antivirus}
                        className="flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium
                          text-cool-gray-80 hover:bg-gray-5"
                      >
                        {textContent.products.antivirus}
                      </a>

                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={urls.products.vpn}
                        className="flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium
                          text-cool-gray-80 hover:bg-gray-5"
                      >
                        {textContent.products.vpn}
                      </a>

                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={urls.products.cleaner}
                        className="flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium
                          text-cool-gray-80 hover:bg-gray-5"
                      >
                        {textContent.products.cleaner}
                      </a>

                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={urls.products.meet}
                        className="flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium
                          text-cool-gray-80 hover:bg-gray-5"
                      >
                        {textContent.products.meet}
                      </a>

                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={urls.products.ai}
                        className="flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium
                          text-cool-gray-80 hover:bg-gray-5"
                      >
                        {textContent.products.ai}
                      </a>
                    </div>
                  </div>
                </div>
                <a
                  href={urls.products.objectStorage}
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap px-4 py-1.5 text-base font-medium transition duration-150 ease-in-out"
                >
                  {textContent.products.s3}
                </a>
                <div
                  className="group relative flex cursor-default items-center space-x-1 rounded-lg px-4 py-1.5 pr-2
                  font-medium transition duration-150 ease-in-out"
                >
                  <span>{textContent.links.ourValues}</span>
                  <CaretDown
                    size={16}
                    className="translate-y-px text-white transition duration-150 ease-in-out
                      group-hover:text-cool-gray-30"
                  />

                  {/* Menu items */}
                  <div
                    className="pointer-events-none absolute top-full left-1/2 z-50 w-52 -translate-x-1/2
                    translate-y-0 rounded-xl border border-black bg-white p-1.5 opacity-0 shadow-subtle
                    transition duration-150 ease-in-out group-hover:pointer-events-auto group-hover:translate-y-1
                    group-hover:opacity-100"
                  >
                    <div className="absolute -top-4 left-1/2 h-4 w-4/5 -translate-x-1/2" />

                    <div className="relative grid gap-0 lg:grid-cols-1">
                      <a
                        href={urls.company.privacy}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium
                        text-cool-gray-80 hover:bg-gray-5"
                      >
                        {textContent.ourValues.privacy}
                      </a>

                      <a
                        href={urls.company.openSource}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium
                        text-cool-gray-80 hover:bg-gray-5"
                      >
                        {textContent.ourValues.openSource}
                      </a>

                      <a
                        href={urls.company.openSource}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium
                        text-cool-gray-80 hover:bg-gray-5"
                      >
                        {textContent.ourValues.sustainability}
                      </a>

                      <a
                        href={urls.company.openSource}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row justify-start rounded-xl px-4 py-2 text-base font-medium
                        text-cool-gray-80 hover:bg-gray-5"
                      >
                        {textContent.ourValues.certifications}
                      </a>
                    </div>
                  </div>
                </div>

                <a
                  target="_blank"
                  rel="noreferrer"
                  href={urls.company.about}
                  className={`whitespace-nowrap px-4 py-1.5 text-base font-medium text-white transition duration-150 
                         ease-in-out hover:text-cool-gray-20`}
                >
                  {textContent.links.about}
                </a>
              </div>
            </div>
          </div>

          {/* Login and CTA */}
          <div className="flex flex-1 shrink-0 grow flex-row items-center justify-end">
            <button
              onClick={() => goToLoginURL()}
              className="mr-2 hidden whitespace-nowrap rounded-lg border px-4 py-1.5 text-sm font-medium transition
              duration-150 ease-in-out focus:border focus:outline-hidden md:flex"
            >
              {textContent.links.login}
            </button>

            <a
              href={urls.pricing}
              id="get-started-link"
              className="flex justify-center rounded-lg border border-transparent bg-primary px-4 py-1.5 text-sm
              font-medium text-white transition-all duration-75 focus:outline-hidden sm:inline-flex"
            >
              <p className="whitespace-nowrap">{textContent.links.getStarted}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
