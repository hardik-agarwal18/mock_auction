import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import axios from "../lib/axios";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Trophy,
  Users,
  Wallet,
  Clock,
  Gavel,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

const Auction = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [teams, setTeams] = useState([]);
  const [currentBid, setCurrentBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [myTeam, setMyTeam] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchRoomData = async () => {
    try {
      const response = await axios.get(`/rooms/${roomId}`);
      const roomData = response.data.room;
      setRoom(roomData);
      setTeams(roomData.teams);

      // Find current user's team
      const userTeam = roomData.teams.find(
        (team) => team.userId === user.id,
      );
      setMyTeam(userTeam);

      // Set current player and bid info
      if (roomData.currentPlayerId) {
        const player = roomData.players?.find(
          (p) => p.id === roomData.currentPlayerId,
        );
        setCurrentPlayer(player);
        setCurrentBid(roomData.currentHighestBid || player?.basePrice);
        setHighestBidder(roomData.currentHighestBidder);
      }
    } catch {
      setError("Failed to load auction data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:3000",
    );

    // Join the room
    newSocket.emit("joinRoom", roomId);

    // Listen for auction updates
    newSocket.on("auctionUpdate", (data) => {
      if (data.currentPlayer) setCurrentPlayer(data.currentPlayer);
      if (data.currentBid !== undefined) setCurrentBid(data.currentBid);
      if (data.highestBidder) setHighestBidder(data.highestBidder);
      if (data.timeRemaining !== undefined)
        setTimeRemaining(data.timeRemaining);
      if (data.teams) setTeams(data.teams);
    });

    newSocket.on("bidPlaced", (data) => {
      setCurrentBid(data.amount);
      setHighestBidder(data.teamName);
      setTimeRemaining(30);
      toast.success(`New bid: ₹${data.amount} Cr by ${data.teamName}`);
    });

    newSocket.on("playerSold", (data) => {
      toast.success(
        `${currentPlayer?.name} sold to ${data.teamName} for ₹${data.price} Cr!`,
      );
      setTimeout(() => {
        fetchRoomData();
      }, 2000);
    });

    newSocket.on("auctionComplete", () => {
      toast.info("Auction completed!");
      setTimeout(() => {
        navigate(`/room/${roomId}`);
      }, 2000);
    });

    fetchRoomData();

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const handleBid = async (amount) => {
    if (!myTeam) {
      setError("You need to be part of a team to bid");
      return;
    }

    if (amount > myTeam.budget) {
      setError("Insufficient budget");
      return;
    }

    try {
      await axios.post(`/auction/${roomId}/bid`, {
        playerId: currentPlayer.id,
        teamId: myTeam.id,
        amount,
      });
      setError("");
    } catch (err) {
      setError(err?.message || "Failed to place bid");
    }
  };

  const suggestedBids = currentPlayer
    ? [currentBid + 0.5, currentBid + 1, currentBid + 2, currentBid + 5].filter(
        (bid) => myTeam && bid <= myTeam.budget,
      )
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <LoadingSpinner text="Loading auction..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Auction Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 glass-effect rounded-2xl p-6 mb-6 border border-gray-700/50animate-fadeIn">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-3xl font-bold gradient-text">
                {room?.name} - Live Auction
              </h2>
            </div>
            <button
              onClick={() => navigate(`/room/${roomId}`)}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-xl transition-all btn-smooth hover-lift flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Room
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Auction Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Player */}
            {currentPlayer ? (
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 glass-effect rounded-2xl p-8 border-2 border-blue-500/50 shadow-2xl animate-scaleIn">
                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-4">
                    <p className="text-sm text-blue-300 font-semibold">
                      NOW ON SALE
                    </p>
                  </div>
                  <h2 className="text-5xl font-bold gradient-text mb-3 animate-slideIn">
                    {currentPlayer.name}
                  </h2>
                  <p className="text-2xl text-gray-300 mb-2">
                    {currentPlayer.role}
                  </p>
                  <p className="text-sm text-gray-400">
                    Base Price:{" "}
                    <span className="text-gray-300 font-semibold">
                      ₹{currentPlayer.basePrice} Cr
                    </span>
                  </p>
                </div>

                {/* Current Bid */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 mb-6 hover-lift">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Gavel className="w-6 h-6 text-green-400" />
                      <p className="text-gray-300 text-lg font-semibold">
                        Current Bid
                      </p>
                    </div>
                    <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 mb-4 animate-pulse">
                      ₹{currentBid} Cr
                    </p>
                    {highestBidder && (
                      <div className="flex items-center justify-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <p className="text-lg text-gray-300">
                          Highest Bidder:{" "}
                          <span className="text-yellow-400 font-bold">
                            {highestBidder}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timer */}
                {timeRemaining > 0 && (
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-5 mb-6 animate-pulse">
                    <div className="flex items-center justify-center gap-4">
                      <Clock className="w-7 h-7 text-yellow-400" />
                      <span className="text-4xl font-bold text-yellow-400">
                        {timeRemaining}s
                      </span>
                    </div>
                  </div>
                )}

                {/* Bid Buttons */}
                {myTeam && (
                  <div>
                    {error && (
                      <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm flex items-start gap-3 backdrop-blur-sm">
                        <span className="text-red-400 text-xl">⚠️</span>
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {suggestedBids.map((bid, index) => (
                        <button
                          key={bid}
                          onClick={() => handleBid(bid)}
                          className="group relative py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all btn-smooth hover-lift shadow-lg overflow-hidden animate-slideUp"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <span className="relative z-10 text-lg">
                            ₹{bid} Cr
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/20 to-purple-600/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity"></div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        step="0.1"
                        min={currentBid + 0.1}
                        max={myTeam.budget}
                        placeholder="Enter custom bid amount"
                        className="flex-1 px-5 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const value = parseFloat(e.target.value);
                            if (value > currentBid) {
                              handleBid(value);
                              e.target.value = "";
                            }
                          }
                        }}
                      />
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 glass-effect rounded-2xl p-16 text-center border border-gray-700/50 animate-fadeIn">
                <Gavel className="w-20 h-20 text-gray-600 mx-auto mb-6 animate-pulse" />
                <p className="text-gray-400 text-2xl font-semibold">
                  Waiting for auction to start...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  The auctioneer will present players shortly
                </p>
              </div>
            )}

            {/* My Team Info */}
            {myTeam && (
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 glass-effect rounded-2xl p-8 border border-gray-700/50 hover-lift animate-fadeIn">
                <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-3">
                  <Trophy className="w-6 h-6" />
                  My Team: {myTeam.name}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-5 hover-lift">
                    <div className="flex items-center gap-3 mb-2">
                      <Wallet className="w-5 h-5 text-green-400" />
                      <p className="text-gray-400 text-sm">Remaining Budget</p>
                    </div>
                    <p className="text-white text-3xl font-bold">
                      ₹{myTeam.budget} Cr
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-5 hover-lift">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <p className="text-gray-400 text-sm">Squad</p>
                    </div>
                    <p className="text-white text-3xl font-bold">
                      {myTeam.teamPlayers?.length || 0} / {room?.squadLimit}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Teams Sidebar */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text flex items-center gap-3">
              <Users className="w-6 h-6" />
              All Teams
            </h3>
            {teams.map((team, index) => (
              <div
                key={team.id}
                className={`bg-gradient-to-br from-gray-800/90 to-gray-900/90 glass-effect rounded-xl p-5 border-2 hover-lift card-hover animate-slideUp ${
                  team.id === myTeam?.id
                    ? "border-green-500/50 shadow-green-500/20 shadow-lg"
                    : "border-gray-700/50"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-bold text-lg flex items-center gap-2">
                    {team.id === myTeam?.id && (
                      <Trophy className="w-5 h-5 text-green-400" />
                    )}
                    {team.name}
                  </h4>
                  {team.id === myTeam?.id && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                      YOU
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Owner:</span>
                    <span className="text-white font-medium">
                      {team.user?.username}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Budget:</span>
                    <span className="text-green-400 font-bold">
                      ₹{team.budget} Cr
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Players:</span>
                    <span className="text-white font-semibold">
                      {team.teamPlayers?.length || 0} / {room?.squadLimit}
                    </span>
                  </div>
                </div>

                {team.teamPlayers && team.teamPlayers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      Squad Players:
                    </p>
                    <div className="space-y-2">
                      {team.teamPlayers.slice(0, 3).map((tp) => (
                        <div
                          key={tp.id}
                          className="flex justify-between items-center text-xs bg-gray-700/30 rounded-lg p-2"
                        >
                          <span className="text-gray-300 font-medium">
                            {tp.player?.name}
                          </span>
                          <span className="text-green-400 font-semibold">
                            ₹{tp.price} Cr
                          </span>
                        </div>
                      ))}
                      {team.teamPlayers.length > 3 && (
                        <p className="text-xs text-gray-500 text-center pt-1">
                          +{team.teamPlayers.length - 3} more players
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
