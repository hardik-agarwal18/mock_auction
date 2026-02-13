import { User, TrendingUp, Award } from "lucide-react";

const getRoleIcon = (role) => {
  const icons = {
    BATSMAN: "🏏",
    BOWLER: "⚡",
    ALL_ROUNDER: "🌟",
    WICKET_KEEPER: "🧤",
  };
  return icons[role] || "🏏";
};

const getRoleColor = (role) => {
  const colors = {
    BATSMAN: "from-orange-500 to-red-500",
    BOWLER: "from-blue-500 to-purple-500",
    ALL_ROUNDER: "from-green-500 to-teal-500",
    WICKET_KEEPER: "from-pink-500 to-purple-500",
  };
  return colors[role] || "from-blue-500 to-purple-500";
};

const getStatusBadge = (status) => {
  const badges = {
    SOLD: {
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      icon: "✅",
    },
    UNSOLD: {
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      icon: "❌",
    },
    UPCOMING: {
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      icon: "⏳",
    },
    ACTIVE: {
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      icon: "🔴",
    },
  };
  return badges[status] || badges.UPCOMING;
};

export default function PlayerCard({ player, onClick, showPrice = true }) {
  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleColor = getRoleColor(player.role);
  const roleIcon = getRoleIcon(player.role);
  const statusBadge = getStatusBadge(player.status);

  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl overflow-hidden border border-gray-700/50 hover-lift card-hover transition-all duration-300 cursor-pointer"
    >
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${roleColor} opacity-5`}
      ></div>

      {/* Status badge */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.color} backdrop-blur-sm flex items-center gap-1`}
        >
          <span>{statusBadge.icon}</span>
          {player.status}
        </span>
      </div>

      {/* Player image/avatar section */}
      <div
        className={`relative h-48 bg-gradient-to-br ${roleColor} flex items-center justify-center overflow-hidden`}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Player avatar */}
        <div className="relative z-10 w-32 h-32 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
          <User className="w-16 h-16 text-white" strokeWidth={1.5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white drop-shadow-lg">
              {initials}
            </span>
          </div>
        </div>

        {/* Role badge */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
          <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center gap-2">
            <span className="text-xl">{roleIcon}</span>
            <span className="text-white text-sm font-semibold">
              {player.role.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Player details section */}
      <div className="relative p-5 space-y-4">
        {/* Player name */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-1 gradient-text">
            {player.name}
          </h3>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Base Price */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-blue-400" />
              <p className="text-xs text-gray-400">Base Price</p>
            </div>
            <p className="text-lg font-bold text-blue-400">
              ₹{player.basePrice} Cr
            </p>
          </div>

          {/* Sold Price or Status */}
          {player.soldPrice && showPrice ? (
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="w-3 h-3 text-green-400" />
                <p className="text-xs text-gray-400">Sold For</p>
              </div>
              <p className="text-lg font-bold text-green-400">
                ₹{player.soldPrice} Cr
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="w-3 h-3 text-purple-400" />
                <p className="text-xs text-gray-400">Status</p>
              </div>
              <p className="text-sm font-bold text-purple-400">
                {player.status}
              </p>
            </div>
          )}
        </div>

        {/* IPL branding */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-700/50">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="text-xs text-gray-500 font-semibold">
            MOCK IPL AUCTION
          </span>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/0 via-purple-600/0 to-blue-600/0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
    </div>
  );
}
