"use client";

import { useEffect, useState } from "react";
const { io } = require("socket.io-client");

export default function Home() {
  const [name, setName] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("name", (name: string) => {
      setMessage(name);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (socket && name) {
      socket.emit("name", name);
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
      <p>{message}</p>
    </div>
  );
}
