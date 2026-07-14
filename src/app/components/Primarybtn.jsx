import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

const Primarybtn = ({ text, href }) => {
  return (
    <Link
      href={href}
      className="flex gap-6 w-86 items-center justify-center text-[24px] text-white font-semibold leading-[1] rounded-full px-16 py-5 border-white border-2"
    >
      {text}
      <HugeiconsIcon
        icon={ArrowLeft02Icon}
        size={26}
        color="currentColor"
        strokeWidth={2}
        className="rotate-180"
      />
    </Link>
  );
};

export default Primarybtn;
