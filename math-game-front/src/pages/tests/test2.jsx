import GamePage from "../game";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Test2() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve values passed from Test1
  const { 
    username = "Player", 
    avatarLabel = "male", 
    level = "easy" 
  } = location.state || {};

  // If user enters Test2 without passing state → redirect to Test1
  useEffect(() => {
    if (!location.state) {
      console.warn("⚠️ No state received — redirecting to main page...");
      navigate("/test1");
    }
  }, [location.state, navigate]);

  const finishGame = (score) => {
    console.log("🏁 Game finished! Score:", score);
    console.log("Player:", username, "Avatar:", avatarLabel);

    // You can redirect to results page or leaderboard later
  };

  return (
    <GamePage 
      username={username}
      avatarLabel={avatarLabel}
      level={level}
      onFinish={finishGame}
    />
  );
}
