export const metadata = {
  title: "Contact Us - Shroff Publishers",
  description: "Get in touch with Shroff Publishers. Find our address, phone numbers, email, and regional representative contacts.",
};

export default function ContactUsPage() {
  return (
    <div className="min-h-[calc(100dvh-92px)] bg-white">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
          Contact Us
        </h1>

        <div className="grid gap-8">
          {/* Main Office */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Head Office</h2>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="text-base text-slate-800 font-medium">
                B-103, 1st Floor, Railway Commercial Complex<br />
                Sector 3, Sanpada (East), Navi Mumbai - 400 705
              </p>
              <p>Phone: +91 22 4158 4158 / +91 7304487700</p>
              <p>Hours: Mon-Sat 9:00 - 17:00</p>
              <p>Email: <a href="mailto:spd@shroffpublishers.com" className="text-[#06377a] hover:underline">spd@shroffpublishers.com</a></p>
            </div>
          </div>

          {/* Registered Office */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Registered Office</h2>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="text-base text-slate-800 font-medium">
                B-103, 1st Floor, Sanpada Railway Station Complex<br />
                Sanpada (East), Navi Mumbai - 400 705
              </p>
              <p>TEL: (91 22) 4158 4158 / FAX: (91 22) 4158 4141</p>
              <p>Email: <a href="mailto:spd@shroffpublishers.com" className="text-[#06377a] hover:underline">spd@shroffpublishers.com</a></p>
              <p>Web: <a href="https://www.shroffpublishers.com" className="text-[#06377a] hover:underline">www.shroffpublishers.com</a></p>
              <p>For Publication / Author Collaboration: <a href="mailto:spd@shroffpublishers.com" className="text-[#06377a] hover:underline">spd@shroffpublishers.com</a></p>
            </div>
          </div>

          {/* Regional Representatives */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Regional Representatives</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Bangalore</h3>
                <p className="text-sm text-slate-600">Email: <a href="mailto:spd@shroffpublishers.com" className="text-[#06377a] hover:underline">spd@shroffpublishers.com</a></p>
                <p className="text-sm text-slate-600">Mr. N Satish: +91 9448009472</p>
                <p className="text-sm text-slate-600">Mr. Krishnadas: +91 9632548201</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Delhi</h3>
                <p className="text-sm text-slate-600">Email: <a href="mailto:spd@shroffpublishers.com" className="text-[#06377a] hover:underline">spd@shroffpublishers.com</a></p>
                <p className="text-sm text-slate-600">Mr. Neeraj Chauhan: +91 9958843748 / +91 9818365717</p>
                <p className="text-sm text-slate-600">Mr. Sunder Singh Rana: +91 9212726444</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Kolkata</h3>
                <p className="text-sm text-slate-600">Email: <a href="mailto:spd@shroffpublishers.com" className="text-[#06377a] hover:underline">spd@shroffpublishers.com</a></p>
                <p className="text-sm text-slate-600">Mr. Suvadeb Chakraborty: +91 9163483490</p>
                <p className="text-sm text-slate-600">Mr. Pratim Bhattacharya: +91 8910206997</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Chennai</h3>
                <p className="text-sm text-slate-600">Email: <a href="mailto:spd@shroffpublishers.com" className="text-[#06377a] hover:underline">spd@shroffpublishers.com</a></p>
                <p className="text-sm text-slate-600">Mr. Hariharan: +91 9710936664 / +91 7395982037</p>
                <p className="text-sm text-slate-600">Mr. Balaji: +91 9884443657 / +91 7010443744</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Andhra Pradesh, Gujarat, Rajasthan, Telangana</h3>
                <p className="text-sm text-slate-600">Mr. Vishwajeet Sarmalkar: +91 9594683479</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Rest of Maharashtra, Chhattisgarh, Goa</h3>
                <p className="text-sm text-slate-600">Mr. Gurudas Sawant: +91 9892283044</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Pune</h3>
                <p className="text-sm text-slate-600">Mr. Umesh Jagdale: +91 9850446647</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
