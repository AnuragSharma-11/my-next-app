import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";

const Primarybtn = () => {
  return (
    <button className="flex gap-6 text-2xl text-white text-semibold leading-[1] rounded-full px-16 py-5 border-white border-2 mt-20">
      How we do it
      <HugeiconsIcon
        icon={ArrowLeft02Icon}
        size={26}
        color="currentColor"
        strokeWidth={1.5}
        className="rotate-180"
      />
    </button>
  );
};

export default Primarybtn;
