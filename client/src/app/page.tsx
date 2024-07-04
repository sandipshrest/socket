"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import api from "@/api/axios";
const { io } = require("socket.io-client");

export default function Home() {
  const { isLogin, userDetail } = useSelector((state: any) => state.user);
  const [sentMessage, setSentMessage] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [openPopup, setOpenPopup] = useState<null | number>(null);
  const [receiverEmail, setReceiverEmail] = useState<string>("");
  const [existingChat, setExistingChat] = useState<any[]>([]);

  const fetchUserData = async () => {
    try {
      const data = { user_email: userDetail.email } as any;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
        data
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

    newSocket.on("message", (message: string) => {
      setSentMessage(message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (socket && message.trim() !== "") {
          const data = {
            senderEmail: userDetail.email,
            receiverEmail: receiverEmail,
            message: message,
          };
          socket.emit("message", data);
          setMessage(""); // Clear the input field after sending the message
        }
      }
    };

    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [socket, message, userDetail, receiverEmail]);

  const fetchChat = async () => {
    try {
      const data = {
        senderEmail: userDetail.email,
        receiverEmail: receiverEmail,
      };
      const response = await api.post("/chat", data);
      if (response.status === 201) {
        setExistingChat(response.data.existingChat.chats);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [userDetail, receiverEmail]);
  return (
    <div className="container py-12">
      {!isLogin ? (
        <Link href="/login">Login</Link>
      ) : (
        <div>
          {users?.map((item, id) => (
            <>
              <div key={id} className="my-1">
                <button
                  onClick={() => (
                    setOpenPopup(id), setReceiverEmail(item.email)
                  )}
                  className="flex items-center gap-2"
                >
                  <FaRegUserCircle />
                  {item.fullName}
                </button>
              </div>
              {openPopup === id && (
                <div className="fixed w-1/4 p-2 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-end gap-4 bg-gray-50 shadow-md">
                  <button onClick={() => setOpenPopup(null)}>
                    <FaXmark />
                  </button>
                  <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-col items-center gap-2 w-full">
                      <FaRegUserCircle className="text-4xl" />
                      <p>Chat with {item.fullName}</p>
                    </div>
                    <div>
                      {existingChat.length > 0 &&
                        existingChat.map((item, id) => (
                          <div key={id}>
                            <p
                              className={`${
                                item.senderEmail === userDetail.email
                                  ? "text-red-500"
                                  : "text-blue-500"
                              }`}
                            >
                              {item.message}
                            </p>
                          </div>
                        ))}
                    </div>
                    <input
                      type="text"
                      id="message"
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="border border-gray-400 focus:outline-none p-1 w-full"
                    />
                    <p>{sentMessage}</p>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
}
