import Image from 'next/image';
import Header from '../components/Header';
import { BookOpen, Lock, Server, Shield, UserCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <Header />

        {/* Privacy Policy Content */}
        <section className='py-12 md:py-16'>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 md:p-12'>
              <div className='flex items-center mb-8'>
                <Lock className='h-8 w-8 text-purple-600 dark:text-purple-400 mr-4' />
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                  Privacy Policy
                </h1>
              </div>

              <div className='text-sm text-gray-600 dark:text-gray-400 mb-8'>
                Last Updated: March 17, 2025
              </div>

              {/* Introduction */}
              <div className='mb-10'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Introduction
                </h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>
                  Welcome to Learnoted ("we," "our," or "us"). We are committed
                  to protecting your privacy and handling your data with
                  transparency and care. This Privacy Policy explains how we
                  collect, use, and safeguard your information when you use our
                  Chrome extension and related website services at
                  learnoted.com.
                </p>
              </div>

              {/* Information We Collect */}
              <div className='mb-10'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center'>
                  <UserCheck className='h-6 w-6 text-purple-600 dark:text-purple-400 mr-2' />
                  Information We Collect
                </h2>

                <div className='mb-6'>
                  <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3'>
                    Authentication Information
                  </h3>
                  <ul className='list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2'>
                    <li>
                      We collect and store authentication tokens to keep you
                      logged into our service
                    </li>
                    <li>
                      Your email address is stored to identify your account
                    </li>
                    <li>
                      We do not store your passwords directly; authentication is
                      handled securely through our service
                    </li>
                  </ul>
                </div>

                <div className='mb-6'>
                  <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3'>
                    Personal Communications
                  </h3>
                  <ul className='list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2'>
                    <li>Text that you highlight on websites</li>
                    <li>Comments you add to YouTube timestamps</li>
                    <li>Notes associated with your saved content</li>
                  </ul>
                </div>

                <div className='mb-6'>
                  <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3'>
                    Website Content
                  </h3>
                  <ul className='list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2'>
                    <li>
                      Portions of text you highlight from websites you visit
                    </li>
                    <li>
                      YouTube video titles, channel names, and timestamps you
                      choose to save
                    </li>
                    <li>
                      Context surrounding highlighted text to ensure proper
                      re-rendering of highlights
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3'>
                    Web History
                  </h3>
                  <ul className='list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2'>
                    <li>
                      URLs of pages where you create highlights or save
                      timestamps
                    </li>
                    <li>
                      We do not track your general browsing history or pages
                      where you don't use our extension features
                    </li>
                  </ul>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div className='mb-10'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center'>
                  <BookOpen className='h-6 w-6 text-purple-600 dark:text-purple-400 mr-2' />
                  How We Use Your Information
                </h2>
                <p className='text-gray-700 dark:text-gray-300 mb-3'>
                  We use the collected information for the following purposes:
                </p>
                <ul className='list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2'>
                  <li>
                    To provide our core extension functionality (highlighting,
                    vocabulary lookups, and YouTube timestamp saving)
                  </li>
                  <li>To sync your saved content across devices</li>
                  <li>To authenticate your account</li>
                  <li>To maintain and improve our services</li>
                  <li>
                    To track your remaining searches based on your plan type
                  </li>
                </ul>
              </div>

              {/* Data Storage and Security */}
              <div className='mb-10'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center'>
                  <Server className='h-6 w-6 text-purple-600 dark:text-purple-400 mr-2' />
                  Data Storage and Security
                </h2>
                <ul className='list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2'>
                  <li>
                    All your data is stored in our secure MongoDB database
                  </li>
                  <li>
                    We use industry-standard security measures to protect your
                    information
                  </li>
                  <li>
                    Authentication is handled through NextAuth to ensure secure
                    login processes
                  </li>
                  <li>
                    Your data is only accessible to you when logged into your
                    account
                  </li>
                </ul>
              </div>

              {/* Data Sharing */}
              <div className='mb-10'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Data Sharing
                </h2>
                <p className='text-gray-700 dark:text-gray-300'>
                  We do not sell, trade, or otherwise transfer your information
                  to third parties. Your data is only used to provide you with
                  our services and is not shared with external organizations.
                </p>
              </div>

              {/* Your Rights */}
              <div className='mb-10'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center'>
                  <Shield className='h-6 w-6 text-purple-600 dark:text-purple-400 mr-2' />
                  Your Rights
                </h2>
                <p className='text-gray-700 dark:text-gray-300 mb-3'>
                  You have the right to:
                </p>
                <ul className='list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2'>
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className='text-gray-700 dark:text-gray-300 mt-3'>
                  To exercise these rights, please contact us at
                  privacy@learnoted.com.
                </p>
              </div>

              {/* Extension Permissions */}
              <div className='mb-10'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Extension Permissions
                </h2>
                <p className='text-gray-700 dark:text-gray-300 mb-3'>
                  Our Chrome extension requires certain permissions to function
                  properly:
                </p>
                <div className='space-y-3 text-gray-700 dark:text-gray-300'>
                  <div>
                    <span className='font-semibold'>Storage Permission:</span>{' '}
                    To store authentication tokens, user preferences, and cached
                    content locally
                  </div>
                  <div>
                    <span className='font-semibold'>ActiveTab Permission:</span>{' '}
                    To interact with content on your current webpage for
                    highlighting and vocabulary features
                  </div>
                  <div>
                    <span className='font-semibold'>Scripting Permission:</span>{' '}
                    To inject necessary scripts for highlighting functionality
                    and UI elements
                  </div>
                  <div>
                    <span className='font-semibold'>Tabs Permission:</span> To
                    determine when you're on YouTube and manage authentication
                    flows
                  </div>
                  <div>
                    <span className='font-semibold'>Host Permissions:</span> To
                    communicate with our servers and function properly on
                    various websites
                  </div>
                </div>
              </div>

              {/* Cookies and Local Storage */}
              <div className='mb-10'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Cookies and Local Storage
                </h2>
                <p className='text-gray-700 dark:text-gray-300 mb-3'>
                  We use local storage in your browser to:
                </p>
                <ul className='list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2'>
                  <li>Keep you logged in between sessions</li>
                  <li>Store your preferences</li>
                  <li>
                    Cache your highlights and other content for faster loading
                  </li>
                </ul>
              </div>

              {/* Changes to This Privacy Policy */}
              <div className='mb-10'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Changes to This Privacy Policy
                </h2>
                <p className='text-gray-700 dark:text-gray-300'>
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last Updated" date.
                </p>
              </div>

              {/* Contact Us */}
              <div className='mb-10'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Contact Us
                </h2>
                <p className='text-gray-700 dark:text-gray-300 mb-3'>
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <ul className='list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2'>
                  <li>Email: privacy@learnoted.com</li>
                  <li>Website: https://www.learnoted.com/contact</li>
                </ul>
              </div>

              {/* User Consent */}
              <div className='pb-4'>
                <div className='bg-purple-100 dark:bg-purple-900/20 rounded-lg p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                    User Consent
                  </h2>
                  <p className='text-gray-700 dark:text-gray-300'>
                    By using our extension and services, you consent to our
                    Privacy Policy and agree to its terms. If you do not agree
                    with this policy, please do not use our extension or
                    services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='py-8 border-t border-gray-200 dark:border-gray-800'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center gap-2 mb-4 md:mb-0'>
              <Image
                src='/learnoted-logo-white.svg'
                alt='LearNoted Logo'
                width={40}
                height={40}
                className='rounded-full'
              />
              <span className='text-lg font-semibold text-gray-800 dark:text-white'>
                LearNoted
              </span>
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              © {currentYear} LearNoted. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
