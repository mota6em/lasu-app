"use client";
import { useEffect, useState } from "react";
import { FaArrowCircleUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY && currentScrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    visible && (
      <FaArrowCircleUp
        className="fixed bottom-5 right-5 transition-all duration-200 cursor-pointer z-50 hover:scale-105"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        size={32}
      />
    )
  );
};

export default ScrollToTop;
