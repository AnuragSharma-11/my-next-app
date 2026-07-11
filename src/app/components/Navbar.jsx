import Link from "next/link";
import React from "react";
import Image from "next/image";
import Button from "./Button";

const Navbar = () => {
  return (
    <header className="absolute w-full h-fit z-50">
      <nav className="flex justify-between gap-10 items-center bg-transparent px-120 py-8">
        <Link href="/">
          <Image
            src="/logo/Aashita-Logo.png"
            alt="Brand Logo"
            width={104}
            height={40}
            className="w-[150px] h-auto"
          />
        </Link> 

        <ul className="flex justify-center gap-10 text-[22px] font-Medium text-white font-raleway">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li>
            <Link href="/career">Career</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <div className="w-1 h-6 bg-fill-#2DFBD9"></div>
        </ul>
        <Button />
      </nav>
    </header>
  );
};

export default Navbar;
