import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiArrowUpRight, FiTwitter } from "react-icons/fi";
import { useAnimate, motion } from "framer-motion";
import useMeasure from "react-use-measure";

const Navbar = () => {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      <GlassNavigation />
    </section>
  );
};

const GlassNavigation = () => {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scope, animate] = useAnimate();
  const navRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseMove = ({ offsetX, offsetY, target }) => {
    const isNavElement = [...target.classList].includes("glass-nav");
    if (isNavElement) {
      setHovered(true);
      const top = offsetY + "px";
      const left = offsetX + "px";
      animate(scope.current, { top, left }, { duration: 0 });
    } else {
      setHovered(false);
    }
  };

  useEffect(() => {
    navRef.current?.addEventListener("mousemove", handleMouseMove);
    return () => navRef.current?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <nav
      ref={navRef}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: hovered ? "none" : "auto",
      }}
      className="glass-nav fixed left-0 right-0 top-0 z-10 mx-auto max-w-6xl overflow-hidden border-[1px] border-white/10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur md:left-6 md:right-6 md:top-6 md:rounded-2xl"
    >
      <div className="glass-nav flex items-center justify-between px-5 py-5">
        <Cursor hovered={hovered} scope={scope} />
        <Links navigate={navigate} />
        <Logo />
        <Buttons setMenuOpen={setMenuOpen} />
      </div>
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} />
    </nav>
  );
};

const Cursor = ({ hovered, scope }) => {
  return (
    <motion.span
      initial={false}
      animate={{
        opacity: hovered ? 1 : 0,
        transform: `scale(${hovered ? 1 : 0}) translateX(-50%) translateY(-50%)`,
      }}
      transition={{ duration: 0.15 }}
      ref={scope}
      className="pointer-events-none absolute z-0 grid h-[50px] w-[50px] origin-[0px_0px] place-content-center rounded-full bg-gradient-to-br from-indigo-600 from-40% to-indigo-400 text-2xl"
    >
      <FiArrowUpRight className="text-white" />
    </motion.span>
  );
};

const Logo = () => (
  <span className="pointer-events-none relative left-0 top-[50%] z-10 text-4xl font-black text-white mix-blend-overlay md:absolute md:left-[50%] md:-translate-x-[50%] md:-translate-y-[50%]">
    FactCheck.
  </span>
);

const Links = ({ navigate }) => (
  <div className="hidden items-center gap-2 md:flex">
    <GlassLink text="Home" onClick={() => navigate("/")} />
    <GlassLink text="Upcoming" onClick={() => navigate("/Upcoming")} />
    <GlassLink text="About" onClick={() => navigate("/About")} />
  </div>
);

const GlassLink = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative scale-100 overflow-hidden rounded-lg px-4 py-2 transition-transform hover:scale-105 active:scale-95"
    >
      <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">
        {text}
      </span>
      <span className="absolute inset-0 z-0 bg-gradient-to-br from-white/20 to-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
};

const TextLink = ({ text, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="text-white/90 transition-colors hover:text-white"
    >
      {text}
    </button>
  );
};

const ExternalLink = ({ href, text }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white/90 transition-colors hover:text-white"
    >
      {text}
    </a>
  );
};

const Buttons = ({ setMenuOpen }) => (
  <div className="flex items-center gap-4">
    <button
      className="relative hidden md:block scale-100 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 from-40% to-indigo-400 px-5 py-3 font-medium text-white transition-transform hover:scale-105 active:scale-95"
    >
      <FiTwitter />
    </button>

    <button
      className="relative hidden md:block scale-100 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 from-40% to-indigo-400 px-4 py-2 font-medium text-white transition-transform hover:scale-105 active:scale-95"
    >
      Buy $Check
    </button>

    <button
      onClick={() => setMenuOpen((prev) => !prev)}
      className="ml-2 block scale-100 text-3xl text-white/90 transition-all hover:scale-105 hover:text-white active:scale-95 md:hidden"
    >
      <FiMenu />
    </button>
  </div>
);

const MobileMenu = ({ menuOpen, setMenuOpen, navigate }) => {
  const [ref, { height }] = useMeasure();

  const navigateAndCloseMenu = (path) => {
    navigate(path); // Navigate to the route
    setMenuOpen(false); // Close the menu
  };

  return (
    <motion.div
      initial={false}
      animate={{
        height: menuOpen ? height : "0px",
      }}
      className="block overflow-hidden md:hidden"
    >
      <div ref={ref} className="flex flex-col items-start gap-4 px-4 pb-4">
        <TextLink text="Home" onClick={() => navigateAndCloseMenu("/")} />
        <TextLink text="Upcoming" onClick={() => navigateAndCloseMenu("/Upcoming")} />
        <TextLink text="About" onClick={() => navigateAndCloseMenu("/About")} />
        <ExternalLink href="#" text="Twitter" />
        <ExternalLink href="#" text="Buy $Check" />
      </div>
    </motion.div>
  );
};

export default Navbar;
