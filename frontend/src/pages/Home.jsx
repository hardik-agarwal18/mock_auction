import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fadeIn">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slideIn">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              IPL Mock Auction
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the thrill of IPL auction bidding. Create rooms, build
            your dream team, and compete with friends in real-time mock
            auctions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-2xl hover:shadow-blue-900/50 btn-smooth transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 bg-gray-700/50 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 text-white text-lg font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500 transition-all duration-300 hover-lift shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:rotate-6 transition-transform">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-center">
              Create Rooms
            </h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Set up your own auction room with custom budgets and squad limits.
              Invite friends to join.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-green-500 transition-all duration-300 hover-lift shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:rotate-6 transition-transform">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-center">
              Real-time Bidding
            </h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Experience live auction action with real-time updates and
              competitive bidding.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500 transition-all duration-300 hover-lift shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:rotate-6 transition-transform">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-center">
              Build Your Squad
            </h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Strategically bid on players to build your dream IPL team within
              budget constraints.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 shadow-2xl">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h4 className="text-white font-semibold mb-2">Sign Up</h4>
              <p className="text-gray-400 text-sm">
                Create your free account to get started
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h4 className="text-white font-semibold mb-2">
                Create/Join Room
              </h4>
              <p className="text-gray-400 text-sm">
                Start a new auction or join an existing one
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h4 className="text-white font-semibold mb-2">Add Players</h4>
              <p className="text-gray-400 text-sm">
                Add players to the auction pool
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h4 className="text-white font-semibold mb-2">Start Bidding</h4>
              <p className="text-gray-400 text-sm">
                Compete in real-time to build your team
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 shadow-2xl">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Ready to Start?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Join thousands of cricket fans in the most exciting auction
              experience
            </p>
            <button
              onClick={() => navigate("/register")}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-2xl hover:shadow-blue-900/50 btn-smooth transform hover:scale-105"
            >
              Create Your Account Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
