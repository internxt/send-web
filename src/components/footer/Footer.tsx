import { useState } from 'react';
import { Transition, Disclosure } from '@headlessui/react';
import { CaretDown, CaretRight, CaretUp } from 'phosphor-react';
import moment from 'moment';

import textContent from '../../assets/lang/en/footer.json';
import GDPR from '../../assets/social/gdpr-internxt.svg';
import ISO from '../../assets/social/ISO-27001.webp';
import DownloadQR from '../../assets/social/DownloadQR.webp';
import Reddit from '../../assets/social/reddit.svg';
import Instagram from '../../assets/social/cool-gray-60/instagram.svg';
import LinkedIn from '../../assets/social/cool-gray-60/linkedin.svg';
import Twitter from '../../assets/social/cool-gray-60/twitter.svg';
import YouTube from '../../assets/social/cool-gray-60/youtube.svg';
import Internxt from '../../assets/Internxt.svg';
import iosStore from '../../assets/images/footer/app-store.svg';
import androidStore from '../../assets/images/footer/store-for-android.svg';
import urls from '../../lib/urls';
import { subscribeToNewsletter } from '../../services/klaviyo.service';

const iosURL = 'https://apps.apple.com/es/app/internxt-drive/id1465869889';
const androidURL = 'https://play.google.com/store/apps/details?id=com.internxt.cloud';

export default function Footer() {
  const year = moment().format('YYYY');
  const [isAlternativesOpen, setIsAlternativesOpen] = useState(false);
  const [isVideocallsOpen, setIsVideocallsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await subscribeToNewsletter(email);
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');

      if (error instanceof Error) {
        console.error('[Newsletter] Error:', error.message); // eslint-disable-line no-console
      } else {
        console.error('[Newsletter] Error desconocido:', error); // eslint-disable-line no-console
      }
    }
  };

  return (
    <section id="footer" className="flex w-full flex-col overflow-hidden">
      <div
        className="flex w-full flex-col items-center justify-center pt-10 sm:py-12 lg:px-10 lg:pt-10 xl:px-64 3xl:px-80"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #E5EFFF 100%)' }}
      >
        <div className="flex w-full flex-col gap-6 p-6 lg:flex-row lg:justify-between lg:gap-8 lg:p-0">
          <div className="flex w-full flex-row items-start gap-6 lg:w-1/2 2xl:w-1/3">
            <div className="flex flex-col justify-between gap-9">
              <div className="flex flex-col gap-2">
                <p className="text-lg font-medium">{textContent.DownloadApp.title}</p>
                <p className="max-w-95 text-sm text-gray-80">{textContent.DownloadApp.description}</p>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="flex gap-4">
                  <img
                    src={iosStore}
                    width={148}
                    height={44}
                    className="cursor-pointer"
                    alt="Download on the App Store"
                    onClick={() => window.open(iosURL, '_blank')}
                  />
                  <img
                    src={androidStore}
                    width={148}
                    height={44}
                    className="cursor-pointer"
                    alt="Get it on Google Play"
                    onClick={() => window.open(androidURL, '_blank')}
                  />
                </div>
              </div>
            </div>
            <img
              src={DownloadQR}
              width={125}
              height={125}
              className="cursor-pointer top-0"
              alt="QR code for download Internxt APP"
            />
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-1/3 2xl:w-1/3">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium">{textContent.NewsletterSection.title}</p>
              <p className="text-sm text-gray-80">{textContent.NewsletterSection.description}</p>
            </div>

            <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
              <input
                name="email"
                type="email"
                placeholder={textContent.NewsletterSection.input}
                className="flex-1 rounded-lg border px-4 py-2.5 text-base outline-hidden 
                transition-all border-cool-gray-20 bg-white focus:border-blue-50 focus:ring 
                focus:ring-primary focus:ring-opacity-20"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status) setStatus(null);
                }}
              />
              <button
                type="submit"
                disabled={!email || status === 'loading'}
                className={`rounded-lg px-4 py-2.5 text-base font-medium transition-all ${
                  email && status !== 'loading'
                    ? 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark'
                    : 'bg-primary/10 text-cool-gray-40 cursor-default'
                }`}
              >
                {status === 'loading' ? 'Sending...' : textContent.NewsletterSection.cta}
              </button>
            </form>

            {status === 'success' && <p className="text-sm font-medium text-green-600">Successfully submitted!</p>}
            {status === 'error' && (
              <p className="text-sm font-medium text-red-500">Something went wrong. Please try again.</p>
            )}

            <span className="text-sm text-gray-40">
              {textContent.NewsletterSection.privacy}{' '}
              <a href={urls.legal} target="_blank" rel="noreferrer" className="underline hover:text-gray-30">
                {textContent.NewsletterSection.privacyLink}
              </a>
            </span>
          </div>
        </div>

        <div className="w-full bg-green-120 bg-cool-gray-10 h-px lg:my-10" />

        <footer className="flex w-full items-center justify-center">
          <div className="hidden w-full flex-col items-center justify-center md:space-y-16 lg:flex">
            <div className="flex w-full flex-row justify-between md:justify-between">
              <div className="flex max-w-[30%] flex-1 flex-col items-center lg:flex-none">
                <div className="flex shrink-0 flex-col space-y-3">
                  <p className="text-xs font-semibold text-gray-100">
                    {textContent.FooterSection.sections.products.title}
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-cool-gray-60">
                    <a href={urls.products.drive} className="hover:text-primary">
                      {textContent.FooterSection.sections.products.drive}
                    </a>

                    <a
                      href={urls.products.antivirus}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center hover:text-primary"
                    >
                      {textContent.FooterSection.sections.products.antivirus}
                      <span
                        className="ml-2 h-max items-center justify-center rounded-sm 
                      bg-primary/10 bg-opacity-15 px-1 py-0.5 text-[10px] font-semibold text-primary"
                      >
                        {textContent.FooterSection.new}
                      </span>
                    </a>

                    <a
                      href={urls.products.send}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center hover:text-primary"
                    >
                      {textContent.FooterSection.sections.products.send}
                    </a>

                    <a href={urls.products.vpn} className="flex items-center hover:text-primary">
                      {textContent.FooterSection.sections.products.vpn}
                      <span
                        className="ml-2 h-max items-center justify-center rounded-sm
                       bg-primary/10 bg-opacity-15 px-1 py-0.5 text-[10px] font-semibold text-primary"
                      >
                        {textContent.FooterSection.new}
                      </span>
                    </a>
                    <a href={urls.products.cleaner} className="flex items-center hover:text-primary">
                      {textContent.FooterSection.sections.products.cleaner}
                      <span
                        className="ml-2 h-max items-center justify-center rounded-sm
                       bg-primary/10 bg-opacity-15 px-1 py-0.5 text-[10px] font-semibold text-primary"
                      >
                        {textContent.FooterSection.new}
                      </span>
                    </a>
                    <a href={urls.products.ai} className="flex items-center hover:text-primary">
                      {textContent.FooterSection.sections.products.ai}
                      <span
                        className="ml-2 h-max items-center justify-center rounded-sm
                       bg-primary/10 bg-opacity-15 px-1 py-0.5 text-[10px] font-semibold text-primary"
                      >
                        {textContent.FooterSection.new}
                      </span>
                    </a>
                    <a href={urls.products.meet} className="flex items-center hover:text-primary">
                      {textContent.FooterSection.sections.products.meet}
                      <span
                        className="ml-2 h-max items-center justify-center rounded-sm
                       bg-primary/10 bg-opacity-15 px-1 py-0.5 text-[10px] font-semibold text-primary"
                      >
                        {textContent.FooterSection.new}
                      </span>
                    </a>

                    <a
                      href={urls.products.objectStorage}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-row items-center hover:text-primary"
                    >
                      <div className="flex flex-row">{textContent.FooterSection.sections.products.objStorage}</div>
                    </a>

                    <a href={urls.pricing} className="hover:text-primary">
                      {textContent.FooterSection.sections.products.pricing}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex max-w-[14%] flex-1 flex-col items-center text-gray-100 lg:flex-none">
                <div className="flex shrink-0 flex-col space-y-3">
                  <p className="text-xs font-semibold text-gray-100">
                    {textContent.FooterSection.sections.company.title}
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-cool-gray-60">
                    <a href={urls.company.about} className="hover:text-primary">
                      {textContent.FooterSection.sections.company.about}
                    </a>

                    <a href={urls.company.privacy} className="hover:text-primary">
                      {textContent.FooterSection.sections.company.privacy}
                    </a>

                    <a href={urls.company.security} target="_blank" rel="noreferrer" className="hover:text-primary">
                      {textContent.FooterSection.sections.company.security}
                    </a>

                    <a
                      href={urls.company.openSource}
                      className="flex max-w-[200px] flex-row items-center hover:text-primary"
                    >
                      {textContent.FooterSection.sections.company.openSource}
                    </a>

                    <a href={urls.company.legal} className="hover:text-primary">
                      {textContent.FooterSection.sections.company.legal}
                    </a>

                    <a
                      href={urls.company.sustainability}
                      className="flex max-w-[200px] flex-row items-center hover:text-primary"
                    >
                      {textContent.FooterSection.sections.company.sustainability}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex max-w-[14%] flex-1 flex-col items-center text-gray-100 lg:flex-none">
                <div className="flex shrink-0 flex-col space-y-3">
                  <p className="text-xs font-semibold text-gray-100">{textContent.FooterSection.sections.join.title}</p>
                  <div className="flex flex-col gap-1 text-xs text-cool-gray-60">
                    <a href={urls.join.signup} target="_top" className="hover:text-primary">
                      {textContent.FooterSection.sections.join.signup}
                    </a>
                    <a href={urls.join.login} target="_top" className="hover:text-primary">
                      {textContent.FooterSection.sections.join.login}
                    </a>
                    <a
                      href={urls.support}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer hover:text-primary"
                    >
                      {textContent.FooterSection.sections.join.support}
                    </a>

                    <a
                      href={'/whitepaper/internxt-white-paper.pdf'}
                      target="_blank"
                      rel="noreferrer"
                      download={true}
                      className="hover:text-primary"
                    >
                      {textContent.FooterSection.sections.join.whitePaper}
                    </a>

                    <a href={urls.join.github} target="_blank" rel="noreferrer" className="hover:text-primary">
                      {textContent.FooterSection.sections.join.github}
                    </a>

                    <a href={urls.join.affiliates} target="_blank" className="hover:text-primary">
                      {textContent.FooterSection.sections.join.affiliates}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex max-w-[34%] flex-1 flex-col items-center text-gray-100 lg:flex-none">
                <div className="flex shrink-0 flex-col space-y-3">
                  <p className="text-xs font-semibold text-gray-100">
                    {textContent.FooterSection.sections.resources.title}
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-cool-gray-60">
                    <a href={urls.blog} target="_blank" rel="noreferrer" className="hover:text-primary">
                      {textContent.FooterSection.sections.resources.blog}
                    </a>
                    <a href={urls.resources.storageComparison} className="w-full max-w-40 hover:text-primary">
                      {textContent.FooterSection.sections.resources.comparison}
                    </a>

                    <button
                      onClick={() => setIsAlternativesOpen(!isAlternativesOpen)}
                      className="flex w-full max-w-40 flex-row items-center gap-1 text-left hover:text-primary"
                    >
                      {textContent.FooterSection.sections.resources.cloudStorage}
                      {isAlternativesOpen ? (
                        <CaretDown className="mt-0.5 flex h-2 w-2" />
                      ) : (
                        <CaretRight className="mt-0.5 flex h-2 w-2" />
                      )}
                    </button>

                    <div
                      className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        isAlternativesOpen ? 'max-h-125 opacity-100' : 'invisible max-h-0 opacity-0'
                      }`}
                      style={!isAlternativesOpen ? { display: 'none' } : {}}
                    >
                      <a href={urls.resources.alternatives.pCloud} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.pCloudAlternative}
                      </a>
                      <a href={urls.resources.alternatives.dropbox} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.dropboxAlternative}
                      </a>
                      <a href={urls.resources.alternatives.mega} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.megaAlternative}
                      </a>
                      <a href={urls.resources.alternatives.koofr} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.koofrAlternative}
                      </a>
                      <a
                        href={urls.resources.alternatives.icedrive}
                        className="w-full max-w-40 pl-3 hover:text-primary"
                      >
                        {textContent.FooterSection.sections.resources.icedriveAlternative}
                      </a>
                      <a href={urls.resources.alternatives.pCloud} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.onedriveAlternative}
                      </a>
                      <a
                        href={urls.resources.alternatives.googleDrive}
                        className="w-full max-w-40 pl-3 hover:text-primary"
                      >
                        {textContent.FooterSection.sections.resources.googleDriveAlternative}
                      </a>
                      <a href={urls.resources.alternatives.drime} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.drimeAlternative}
                      </a>
                      <a href={urls.resources.alternatives.degoo} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.degooAlternative}
                      </a>
                      <a
                        href={urls.resources.alternatives.filejump}
                        className="w-full max-w-40 pl-3 hover:text-primary"
                      >
                        {textContent.FooterSection.sections.resources.fileJumpAlternative}
                      </a>
                      <a
                        href={urls.resources.alternatives.elephantdrive}
                        className="w-full max-w-40 pl-3 hover:text-primary"
                      >
                        {textContent.FooterSection.sections.resources.elephantDriveAlternative}
                      </a>
                      <a href={urls.resources.alternatives.sync} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.syncAlternative}
                      </a>
                      <a href={urls.resources.alternatives.filen} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.filenAlternatice}
                      </a>
                      <a href={urls.resources.alternatives.idrive} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.iDriveAlternative}
                      </a>
                      <a href={urls.resources.alternatives.terabox} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.teraboxAlternative}
                      </a>
                      <a href={urls.resources.alternatives.proton} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.protonAlternative}
                      </a>
                    </div>

                    <button
                      onClick={() => setIsVideocallsOpen(!isVideocallsOpen)}
                      className="flex w-full flex-row items-center gap-1 text-left hover:text-primary"
                    >
                      {textContent.FooterSection.sections.resources.videoCalls}
                      {isVideocallsOpen ? (
                        <CaretDown className="mt-0.5 flex h-2 w-2" />
                      ) : (
                        <CaretRight className="mt-0.5 flex h-2 w-2" />
                      )}
                    </button>

                    <div
                      className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        isVideocallsOpen ? 'max-h-125 opacity-100' : 'invisible max-h-0 opacity-0'
                      }`}
                      style={!isVideocallsOpen ? { display: 'none' } : {}}
                    >
                      <a
                        href={urls.resources.videoCalls.googleMeet}
                        className="w-full max-w-40 pl-3 hover:text-primary"
                      >
                        {textContent.FooterSection.sections.resources.googleMeet}
                      </a>
                      <a href={urls.resources.videoCalls.zoom} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.zoom}
                      </a>
                      <a href={urls.resources.videoCalls.teams} className="w-full max-w-40 pl-3 hover:text-primary">
                        {textContent.FooterSection.sections.resources.teams}
                      </a>
                    </div>
                    <a href={urls.resources.whatGoogleKnows} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.resources.whatGoogleKnowsAboutMe}
                    </a>
                    <a href={urls.resources.webdav} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.resources.WebDAV}
                    </a>
                    <a href={urls.resources.nas} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.resources.nas}
                    </a>
                    <a href={urls.resources.coupons} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.resources.coupons}
                    </a>
                    <a href={urls.resources.reviews} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.resources.reviews}
                    </a>
                    <a href={urls.company.certifications} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.resources.certifications}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex max-w-[18%] flex-1 flex-col items-center text-gray-100 lg:flex-none">
                <div className="flex shrink-0 flex-col space-y-3">
                  <p className="text-xs font-semibold text-gray-100">
                    {textContent.FooterSection.sections.tools.title}
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-cool-gray-60">
                    <a href={urls.tools.byteConverter} className="hover:text-primary">
                      {textContent.FooterSection.sections.tools.byteConverter}
                    </a>
                    <a href={urls.tools.tempMail} className="hover:text-primary">
                      {textContent.FooterSection.sections.tools.temporaryEmail}
                    </a>
                    <a href={urls.tools.passwordChecker} className="hover:text-primary">
                      {textContent.FooterSection.sections.tools.passwordChecker}
                    </a>
                    <a href={urls.tools.virusScanner} className="hover:text-primary">
                      {textContent.FooterSection.sections.tools.fileVirusScan}
                    </a>
                    <a href={urls.tools.passwordGenerator} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.tools.passwordGenerator}
                    </a>
                    <a href={urls.tools.fileConverter} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.tools.fileConverter}
                    </a>
                    <a href={urls.tools.darkWebMonitor} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.tools.haveIBeenPwned}
                    </a>
                    <a href={urls.tools.metadataRemover} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.tools.metadataRemover}
                    </a>
                    <a href={urls.tools.aiDetector} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.tools.aiDetector}
                    </a>
                    <a href="/file-compressor" className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.tools.fileCompressor}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex max-w-[14%] flex-1 flex-col items-center text-gray-100 lg:flex-none">
                <div className="flex shrink-0 flex-col space-y-3">
                  <p className="text-xs font-semibold text-gray-100">
                    {textContent.FooterSection.sections.features.title}
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-cool-gray-60">
                    <a href={urls.features.privateCloud} className=" items-center hover:text-primary">
                      {textContent.FooterSection.sections.features.privateCloud}
                    </a>
                    <a href={urls.features.cloudBackup} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.features.cloudBakcup}
                    </a>
                    <a href={urls.features.gdprCloud} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.features.GDPRCloud}
                    </a>
                    <a href={urls.features.cloudPhotos} className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.features.cloudPhotos}
                    </a>
                    <a href="/cloud-storage-for-videos" className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.features.cloudVideo}
                    </a>
                    <a href="/lifetime" className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.features.lifetime}
                    </a>
                    <a href="/drive/free-cloud-storage" className="items-center hover:text-primary">
                      {textContent.FooterSection.sections.features.freeCloudStorage}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-green-120 bg-cool-gray-10 h-px lg:mb-10" />

            <div className="flex w-full flex-row justify-between">
              <div className="flex flex-row gap-10">
                <img src={ISO} alt="ISO 27001" width={60} height={60} className="text-primary" />
                <img src={GDPR} alt="GDPR Internxt" width={146} height={48} />
              </div>

              <div className="flex flex-row items-center space-x-4">
                <a href="https://internxt.com" target="_blank" rel="noreferrer" className="flex shrink-0">
                  <img width={110} height={12} loading="lazy" src={Internxt} alt="Internxt logo" />
                </a>
                <p className="text-sm font-medium text-cool-gray-60">
                  {textContent.FooterSection.copyright.line1 + year + textContent.FooterSection.copyright.line2}
                </p>
              </div>

              <div className="flex flex-row items-center gap-5">
                <a href={urls.social.twitter} target="_blank" rel="noreferrer">
                  <img width={15} height={14} loading="lazy" src={Twitter} draggable="false" alt="twitter icon" />
                </a>
                <a href={urls.social.reddit} target="_blank" rel="noreferrer">
                  <img width={16} height={16} loading="lazy" src={Reddit} draggable="false" alt="Reddit icon" />
                </a>
                <a href={urls.social.linkedin} target="_blank" rel="noreferrer">
                  <img width={16} height={16} loading="lazy" src={LinkedIn} draggable="false" alt="linkedin icon" />
                </a>
                <a href={urls.social.youtube} target="_blank" rel="noreferrer">
                  <img loading="lazy" width={16} height={16} src={YouTube} draggable="false" alt="youtube icon" />
                </a>
                <a href={urls.social.instagram} target="_blank" rel="noreferrer">
                  <img loading="lazy" width={16} height={16} src={Instagram} draggable="false" alt="instagram icon" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-5 bg-opacity-50 flex flex-col overflow-hidden lg:hidden">
            <Disclosure as="div" className="w-screen">
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className="text-gray-100 flex w-full items-center
                   justify-between px-6 py-4 text-lg font-medium"
                  >
                    <span className="flex flex-row">{textContent.FooterSection.sections.products.title}</span>
                    <CaretDown className={`${open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                    <CaretUp className={`${!open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-200 ease-out"
                  >
                    <Disclosure.Panel
                      className={`flex flex-col px-6 font-semibold text-gray-100
                         ${!open ? 'hidden' : 'flex'} bg-gray-1 text-gray-60 space-y-8 p-4`}
                    >
                      <a href={urls.products.drive}>
                        <div className="flex flex-row space-x-2">
                          <p>{textContent.FooterSection.sections.products.drive}</p>
                        </div>
                      </a>
                      <a
                        href={urls.products.objectStorage}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row items-center hover:text-primary"
                      >
                        {textContent.FooterSection.sections.products.objStorage}
                      </a>
                      <a
                        href={urls.products.antivirus}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row items-center hover:text-primary"
                      >
                        <div className="flex flex-row">{textContent.FooterSection.sections.products.antivirus}</div>
                      </a>
                      <a
                        href="https://send.internxt.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row items-center"
                      >
                        <div className="flex flex-row space-x-2">
                          <p>{textContent.FooterSection.sections.products.send}</p>
                        </div>
                      </a>
                      <a href={urls.products.vpn} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.products.vpn}
                      </a>
                      <a href={urls.products.cleaner} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.products.cleaner}
                      </a>
                      <a href={urls.products.meet} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.products.meet}
                      </a>
                      <a href={urls.products.ai} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.products.ai}
                      </a>
                      <a href={urls.products.business} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.products.business}
                      </a>
                      <a href={urls.products.family} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.products.family}
                      </a>
                      <a href={urls.pricing} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.products.pricing}
                      </a>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="w-screen">
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className="text-gray-100 flex w-full items-center
                   justify-between px-6 py-4 text-lg font-medium"
                  >
                    <span className="flex flex-row">{textContent.FooterSection.sections.company.title}</span>
                    <CaretDown className={`${open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                    <CaretUp className={`${!open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-200 ease-out"
                  >
                    <Disclosure.Panel
                      className={`flex flex-col bg-gray-1 px-6 font-semibold
                         ${!open ? 'hidden' : 'flex'} text-gray-60 space-y-8 p-4`}
                    >
                      <a href={urls.company.about}>{textContent.FooterSection.sections.company.about}</a>

                      <a href={urls.company.privacy}>{textContent.FooterSection.sections.company.privacy}</a>

                      <a
                        href={urls.company.security}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row items-center"
                      >
                        <div> {textContent.FooterSection.sections.company.security}</div>
                      </a>

                      <a
                        href={urls.company.openSource}
                        className="flex max-w-[200px] flex-row items-center hover:text-primary"
                      >
                        {textContent.FooterSection.sections.company.openSource}
                      </a>

                      <a href={urls.company.legal}>{textContent.FooterSection.sections.company.legal}</a>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="w-screen">
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className="text-gray-100 flex w-full items-center
                   justify-between px-6 py-4 text-lg font-medium"
                  >
                    <span className="flex flex-row">{textContent.FooterSection.sections.join.title}</span>
                    <CaretDown className={`${open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                    <CaretUp className={`${!open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-200 ease-out"
                  >
                    <Disclosure.Panel
                      className={`flex flex-col bg-gray-1 px-6 font-semibold
                         ${!open ? 'hidden' : 'flex'} text-gray-60 space-y-8 p-4`}
                    >
                      <a href={urls.join.signup} target="_top" className="hover:text-primary">
                        {textContent.FooterSection.sections.join.signup}
                      </a>
                      <a href={urls.join.login} target="_top" className="hover:text-primary">
                        {textContent.FooterSection.sections.join.login}
                      </a>
                      <a
                        href={'https://help.internxt.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer hover:text-primary"
                      >
                        {textContent.FooterSection.sections.join.support}
                      </a>

                      <a
                        href={'/whitepaper/internxt-white-paper.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        download={true}
                        className="hover:text-primary"
                      >
                        {textContent.FooterSection.sections.join.whitePaper}
                      </a>

                      <a href={urls.join.github} target="_blank" rel="noreferrer" className="hover:text-primary">
                        {textContent.FooterSection.sections.join.github}
                      </a>

                      <a href={urls.join.affiliates} target="_blank" className="hover:text-primary">
                        {textContent.FooterSection.sections.join.affiliates}
                      </a>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="w-screen">
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className="text-gray-100 flex w-full items-center
                   justify-between px-6 py-4 text-lg font-medium"
                  >
                    <span className="flex flex-row">{textContent.FooterSection.sections.resources.title}</span>
                    <CaretDown className={`${open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                    <CaretUp className={`${!open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-200 ease-out"
                  >
                    <Disclosure.Panel
                      className={`flex flex-col bg-gray-1 px-6 font-semibold
                         ${!open ? 'hidden' : 'flex'} text-gray-60 space-y-8 p-4`}
                    >
                      <a href={urls.blog} target="_blank" rel="noreferrer" className="hover:text-primary">
                        {textContent.FooterSection.sections.resources.blog}
                      </a>
                      <a href={urls.resources.storageComparison} className="w-full max-w-40 hover:text-primary">
                        {textContent.FooterSection.sections.resources.comparison}
                      </a>

                      <div className="flex flex-col">
                        <button
                          onClick={() => setIsAlternativesOpen(!isAlternativesOpen)}
                          className="flex w-full max-w-40 flex-row items-center gap-1 text-left hover:text-primary"
                        >
                          {textContent.FooterSection.sections.resources.alternatives}
                          {isAlternativesOpen ? (
                            <CaretDown className="mt-0.5 flex h-4 w-4" />
                          ) : (
                            <CaretRight className="mt-0.5 flex h-4 w-4" />
                          )}
                        </button>

                        <div
                          className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                            isAlternativesOpen ? 'mt-8 max-h-250 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="flex flex-col space-y-8 pl-4">
                            <a href={urls.resources.alternatives.pCloud} className="w-full max-w-40 hover:text-primary">
                              {textContent.FooterSection.sections.resources.pCloudAlternative}
                            </a>
                            <a
                              href={urls.resources.alternatives.dropbox}
                              className="w-full max-w-40 hover:text-primary"
                            >
                              {textContent.FooterSection.sections.resources.dropboxAlternative}
                            </a>
                            <a href={urls.resources.alternatives.mega} className="w-full max-w-40 hover:text-primary">
                              {textContent.FooterSection.sections.resources.megaAlternative}
                            </a>
                            <a
                              href={urls.resources.alternatives.googleDrive}
                              className="w-full max-w-40 hover:text-primary"
                            >
                              {textContent.FooterSection.sections.resources.googleDriveAlternative}
                            </a>
                            <a href={urls.resources.alternatives.koofr} className="w-full max-w-40 hover:text-primary">
                              {textContent.FooterSection.sections.resources.koofrAlternative}
                            </a>
                            <a
                              href={urls.resources.alternatives.icedrive}
                              className="w-full max-w-40 hover:text-primary"
                            >
                              {textContent.FooterSection.sections.resources.icedriveAlternative}
                            </a>
                            <a
                              href={urls.resources.alternatives.onedrive}
                              className="w-full max-w-40 hover:text-primary"
                            >
                              {textContent.FooterSection.sections.resources.onedriveAlternative}
                            </a>
                            <a href={urls.resources.alternatives.drime} className="w-full max-w-40 hover:text-primary">
                              {textContent.FooterSection.sections.resources.drimeAlternative}
                            </a>
                            <a href={urls.resources.alternatives.degoo} className="w-full max-w-40 hover:text-primary">
                              {textContent.FooterSection.sections.resources.degooAlternative}
                            </a>
                            <a
                              href={urls.resources.alternatives.filejump}
                              className="w-full max-w-40 hover:text-primary"
                            >
                              {textContent.FooterSection.sections.resources.fileJumpAlternative}
                            </a>
                            <a
                              href={urls.resources.alternatives.elephantdrive}
                              className="w-full max-w-40 hover:text-primary"
                            >
                              {textContent.FooterSection.sections.resources.elephantDriveAlternative}
                            </a>
                            <a href={urls.resources.alternatives.sync} className="w-full max-w-40 hover:text-primary">
                              {textContent.FooterSection.sections.resources.syncAlternative}
                            </a>
                            <a href={urls.resources.alternatives.filen} className="w-full max-w-40 hover:text-primary">
                              {textContent.FooterSection.sections.resources.filenAlternatice}
                            </a>
                            <a href={urls.resources.alternatives.idrive} className="w-full max-w-40 hover:text-primary">
                              {textContent.FooterSection.sections.resources.iDriveAlternative}
                            </a>
                            <a
                              href={urls.resources.alternatives.terabox}
                              className="w-full max-w-40 hover:text-primary"
                            >
                              {textContent.FooterSection.sections.resources.teraboxAlternative}
                            </a>
                            <a href={urls.resources.alternatives.proton} className="w-full max-w-40 hover:text-primary">
                              {textContent.FooterSection.sections.resources.protonAlternative}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <button
                          onClick={() => setIsVideocallsOpen(!isVideocallsOpen)}
                          className="flex w-full max-w-40 flex-row items-center gap-1 text-left hover:text-primary"
                        >
                          {textContent.FooterSection.sections.resources.videoCalls}
                          {isVideocallsOpen ? (
                            <CaretDown className="mt-0.5 flex h-4 w-4" />
                          ) : (
                            <CaretRight className="mt-0.5 flex h-4 w-4" />
                          )}
                        </button>

                        <div
                          className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                            isVideocallsOpen ? 'mt-8 max-h-250 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="flex flex-col space-y-8 pl-4">
                            <a
                              href={urls.resources.videoCalls.googleMeet}
                              className="w-full max-w-40 hover:text-primary"
                            >
                              {textContent.FooterSection.sections.resources.googleMeet}
                            </a>
                            <a href={urls.resources.videoCalls.zoom} className="w-full max-w-40 hover:text-primary">
                              {textContent.FooterSection.sections.resources.zoom}
                            </a>
                          </div>
                        </div>
                      </div>

                      <a href={urls.resources.whatGoogleKnows} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.resources.whatGoogleKnowsAboutMe}
                      </a>
                      <a href={urls.resources.webdav} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.resources.WebDAV}
                      </a>
                      <a href={urls.resources.nas} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.resources.nas}
                      </a>
                      <a href={urls.resources.coupons} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.resources.coupons}
                      </a>
                      <a href={urls.resources.reviews} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.resources.reviews}
                      </a>
                      <a href={urls.company.certifications} className="items-center hover:text-primary">
                        {textContent.FooterSection.sections.resources.certifications}
                      </a>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="w-screen">
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className="text-gray-100 flex w-full items-center
                   justify-between px-6 py-4 text-lg font-medium"
                  >
                    <span className="flex flex-row">{textContent.FooterSection.sections.tools.title}</span>
                    <CaretDown className={`${open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                    <CaretUp className={`${!open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-200 ease-out"
                  >
                    <Disclosure.Panel
                      className={`flex flex-col bg-gray-1 px-6 font-semibold
                         ${!open ? 'hidden' : 'flex'} text-gray-60 space-y-8 p-4`}
                    >
                      <a href={urls.tools.byteConverter}>{textContent.FooterSection.sections.tools.byteConverter}</a>

                      <a href={urls.tools.tempMail}>{textContent.FooterSection.sections.tools.temporaryEmail}</a>

                      <a href={urls.tools.passwordChecker}>
                        <div>{textContent.FooterSection.sections.tools.passwordChecker}</div>
                      </a>

                      <a href={urls.tools.virusScanner}>{textContent.FooterSection.sections.tools.fileVirusScan}</a>
                      <a href={urls.tools.passwordGenerator}>
                        {textContent.FooterSection.sections.tools.passwordGenerator}
                      </a>
                      <a href={urls.tools.fileConverter}>{textContent.FooterSection.sections.tools.fileConverter}</a>
                      <a href={urls.tools.darkWebMonitor}>{textContent.FooterSection.sections.tools.haveIBeenPwned}</a>
                      <a href={urls.tools.metadataRemover}>
                        {textContent.FooterSection.sections.tools.metadataRemover}
                      </a>
                      <a href={urls.tools.aiDetector}>{textContent.FooterSection.sections.tools.aiDetector}</a>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="w-screen">
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className="text-gray-100 flex w-full items-center 
                  justify-between px-6 py-4 text-lg font-medium"
                  >
                    <span className="flex flex-row">{textContent.FooterSection.sections.features.title}</span>
                    <CaretDown className={`${open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                    <CaretUp className={`${!open ? 'hidden' : 'flex'} text-gray-80`} weight="bold" />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-200 ease-out"
                  >
                    <Disclosure.Panel
                      className={`flex flex-col bg-gray-1 px-6 font-semibold 
                        ${!open ? 'hidden' : 'flex'} text-gray-60 space-y-8 p-4`}
                    >
                      <a href={urls.features.privateCloud}>
                        {textContent.FooterSection.sections.features.privateCloud}
                      </a>

                      <a href={urls.features.cloudBackup}>{textContent.FooterSection.sections.features.cloudBakcup}</a>

                      <a href={urls.features.gdprCloud}>{textContent.FooterSection.sections.features.GDPRCloud}</a>

                      <a href={urls.features.cloudPhotos}>{textContent.FooterSection.sections.features.cloudPhotos}</a>

                      <a href={urls.features.cloudVideos}>{textContent.FooterSection.sections.features.cloudVideo}</a>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>

            <div className="flex flex-col items-center space-y-4 py-10 text-gray-100">
              <div className="flex flex-row gap-5">
                <a href={urls.social.twitter} target="_blank" rel="noreferrer">
                  <img width={15} height={14} loading="lazy" src={Twitter} draggable="false" alt="twitter icon" />
                </a>
                <a href={urls.social.reddit} target="_blank" rel="noreferrer">
                  <img width={16} height={16} loading="lazy" src={Reddit} draggable="false" alt="Reddit icon" />
                </a>
                <a href={urls.social.linkedin} target="_blank" rel="noreferrer">
                  <img width={16} height={16} loading="lazy" src={LinkedIn} draggable="false" alt="linkedin icon" />
                </a>
                <a href={urls.social.youtube} target="_blank" rel="noreferrer">
                  <img loading="lazy" width={16} height={16} src={YouTube} draggable="false" alt="youtube icon" />
                </a>
                <a href={urls.social.instagram} target="_blank" rel="noreferrer">
                  <img loading="lazy" width={16} height={16} src={Instagram} draggable="false" alt="instagram icon" />
                </a>
              </div>

              <p className="text-xs text-cool-gray-60">
                {textContent.FooterSection.copyright.line1 + year + textContent.FooterSection.copyright.line2}
              </p>

              <a href={urls.home} className="flex shrink-0 text-gray-100">
                <img width={96} height={10.5} loading="lazy" src={Internxt} alt="Internxt logo" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
