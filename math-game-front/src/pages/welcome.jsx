import { useState } from "react";

export default function WelcomePage({ username, avatarLabel, onStart }) {
  const [level, setLevel] = useState("");

  const levels = [
    { id: "easy", label: "Easy", color: "bg-green-500" },
    { id: "medium", label: "Medium", color: "bg-yellow-500" },
    { id: "hard", label: "Hard", color: "bg-red-500" },
  ];

  // Déterminer l'URL de l'avatar
  const avatarSrc = avatarLabel === "female" ? "/female-avatar.png" : "/male-avatar.png";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-10 w-full max-w-md text-center">

        {/* Avatar + Username */}
        <div className="flex flex-col items-center mb-6">
          {avatarLabel && (
            <img
              src={avatarSrc}
              alt={avatarLabel}
              className="w-24 h-24 rounded-full mb-3 object-contain border-4 border-white shadow-lg"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-blue-600">{username}</span>! 🎉
          </h1>
          <p className="text-gray-600 mt-2">Choose your difficulty level to begin.</p>
        </div>

        {/* Level Selection */}
        <div className="space-y-3 mb-8">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setLevel(lvl.id)}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all 
              ${level === lvl.id ? lvl.color : "bg-gray-400 hover:bg-gray-500"}`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStart(level)}
          disabled={!level}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all
          ${level ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Start Game 🚀
        </button>
      </div>
    </div>
  );
}
