import Link from "next/link";
import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaHeart,
  FaShieldAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-12 pb-8">
      <div className=" mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className="w-9 h-9 bg-linear-to-r from-primary-accent to-primary rounded-xl rotate-45 group-hover:rotate-90 transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-md"></div>
                </div>
                <span className="text-md font-bold bg-linear-to-r from-primary-accent to-primary bg-clip-text text-transparent">
                  Havenly Listing
                </span>
              </Link>
            </div>

            <p className="text-gray-800">
              Find your dream property with our extensive listings and expert
              agents. Your perfect home is just a click away.
            </p>
            <div className="flex space-x-4 pt-4">
              <a
                href="#"
                className="hover:text-primary-accent transition-colors"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="hover:text-primary-accent transition-colors"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-pink-400 transition-colors">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors">
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-700">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/properties"
                  className="text-gray-800 hover:text-primary-accent  hover:pl-2 transition-all duration-300"
                >
                  Browse Properties
                </a>
              </li>
              <li>
                <a
                  href="/sell"
                  className="text-gray-800 hover:text-primary-accent  hover:pl-2 transition-all duration-300"
                >
                  Sell Property
                </a>
              </li>
              <li>
                <a
                  href="/agents"
                  className="text-gray-800 hover:text-primary-accent  hover:pl-2 transition-all duration-300"
                >
                  Find Agents
                </a>
              </li>
              <li>
                <a
                  href="/mortgage"
                  className="text-gray-800 hover:text-primary-accent  hover:pl-2 transition-all duration-300"
                >
                  Mortgage Calculator
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-gray-800 hover:text-primary-accent  hover:pl-2 transition-all duration-300"
                >
                  Blog & Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-700">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="h-5 w-5 text-primary-accent mt-1" />
                <span className="text-gray-800">
                  123 Property Street
                  <br />
                  Real Estate City, 10001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="h-5 w-5 text-primary-accent" />
                <span className="text-gray-800">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="h-5 w-5 text-primary-accent" />
                <span className="text-gray-800">info@propertyfinder.com</span>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            {/* <div className="mt-8">
              <h4 className="text-lg font-medium mb-3">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Trust Badges */}
        {/* <div className="border-t border-b border-gray-800 py-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-4">
              <FaShieldAlt className="h-10 w-10 text-green-400" />
              <div>
                <h4 className="font-semibold">Verified Listings</h4>
                <p className="text-sm text-gray-400">
                  All properties are thoroughly vetted
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FaHeart className="h-10 w-10 text-red-400" />
              <div>
                <h4 className="font-semibold">Customer Satisfaction</h4>
                <p className="text-sm text-gray-400">98% positive reviews</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FaHome className="h-10 w-10 text-yellow-400" />
              <div>
                <h4 className="font-semibold">5000+ Properties</h4>
                <p className="text-sm text-gray-400">
                  Wide selection available
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-800">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} PropertyFinder. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cookie Policy
            </a>
            <a
              href="/sitemap"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
