import React from 'react';
import { FaInstagram, FaWhatsapp, FaFacebook, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">

                {/* Brand Info */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Freelancer Marketplace</h4>
                    <p className="mb-4">
                        Connect with top freelancers and clients for your next project.
                        FlexWork makes it easy to find work or hire talent.
                    </p>
                    <div className="flex items-center gap-2">
                        <a href="https://instagram.com/your_insta" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram size={24} className="text-gray-400 hover:text-white" />
                        </a>
                        <a href="https://wa.me/your_whatsapp_number" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <FaWhatsapp size={24} className="text-gray-400 hover:text-white" />
                        </a>
                        <a href="https://facebook.com/your_facebook_page" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebook size={24} className="text-gray-400 hover:text-white" />
                        </a>
                        <a href="https://twitter.com/your_twitter" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <FaTwitter size={24} className="text-gray-400 hover:text-white" />
                        </a>
                        <a href="mailto:your_email@example.com" aria-label="Email">
                            <FaEnvelope size={24} className="text-gray-400 hover:text-white" />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Quick Links</h4>
                    <ul className="space-y-1">
                        <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
                        <li><a href="/" className="hover:text-white">Home</a></li>
                        <li><a href="/jobs" className="hover:text-white">Find Jobs</a></li>
                        <li><a href="/freelancers" className="hover:text-white">Find Freelancers</a></li>
                        <li><a href="/post-job" className="hover:text-white">Post a Job</a></li>
                        <li><a href="/about" className="hover:text-white">About Us</a></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Categories</h4>
                    <ul className="space-y-1">
                        <li>Web Development</li>
                        <li>Mobile App Development</li>
                        <li>UI/UX Design</li>
                        <li>Content Writing</li>
                        <li>Digital Marketing</li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Contact Us</h4>
                    <p><em>KL University,</em><br /><em>India, Andhrapradesh.</em></p>
                    <p className="mt-2">(+91) 9494333642</p>
                    <p>2300031752@kluniversity.in</p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4 ">
                © 2025 FlexWork. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
