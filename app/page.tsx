"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "maitry",
          text: input,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply },
      ]);
    } catch (error) {
      console.error("API error:", error);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Ask The Cloud ☁️</h1>

        <div className="h-96 overflow-y-auto border p-4 mb-4 rounded-lg bg-gray-50 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl ${
                msg.role === "user"
                  ? "bg-blue-200 text-blue-900 self-end"
                  : "bg-gray-300 text-gray-900 self-start"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "Cloud"}:</strong>{" "}
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="text-gray-500 italic">Thinking...</div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-grow border p-2 rounded-lg"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white p-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
