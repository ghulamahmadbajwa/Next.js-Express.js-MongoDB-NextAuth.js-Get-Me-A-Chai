import React from 'react';

export default function Home() {
  return (
    <>
      {/* -------------------------
          Hero Section: Main call-to-action
      ------------------------- */}
      <div className="flex flex-col justify-center items-center min-h-[36.6vh] text-white">
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          {/* -------------------------
              Text Content (Left on desktop)
          ------------------------- */}
          <div className="text-center md:text-left">
            
            {/* Main Heading */}
            <div className="text-5xl font-bold mb-4">
              Help the Needy / ضرورت مندوں کی مدد کریں
            </div>
            
            {/* Subheading */}
            <p className="text-lg text-gray-300 mb-8">
              Your small contribution can change a life.  
              ہر چھوٹی سی مدد کسی کی زندگی بدل سکتی ہے۔
              <br />
              All requests are verified by our team before approval.  
              تمام درخواستیں منظوری سے پہلے ہماری ٹیم کی جانب سے تصدیق شدہ ہوتی ہیں۔
            </p>
            
            {/* Buttons */}
            <div className="flex justify-center md:justify-start gap-7">
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300">
                Donate Now / ابھی عطیہ کریں
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300">
                Learn More / مزید جانیں
              </button>
            </div>
          </div>

          {/* -------------------------
              Hero Image (Right on desktop)
          ------------------------- */}
          <div className="flex justify-center">
            <img
              className="h-40 rounded-lg shadow-lg"
              src="chai.gif"
              alt="Help"
              style={{
                border: '2px solid #ffffff33', // subtle border for aesthetics
              }}
            />
          </div>
        </div>
      </div>

      {/* -------------------------
          Feature Section: "Why Trust Us?"
      ------------------------- */}
      <div className="restofui py-12 bg-[#00091d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why Trust Us? / ہم پر کیوں بھروسہ کریں؟
          </h2>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-[#ffffff10] p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                Verified Cases / تصدیق شدہ کیسز
              </h3>
              <p className="text-gray-300">
                Every request is reviewed and approved by our admin team.  
                ہر درخواست ہماری ٹیم کی جانب سے جانچ اور منظوری کے بعد شائع کی جاتی ہے۔
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#ffffff10] p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                Transparent Donations / شفاف عطیات
              </h3>
              <p className="text-gray-300">
                Your help directly reaches those who truly need it.  
                آپ کا عطیہ براہِ راست ان لوگوں تک پہنچتا ہے جو واقعی ضرورت مند ہیں۔
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#ffffff10] p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                Community of Hope / امید کی کمیونٹی
              </h3>
              <p className="text-gray-300">
                Join hands to support verified needy individuals.  
                آئیے مل کر تصدیق شدہ ضرورت مند افراد کی مدد کریں۔
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
  