import React, { useState } from "react";
import Explosion from "./Explosion"; // ←追加

function App() {
  const [sql, setSql] = useState("");
  const [showExplosion, setShowExplosion] = useState(false);

  const handleRun = () => {
    const sqlLower = sql.toLowerCase();
    if (
      sqlLower.includes("select") &&
      sqlLower.includes("age") &&
      sqlLower.includes(">=") &&
      sqlLower.includes("30")
    ) {
      setShowExplosion(true);
      setTimeout(() => setShowExplosion(false), 1000); // 1秒後に非表示
    } else {
      alert("❌ 条件が合っていません");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      {showExplosion && <Explosion />}
      <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
        💣 SQL BLAST GAME
      </h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow space-y-4">
        <p className="text-lg">🎯 問題: 年齢が30歳以上のユーザーを取得せよ！</p>
        <h3>テーブル名：自由設定、年齢のカラム名：age</h3>
        <textarea
          rows={5}
          className="w-full border rounded p-3 font-mono"
          placeholder="例: SELECT * FROM users WHERE age >= 30;"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
        />
        <button
          onClick={handleRun}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          ▶️ 実行する
        </button>
      </div>
    </div>
  );
}

export default App;