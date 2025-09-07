import React from 'react';

const WhyChooseUs = () => {
    return (
        <section className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8">Why Choose FreelanceHub?</h2>
                <p className="text-gray-600 mb-12">We connect talented freelancers with clients looking for quality services.</p>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                        <div className="text-3xl mb-4">✔</div>
                        <h3 className="font-semibold text-xl mb-2">Quality Work</h3>
                        <p className="text-gray-600">Find the highest quality services and freelancers for your projects, all vetted for excellence.</p>
                    </div>

                    <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                        <div className="text-3xl mb-4">📈</div>
                        <h3 className="font-semibold text-xl mb-2">Grow Your Business</h3>
                        <p className="text-gray-600">Scale your operations with on-demand talent for any job, project or specialized skill.</p>
                    </div>

                    <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                        <div className="text-3xl mb-4">🔒</div>
                        <h3 className="font-semibold text-xl mb-2">Secure Payments</h3>
                        <p className="text-gray-600">Protected payments system ensures your money is released only when you're satisfied with the work.</p>
                    </div>

                    <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                        <div className="text-3xl mb-4">👩‍💻</div>
                        <h3 className="font-semibold text-xl mb-2">Professional Talent</h3>
                        <p className="text-gray-600">Access a large pool of skilled professionals who deliver high-quality work on time.</p>
                    </div>

                    <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                        <div className="text-3xl mb-4">🕒</div>
                        <h3 className="font-semibold text-xl mb-2">24/7 Support</h3>
                        <p className="text-gray-600">Our support team is available around the clock to help with any issues or questions.</p>
                    </div>

                    <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                        <div className="text-3xl mb-4">🔍</div>
                        <h3 className="font-semibold text-xl mb-2">Easy to Find</h3>
                        <p className="text-gray-600">Advanced search and matching algorithms help you find the perfect match for your project.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;