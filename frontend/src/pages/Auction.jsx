import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../lib/axios";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";

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
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchRoomData = async () => {
    try {
      const response = await axios.get(`/rooms/${roomId}`);
      setRoom(response.data);
      setTeams(response.data.teams);

      // Find current user's team
      const userTeam = response.data.teams.find(
        (team) => team.userId === user.id,
      );
      setMyTeam(userTeam);

      // Set current player and bid info
      if (response.data.currentPlayerId) {
        const player = response.data.players?.find(
          (p) => p.id === response.data.currentPlayerId,
        );
        setCurrentPlayer(player);
        setCurrentBid(response.data.currentHighestBid || player?.basePrice);
        setHighestBidder(response.data.currentHighestBidder);
      }
    } catch {
      setError("Failed to load auction data");
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
    });

    newSocket.on("playerSold", () => {
      setTimeout(() => {
        fetchRoomData();
      }, 2000);
    });

    newSocket.on("auctionComplete", () => {
      alert("Auction completed!");
      navigate(`/room/${roomId}`);
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Auction Header */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {room?.name} - Live Auction
          </h2>
          <button
            onClick={() => navigate(`/room/${roomId}`)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back to Room
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Auction Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Player */}
            {currentPlayer ? (
              <div className="bg-gray-800 rounded-lg p-8 border-2 border-blue-500">
                <div className="text-center mb-6">
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {currentPlayer.name}
                  </h2>
                  <p className="text-xl text-gray-400">{currentPlayer.role}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Base Price: ₹{currentPlayer.basePrice} Cr
                  </p>
                </div>

                {/* Current Bid */}
                <div className="bg-gray-700 rounded-lg p-6 mb-6">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Current Bid</p>
                    <p className="text-5xl font-bold text-green-400 mb-3">
                      ₹{currentBid} Cr
                    </p>
                    {highestBidder && (
                      <p className="text-lg text-gray-300">
                        Highest Bidder:{" "}
                        <span className="text-yellow-400 font-semibold">
                          {highestBidder}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Timer */}
                {timeRemaining > 0 && (
                  <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center gap-3">
                      <svg
                        className="w-6 h-6 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-2xl font-bold text-white">
                        {timeRemaining}s
                      </span>
                    </div>
                  </div>
                )}

                {/* Bid Buttons */}
                {myTeam && (
                  <div>
                    {error && (
                      <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {suggestedBids.map((bid) => (
                        <button
                          key={bid}
                          onClick={() => handleBid(bid)}
                          className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                        >
                          ₹{bid} Cr
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <input
                        type="number"
                        step="0.1"
                        min={currentBid + 0.1}
                        max={myTeam.budget}
                        placeholder="Custom bid"
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-12 text-center">
                <p className="text-gray-400 text-xl">
                  Waiting for auction to start...
                </p>
              </div>
            )}

            {/* My Team Info */}
            {myTeam && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  My Team: {myTeam.name}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">
                      Remaining Budget
                    </p>
                    <p className="text-white text-2xl font-bold">
                      ₹{myTeam.budget} Cr
                    </p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Players</p>
                    <p className="text-white text-2xl font-bold">
                      {myTeam.teamPlayers?.length || 0} / {room?.squadLimit}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Teams Sidebar */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Teams</h3>
            {teams.map((team) => (
              <div
                key={team.id}
                className={`bg-gray-800 rounded-lg p-4 border-2 ${
                  team.id === myTeam?.id
                    ? "border-green-500"
                    : "border-transparent"
                }`}
              >
                <h4 className="text-white font-semibold mb-2">{team.name}</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-400">
                    Owner:{" "}
                    <span className="text-white">{team.user?.username}</span>
                  </p>
                  <p className="text-gray-400">
                    Budget:{" "}
                    <span className="text-green-400 font-semibold">
                      ₹{team.budget} Cr
                    </span>
                  </p>
                  <p className="text-gray-400">
                    Players:{" "}
                    <span className="text-white">
                      {team.teamPlayers?.length || 0} / {room?.squadLimit}
                    </span>
                  </p>
                </div>

                {team.teamPlayers && team.teamPlayers.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500 mb-2">Squad:</p>
                    <div className="space-y-1">
                      {team.teamPlayers.slice(0, 3).map((tp) => (
                        <p key={tp.id} className="text-xs text-gray-300">
                          {tp.player?.name} - ₹{tp.price} Cr
                        </p>
                      ))}
                      {team.teamPlayers.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{team.teamPlayers.length - 3} more
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
