import React, { useState, useEffect, useRef } from "react";

export default function RoseDayGame() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const heartRef = useRef(null);
  const audioRef = useRef(null);
  const clickSoundRef = useRef(null);

  // Background animation loop
  useEffect(() => {
    const petals = document.getElementById("petal-layer");
    if (!petals) return;

    const spawnPetal = () => {
      const el = document.createElement("div");
      el.className = "absolute text-pink-300 text-3xl animate-fall opacity-70";
      el.style.left = `${Math.random() * 100}%`;
      el.textContent = "🌸";
      petals.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    };

    const interval = setInterval(spawnPetal, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (audioRef.current) audioRef.current.play();

    if (time <= 0) {
      setGameOver(true);
      if (score >= 10) setWon(true);
      return;
    }

    const interval = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [time, started]);

  const moveHeart = () => {
    if (!heartRef.current) return;
    if (clickSoundRef.current) clickSoundRef.current.play();

    const heart = heartRef.current;
    const x = Math.random() * (window.innerWidth - 80);
    const y = Math.random() * (window.innerHeight - 200);
    heart.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;

    setTimeout(() => {
      heart.style.transform = `translate(${x}px, ${y}px) scale(1)`;
    }, 120);

    setScore(s => s + 1);
  };

  const restart = () => {
    setScore(0);
    setTime(15);
    setGameOver(false);
    setWon(false);
    setStarted(false);
    if (audioRef.current) audioRef.current.pause();
  };

  // Start screen
  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-pink-200 to-pink-50 text-center p-6 relative overflow-hidden">
        <div id="petal-layer" className="absolute inset-0 pointer-events-none"></div>

        <h1 className="text-5xl font-bold text-pink-700 drop-shadow mb-4 animate-bounce">🌹 Rose Day Challenge 🌹</h1>
        <p className="text-lg text-gray-700 mb-6">Catch 10 hearts in 15 seconds!<br/>Unlock a surprise for Reva.</p>

        <button
          className="bg-pink-500 text-white px-8 py-3 rounded-2xl text-xl shadow-lg active:scale-95 transition"
          onClick={() => setStarted(true)}
        >Start</button>

        <audio ref={audioRef} loop volume={0.4}>
          <source src="/bgmusic.mp3" type="audio/mpeg" />
        </audio>
        <audio id="winSound" volume="0.7">
          <source src="/win.mp3" type="audio/mpeg" />
        </audio>
        <audio id="failSound" volume="0.7">
          <source src="/fail.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={clickSoundRef}>
          <source src="/click.mp3" type="audio/mpeg" />
        </audio>
      </div>
    );
  }

  if (gameOver && won) {
    const winS = document.getElementById("winSound");
    if (winS) winS.play();
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-pink-100 text-center p-4 relative overflow-hidden">
        <div id="petal-layer" className="absolute inset-0 pointer-events-none"></div>
        <h1 className="text-5xl font-bold text-pink-600 drop-shadow mb-4 animate-heartBeat">Happy Rose Day, Reva 🌹✨</h1>
        <button className="bg-pink-500 text-white px-6 py-3 rounded-2xl text-xl shadow" onClick={restart}>Play Again</button>
      </div>
    );
  }

  if (gameOver) {
    const failS = document.getElementById("failSound");
    if (failS) failS.play();
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-center p-4 relative overflow-hidden">
        <div id="petal-layer" className="absolute inset-0 pointer-events-none"></div>
        <h1 className="text-3xl font-semibold mb-4">Almost! Score 10 to win 🌹</h1>
        <button className="bg-red-400 text-white px-6 py-3 rounded-2xl text-xl shadow" onClick={restart}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-pink-50 to-pink-100 select-none">
      <div id="petal-layer" className="absolute inset-0 pointer-events-none"></div>

      <div className="absolute top-4 left-4 text-xl font-semibold">Score: {score}</div>
      <div className="absolute top-4 right-4 text-xl font-semibold">Time: {time}</div>

      <div
        ref={heartRef}
        onClick={moveHeart}
        className="absolute text-6xl transition-transform duration-150 drop-shadow-lg animate-float"
        style={{ transform: "translate(100px, 300px)" }}
      >
        ❤️
      </div>
    </div>
  );
}

/* Tailwind custom animations */
/* Add in your globals.css */
/*
@keyframes fall {
  0% { transform: translateY(-10%); }
  100% { transform: translateY(110%); }
}
.animate-fall { animation: fall 5s linear infinite; }

@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float { animation: float 2s ease-in-out infinite; }

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.animate-heartBeat { animation: heartBeat 1.5s ease-in-out infinite; }
*/
