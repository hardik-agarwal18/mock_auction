import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import axios from "../lib/axios";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { Copy, Users, Wallet, Trophy, User } from "lucide-react";

const Room = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerRole, setPlayerRole] = useState("BATSMAN");
  const [basePrice, setBasePrice] = useState(0.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchRoomData = async () => {
    try {
      const [roomRes, playersRes] = await Promise.all([
        axios.get(`/rooms/${roomId}`),
        axios.get(`/players/${roomId}`),
      ]);
      setRoom(roomRes.data.room);
      setPlayers(playersRes.data.players);
    } catch {
      setError("Failed to load room data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(`/players/${roomId}`, {
        name: playerName,
        role: playerRole,
        basePrice: Number(basePrice),
      });
      setShowAddPlayerModal(false);
      setPlayerName("");
      setPlayerRole("BATSMAN");
      setBasePrice(0.5);
      fetchRoomData();
    } catch (err) {
      setError(err.message || "Failed to add player");
    }
  };

  const handleStartAuction = async () => {
    try {
      await axios.patch(`/rooms/${roomId}/start`);
      navigate(`/auction/${roomId}`);
    } catch (err) {
      setError(err.message || "Failed to start auction");
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <LoadingSpinner text="Loading room data..." />
      </div>
    );
  }

  const isHost = room?.hostId === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Room Info */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 glass-effect rounded-2xl p-8 mb-6 border border-gray-700/50 hover-lift animate-fadeIn">
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
            <div className="flex-1">
              <h2 className="text-4xl font-bold gradient-text mb-3 animate-slideIn">
                {room?.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    room?.status === "LIVE"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : room?.status === "COMPLETED"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {room?.status}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="text-sm text-gray-400">Room ID</p>
              <button
                onClick={copyRoomId}
                className="group px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all btn-smooth hover-lift flex items-center gap-3 shadow-lg"
              >
                <span className="font-mono font-semibold">
                  {roomId.substring(0, 8)}...
                </span>
                <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-5 hover-lift animate-slideUp">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-blue-400" />
                <p className="text-gray-400 text-sm">Purse</p>
              </div>
              <p className="text-white text-2xl font-bold">₹{room?.purse} Cr</p>
            </div>
            <div
              className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-5 hover-lift animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <p className="text-gray-400 text-sm">Squad Limit</p>
              </div>
              <p className="text-white text-2xl font-bold">
                {room?.squadLimit}
              </p>
            </div>
            <div
              className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/30 rounded-xl p-5 hover-lift animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-pink-400" />
                <p className="text-gray-400 text-sm">Teams</p>
              </div>
              <p className="text-white text-2xl font-bold">
                {room?.teams?.length || 0}
              </p>
            </div>
            <div
              className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-5 hover-lift animate-slideUp"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-green-400" />
                <p className="text-gray-400 text-sm">Players</p>
              </div>
              <p className="text-white text-2xl font-bold">{players.length}</p>
            </div>
          </div>
        </div>

        {/* Teams */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 glass-effect rounded-2xl p-8 mb-6 border border-gray-700/50 hover-lift animate-fadeIn">
          <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-3">
            <Users className="w-6 h-6" />
            Teams Participating
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {room?.teams?.map((team, index) => (
              <div
                key={team.id}
                className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/50 rounded-xl p-5 hover-lift card-hover animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  {team.name}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Budget:</span>
                    <span className="text-green-400 font-semibold">
                      ₹{team.budget} Cr
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Owner:</span>
                    <span className="text-white font-medium">
                      {team.user.username}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Players */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 glass-effect rounded-2xl p-8 mb-6 border border-gray-700/50 hover-lift animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold gradient-text flex items-center gap-3">
              <User className="w-6 h-6" />
              Player Pool
            </h3>
            {isHost && room?.status === "WAITING" && (
              <button
                onClick={() => setShowAddPlayerModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all btn-smooth hover-lift shadow-lg"
              >
                + Add Player
              </button>
            )}
          </div>

          {players.length === 0 ? (
            <div className="text-center py-16">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No players added yet</p>
              {isHost && (
                <p className="text-gray-500 text-sm mt-2">
                  Click "Add Player" to start building your player pool
                </p>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/50 rounded-xl p-5 hover-lift card-hover animate-slideUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <h4 className="text-white font-bold text-lg mb-2">
                    {player.name}
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">{player.role}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-400">Base Price:</span>
                    <span className="text-white font-semibold">
                      ₹{player.basePrice} Cr
                    </span>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        player.status === "SOLD"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : player.status === "UNSOLD"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {player.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {isHost && room?.status === "WAITING" && (
          <div className="flex justify-center animate-slideUp">
            <button
              onClick={handleStartAuction}
              disabled={players.length === 0}
              className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white text-xl font-bold rounded-xl transition-all btn-smooth hover-lift shadow-2xl relative overflow-hidden"
            >
              <span className="relative z-10">🚀 Start Auction</span>
              {players.length > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/20 to-purple-600/0 animate-shimmer"></div>
              )}
            </button>
          </div>
        )}

        {room?.status === "LIVE" && (
          <div className="flex justify-center animate-pulse">
            <button
              onClick={() => navigate(`/auction/${roomId}`)}
              className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xl font-bold rounded-xl transition-all btn-smooth hover-lift shadow-2xl"
            >
              🔴 Go to Live Auction
            </button>
          </div>
        )}
      </div>

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scaleIn">
            <h3 className="text-3xl font-bold gradient-text mb-6 flex items-center gap-3">
              <User className="w-8 h-8" />
              Add New Player
            </h3>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm flex items-start gap-3  backdrop-blur-sm">
                <span className="text-red-400 text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddPlayer} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Player Name
                </label>
                <input
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="e.g. Virat Kohli"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={playerRole}
                  onChange={(e) => setPlayerRole(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="BATSMAN">🏏 Batsman</option>
                  <option value="BOWLER">⚡ Bowler</option>
                  <option value="ALL_ROUNDER">🌟 All Rounder</option>
                  <option value="WICKET_KEEPER">🧤 Wicket Keeper</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Base Price (Crores)
                </label>
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlayerModal(false);
                    setError("");
                  }}
                  className="flex-1 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-white rounded-xl transition-all btn-smooth hover-lift"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all btn-smooth hover-lift shadow-lg"
                >
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
