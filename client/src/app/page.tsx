"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const { io } = require("socket.io-client");

export default function Home() {
  const { isLogin, userDetail } = useSelector((state: any) => state.user);
  const [name, setName] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users`
      );
      if (response.status === 201) {
        setUsers(response.data.userList);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isLogin) {
      fetchUserData();
    }
  }, [isLogin]);

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

  console.log(users);
  return (
    <div className="container">
      {!isLogin ? (
        <Link href="/login">Login</Link>
      ) : (
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
          {users?.map((item, id) => (
            <div key={id}>
              <p>{item.fullName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
