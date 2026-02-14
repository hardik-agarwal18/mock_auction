import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Animation */}
          <div className="relative mb-12 animate-fadeIn">
            <h1 className="text-[200px] font-bold gradient-text leading-none animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 glass-effect rounded-2xl p-10 border border-gray-700/50 mb-8 animate-slideUp">
            <h2 className="text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-400 text-lg mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-gray-500 text-sm">
              It might have been sold in the auction! 🏏
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold rounded-xl transition-all btn-smooth hover-lift flex items-center justify-center gap-3 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all btn-smooth hover-lift flex items-center justify-center gap-3 shadow-lg"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
          </div>

          {/* Fun Cricket-themed message */}
          <div
            className="mt-12 text-gray-500 text-sm animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <p>🏏 "It's a wide! This URL is out of bounds." 🏏</p>
          </div>
        </div>
      </div>
    </div>
  );
}
