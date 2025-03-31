import React from 'react';

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-[44vh] text-white">
        {/* Main Content Container */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Text Content */}
          <div className="text-center md:text-left">
            {/* Main Heading */}
            <div className="text-5xl font-bold mb-4">
              Buy Me a Chai
            </div>
            {/* Subheading */}
            <p className="text-lg text-gray-300 mb-8">
              Support your favorite creators with a small contribution. Every chai counts! 🍵
            </p>
            {/* Buttons */}
            <div className="flex justify-center md:justify-start gap-7">
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300">
                Support Now
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300">
                Read More
              </button>

            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <img
              className="h-40 rounded-lg shadow-lg" // Smaller image size
              src="chai.gif"
              alt="Chai"
              style={{
                border: '2px solid #ffffff33', // Optional: Add a subtle border
              }}
            />
          </div>
        </div>
      </div>

      <div className="restofui py-12 bg-[#00091d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#ffffff10] p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Easy to Use</h3>
              <p className="text-gray-300">Simple and intuitive interface for seamless support.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-[#ffffff10] p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Secure Payments</h3>
              <p className="text-gray-300">Safe and reliable payment processing.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-[#ffffff10] p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Community Driven</h3>
              <p className="text-gray-300">Join a vibrant community of creators and supporters.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}