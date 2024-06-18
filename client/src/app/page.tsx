"use client";

import { useEffect, useState } from "react";
const { io } = require("socket.io-client");

export default function Home() {
  const [name, setName] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (socket && name) {
      socket.emit("name", name); // Specify the event name and payload
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300"
        />
        <button>Submit</button>
      </form>
    </div>
  );
}
