import WelcomePage from "../welcome";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Test1() {
  const navigate = useNavigate();

  // Load username & avatar from localStorage (saved during login)
  const username = localStorage.getItem("username");
  const avatarLabel = localStorage.getItem("avatarLabel");
  const token = localStorage.getItem("token");

  // Redirect if user NOT logged in
  useEffect(() => {
    if (!token) {
      console.warn("⚠️ No token found — redirecting to login...");
      navigate("/");
    }
  }, [token, navigate]);

  const startGame = (level) => {
    console.log("🎮 Start game with level:", level);

    navigate("/test2", { 
      state: { 
        username: username || "Player",
        avatarLabel,
        level 
      } 
    });
  };

  return (
    <WelcomePage 
      username={username || "Player"} 
      avatarLabel={avatarLabel}
      onStart={startGame} 
    />
  );
}
