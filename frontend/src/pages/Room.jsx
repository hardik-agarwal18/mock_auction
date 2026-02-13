import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../lib/axios";
import Navbar from "../components/Navbar";

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

  const fetchRoomData = async () => {
    try {
      const [roomRes, playersRes] = await Promise.all([
        axios.get(`/rooms/${roomId}`),
        axios.get(`/players/${roomId}`),
      ]);
      setRoom(roomRes.data);
      setPlayers(playersRes.data);
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
    alert("Room ID copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const isHost = room?.hostId === user?.id;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Room Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {room?.name}
              </h2>
              <p className="text-gray-400">
                Status: <span className="text-yellow-400">{room?.status}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Room ID</p>
              <button
                onClick={copyRoomId}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
              >
                <span className="font-mono">{roomId.substring(0, 8)}...</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Purse</p>
              <p className="text-white text-xl font-bold">₹{room?.purse} Cr</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Squad Limit</p>
              <p className="text-white text-xl font-bold">{room?.squadLimit}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Teams</p>
              <p className="text-white text-xl font-bold">
                {room?.teams?.length || 0}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Players</p>
              <p className="text-white text-xl font-bold">{players.length}</p>
            </div>
          </div>
        </div>

        {/* Teams */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Teams</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {room?.teams?.map((team) => (
              <div key={team.id} className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">{team.name}</h4>
                <p className="text-gray-400 text-sm">
                  Budget: ₹{team.budget} Cr
                </p>
                <p className="text-gray-400 text-sm">
                  Owner: {team.user.username}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Players */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Players</h3>
            {isHost && room?.status === "WAITING" && (
              <button
                onClick={() => setShowAddPlayerModal(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Add Player
              </button>
            )}
          </div>

          {players.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No players added yet
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div key={player.id} className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-1">
                    {player.name}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2">{player.role}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Base Price:</span>
                    <span className="text-white font-semibold">
                      ₹{player.basePrice} Cr
                    </span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        player.status === "SOLD"
                          ? "bg-green-900 text-green-200"
                          : player.status === "UNSOLD"
                            ? "bg-red-900 text-red-200"
                            : "bg-gray-600 text-gray-200"
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
          <div className="flex justify-center">
            <button
              onClick={handleStartAuction}
              disabled={players.length === 0}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-lg transition"
            >
              Start Auction
            </button>
          </div>
        )}

        {room?.status === "LIVE" && (
          <div className="flex justify-center">
            <button
              onClick={() => navigate(`/auction/${roomId}`)}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg transition"
            >
              Go to Auction
            </button>
          </div>
        )}
      </div>

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Add Player</h3>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Player Name
                </label>
                <input
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter player name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={playerRole}
                  onChange={(e) => setPlayerRole(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="BATSMAN">Batsman</option>
                  <option value="BOWLER">Bowler</option>
                  <option value="ALL_ROUNDER">All Rounder</option>
                  <option value="WICKET_KEEPER">Wicket Keeper</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base Price (Crores)
                </label>
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlayerModal(false);
                    setError("");
                  }}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
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
