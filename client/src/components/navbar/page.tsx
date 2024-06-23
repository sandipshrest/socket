"use client";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const Navbar: React.FC<NavbarProps> = ({}) => {
  const { isLogin, userDetail } = useSelector((state: any) => state.user);
  return (
    <header className="py-4">
      <div className="container flex justify-between items-center">
        <Link href="/">Home</Link>
        {!isLogin ? <Link href="/login">Login</Link> : userDetail.fullName}
      </div>
    </header>
  );
};

export default Navbar;

interface NavbarProps {}
