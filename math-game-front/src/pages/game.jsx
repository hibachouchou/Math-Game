import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaTrophy, FaClock, FaStar, FaUndo, FaRedo, FaDoorOpen, FaHome, FaPlus } from "react-icons/fa";

export default function GamePage({ level, username, avatarLabel, onFinish }) {
  const navigate = useNavigate();

  const settings = {
    easy:   { count: 3, score: 10, time: 150, min: 1, max: 999 },
    medium: { count: 4, score: 20, time: 120, min: 1000, max: 9999 },
    hard:   { count: 6, score: 30, time: 90, min: 10000, max: 999999 },
  };

  const { count, score: levelScore, time, min, max } = settings[level];

  const [numbers, setNumbers] = useState([]);
  const [target, setTarget] = useState(null);
  const [expression, setExpression] = useState([]);
  const [result, setResult] = useState(null);
  const [used, setUsed] = useState([]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(time);
  const [score, setScore] = useState(0);

  const avatarSrc = avatarLabel === "female" ? "/female-avatar.png" : "/male-avatar.png";

  // ------------------- Generate random numbers -------------------
  const generateNumbers = () => {
    const nums = Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    setNumbers(nums);
    setUsed(Array(count).fill(false));

    // Générer une cible simple : somme de deux nombres aléatoires
    const randIndices = [Math.floor(Math.random() * nums.length), Math.floor(Math.random() * nums.length)];
    setTarget(nums[randIndices[0]] + nums[randIndices[1]]);
    
    setExpression([]);
    setResult(null);
    setMessage("");
    setTimeLeft(time);
  };

  useEffect(() => { generateNumbers(); }, []);

  // ------------------- Timer -------------------
  useEffect(() => {
    if (timeLeft <= 0) { setMessage("⏰ Time's up!"); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ------------------- Compute Expression -------------------
  const compute = arr => {
    try { return Function("return " + arr.join(" ").replace(/×/g, "*"))(); } 
    catch { return null; }
  };

  const pickNumber = (value, index) => {
    if (used[index] || result === target || timeLeft <= 0) return;
    const newExp = [...expression, value.toString()];
    setExpression(newExp);
    setUsed(used.map((u, i) => (i === index ? true : u)));
    const newResult = compute(newExp);
    setResult(newResult);
    if (newResult === target) {
      setMessage("🎉 You Win!");
      setScore(prev => prev + levelScore);
      onFinish(levelScore);
    }
  };

  const pickOp = (op) => {
    if (result === target || timeLeft <= 0 || expression.length === 0) return;
    const last = expression[expression.length - 1];
    if (["+", "-", "×"].includes(last)) return;
    setExpression([...expression, op]);
  };

  const undo = () => {
    if (!expression.length) return;
    const last = expression[expression.length - 1];
    const numIndex = numbers.findIndex((n, i) => n.toString() === last && used[i] === true);
    if (numIndex !== -1) setUsed(used.map((u, i) => (i === numIndex ? false : u)));
    const newExp = expression.slice(0, -1);
    setExpression(newExp);
    setResult(compute(newExp));
    setMessage("");
  };

  const restart = () => {
    setExpression([]); 
    setUsed(Array(count).fill(false)); 
    setResult(null); 
    setMessage(""); 
    setTimeLeft(time);
  };

  const newPuzzle = () => generateNumbers();
  const goBack = () => navigate("/test1");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("avatarLabel");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-200 p-6 flex flex-col items-center">

      {/* Header */}
      <div className="w-full max-w-xl mb-6 p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          {avatarLabel && <img src={avatarSrc} alt={avatarLabel} className="w-16 h-16 rounded-full border-2 border-white shadow" />}
          <div className="flex flex-col text-gray-800 font-semibold">
            <div><FaUser className="inline mr-1 text-blue-500"/> {username}</div>
            <div><FaTrophy className="inline mr-1 text-purple-600"/> Level: <span className="font-bold">{level.toUpperCase()}</span></div>
            <div><FaStar className="inline mr-1 text-yellow-500"/> Score: {score}</div>
            <div><FaClock className="inline mr-1 text-blue-400"/> Time Left: {timeLeft}s</div>
            <div>🎯 Target: {target}</div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
          <button onClick={goBack} className="bg-yellow-400 text-white px-4 py-2 rounded-xl font-bold hover:bg-yellow-500 flex items-center gap-1"><FaHome/> Back</button>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-600 flex items-center gap-1"><FaDoorOpen/> Logout</button>
        </div>
      </div>

      {/* Expression */}
      <div className="bg-white shadow-xl p-6 rounded-2xl w-full max-w-xl mb-4 text-center">
        <div className="text-gray-500 mb-2">Your Expression</div>
        <div className="text-3xl font-bold min-h-[48px]">{expression.length ? expression.join(" ") : "—"}</div>
        <div className="text-xl mt-3 text-indigo-700">Result: {result !== null ? result : "—"}</div>
        {message && <div className={`font-bold text-xl mt-3 ${result === target ? "text-green-600" : "text-red-600"}`}>{message}</div>}
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-3 gap-4 max-w-xl w-full my-4">
        {numbers.map((num, i) => (
          <button key={i} disabled={used[i] || timeLeft <= 0} onClick={() => pickNumber(num, i)}
            className={`py-4 rounded-xl text-2xl font-bold transition shadow ${used[i] || timeLeft <= 0 ? "bg-gray-300 text-gray-500" : "bg-white hover:bg-gray-200"}`}>
            {num}
          </button>
        ))}
      </div>

      {/* Operations */}
      <div className="flex gap-4 my-4">
        {["+", "-", "×"].map(op => (
          <button key={op} onClick={() => pickOp(op)} disabled={timeLeft <= 0}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-2xl hover:bg-blue-700 disabled:opacity-50">{op}</button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 flex-wrap justify-center">
        <button onClick={undo} className="bg-yellow-400 text-white px-5 py-3 rounded-xl font-bold hover:bg-yellow-500 flex items-center gap-2"><FaUndo/> Undo</button>
        <button onClick={restart} className="bg-gray-400 text-white px-5 py-3 rounded-xl font-bold hover:bg-gray-500 flex items-center gap-2"><FaRedo/> Restart</button>
        <button onClick={newPuzzle} className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-green-700 flex items-center gap-2"><FaPlus/> New Puzzle</button>
      </div>
    </div>
  );
}
