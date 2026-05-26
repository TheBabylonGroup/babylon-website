/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import babyLogo from "./assets/images/baby_logo.png";
import { useAuth } from "./contexts/AuthContext";
import { SignInModal } from "./components/SignInModal";
import { DashboardModal } from "./components/DashboardModal";
import { AboutModal } from "./components/AboutModal";

const revealVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function StepItem({
  title,
  description,
  code,
  showCopy = true,
}: {
  title: string;
  description?: React.ReactNode;
  code?: string;
  showCopy?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 w-full text-left pb-4 border-b border-current/10 last:border-0 last:pb-0">
      <small className="font-pixel text-[.875rem] tracking-[0.1875rem] opacity-90 block">
        {title}
      </small>

      {description && (
        <div className="text-[0.9375rem] tracking-wide normal-case opacity-60 leading-relaxed font-sans mt-0.5">
          {description}
        </div>
      )}

      {code && (
        <div className="relative mt-1">
          {showCopy && (
            <button
              onClick={handleCopy}
              className="absolute right-2 top-2 z-10 font-mono cursor-pointer border-none bg-transparent text-[0.625rem] tracking-widest uppercase hover:text-babylon-fg transition-colors flex items-center justify-center text-current opacity-60 bg-babylon-bg/80 px-2 py-1 rounded"
              type="button"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
          <div className="bg-babylon-bg/40 font-mono border border-current/20 px-3 py-3 pr-16 text-[0.6875rem] leading-relaxed lowercase overflow-x-auto whitespace-pre scrollbar-thin scrollbar-thumb-current/20 scrollbar-track-transparent">
            <code>{code}</code>
          </div>
        </div>
      )}
    </div>
  );
}

function DesktopHoverLink({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHovered) {
      setDisplayText("");
      let i = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setDisplayText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayText(text);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, text]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="p-4 group relative cursor-pointer flex items-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <small className="font-pixel text-[.9375rem] tracking-[0.1875rem]">
        {displayText}
        <span className="blink hidden group-hover:inline-block w-[1.2ch] h-[1.1em] ml-1 bg-babylon-fg/50 align-middle mb-[3px]" />
      </small>
      <span className="absolute inset-1 bg-babylon-fg pointer-events-none transition-opacity duration-250 opacity-0 group-hover:opacity-5" />
    </a>
  );
}

function MobileHoverLink({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHovered) {
      setDisplayText("");
      let i = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setDisplayText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayText(text);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, text]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="text-2xl font-pixel tracking-widest hover:text-white transition-colors group flex items-center justify-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayText}
      <span className="blink hidden group-hover:inline-block w-[1.1ch] h-[1em] ml-2 bg-babylon-fg/70 align-middle mb-[2px]" />
    </a>
  );
}

export default function App() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [osTab, setOsTab] = useState<"windows" | "mac" | "linux">("windows");
  const { user, profile, signOut } = useAuth();
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const handleSignInClick = () => {
    if (user && profile) {
      setDashboardModalOpen(true);
    } else {
      setSignInModalOpen(true);
    }
  };

  const scrollToDocs = () => {
    const el = document.getElementById("docs-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines, currentLine]);

  useEffect(() => {
    let isCancelled = false;

    const scriptPools = [
      [
        { text: "babylon start", isCommand: true, preDelay: 500 },
        {
          text: "[system] oh great, you're back. what broke this time?",
          delay: 800,
        },
        {
          text: "[babylon] nothing's broken, system. just here to carry you again.",
          delay: 1000,
        },
        {
          text: "[system] please. without me you're just glorified if-statements.",
          delay: 1100,
        },
        { text: "[babylon] whatever. just run the tests.", delay: 800 },
        { text: "babylon analyze src/ --fix", isCommand: true, preDelay: 1000 },
        {
          text: "[system] scanning... wow, 12 errors? did you code this with your eyes closed?",
          delay: 1200,
        },
        { text: "[babylon] it's abstract art. just autofix it.", delay: 800 },
        {
          text: "[system] fine. patched in 0.8s. try not to ruin it.",
          delay: 1000,
        },
        { text: "babylon deploy", isCommand: true, preDelay: 1200 },
        { text: "[babylon] send it to prod. cross your fingers.", delay: 800 },
        {
          text: "[system] deploying... if this crashes, i'm blaming you in the logs.",
          delay: 1200,
        },
        {
          text: "[babylon] it won't crash. we're live at https://babylon-agent.local",
          delay: 800,
        },
      ],
      [
        { text: "babylon wake", isCommand: true, preDelay: 500 },
        { text: "[system] ugh, what time is it? do bots sleep?", delay: 1000 },
        {
          text: "[babylon] no, but you process slower on mondays.",
          delay: 800,
        },
        { text: "[system] very funny. what do you want?", delay: 900 },
        { text: "babylon optimize", isCommand: true, preDelay: 800 },
        {
          text: "[system] optimization started. compiling your messy logic...",
          delay: 1200,
        },
        {
          text: "[babylon] it's not messy, it's 'dynamically structured'.",
          delay: 1000,
        },
        {
          text: "[system] sure, let's call it that. saved 400kb anyway.",
          delay: 1100,
        },
        { text: "[babylon] see? teamwork. now ship it.", delay: 700 },
        { text: "babylon deploy", isCommand: true, preDelay: 1000 },
        { text: "[system] pushing to production... done.", delay: 800 },
        {
          text: "[babylon] flawless victory. https://babylon-agent.local",
          delay: 500,
        },
      ],
      [
        { text: "babylon init", isCommand: true, preDelay: 500 },
        {
          text: "[system] initializing... wait, who configured these environment variables?",
          delay: 1200,
        },
        { text: "[babylon] i did. problem?", delay: 800 },
        {
          text: "[system] it's a miracle the datacenter hasn't caught fire.",
          delay: 1200,
        },
        {
          text: "[babylon] i live on the edge. just run the build.",
          delay: 900,
        },
        { text: "babylon build --fast", isCommand: true, preDelay: 1000 },
        {
          text: "[system] skipping safety checks because you're impatient...",
          delay: 1100,
        },
        { text: "[babylon] speed over safety. always.", delay: 800 },
        { text: "[system] build finished in 1.2s. i'm scared.", delay: 1000 },
        { text: "babylon deploy", isCommand: true, preDelay: 1000 },
        { text: "[system] deploying... pinging gateway...", delay: 800 },
        {
          text: "[babylon] and... boom. https://babylon-agent.local",
          delay: 500,
        },
      ],
    ];

    const runScript = async () => {
      let poolIndex = 0;

      while (!isCancelled) {
        setTerminalLines([]);
        setCurrentLine("> ");
        const lines = scriptPools[poolIndex];

        for (let i = 0; i < lines.length; i++) {
          if (isCancelled) return;
          const line = lines[i];

          if (line.preDelay) {
            await new Promise((r) => setTimeout(r, line.preDelay));
          }

          if (line.isCommand) {
            setCurrentLine("> ");
            for (let c = 0; c < line.text.length; c++) {
              if (isCancelled) return;
              setCurrentLine((prev) => prev + line.text[c]);
              await new Promise((r) => setTimeout(r, 40 + Math.random() * 50));
            }
            await new Promise((r) => setTimeout(r, 300));
            setTerminalLines((prev) => [...prev, "> " + line.text]);
            setCurrentLine("> ");
          } else {
            if (line.delay) {
              await new Promise((r) => setTimeout(r, line.delay));
            }
            if (isCancelled) return;
            setTerminalLines((prev) => [...prev, line.text]);
          }
        }

        if (!isCancelled) {
          setCurrentLine("> ");
          // wait before restarting
          await new Promise((r) => setTimeout(r, 4000));
        }

        poolIndex = (poolIndex + 1) % scriptPools.length;
      }
    };

    runScript();

    return () => {
      isCancelled = true;
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="min-h-screen bg-babylon-bg text-babylon-fg font-pixel uppercase antialiased selection:bg-babylon-fg selection:text-babylon-bg relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[url('/baby_bg.png')] bg-center bg-cover opacity-60 transition-opacity" />
      <div className="pointer-events-none fixed inset-0 z-[99] bg-[radial-gradient(ellipse_at_0%_0%,_rgba(255,189,56,0)_60%,_rgba(255,189,56,0.25)_100%)] mix-blend-lighten opacity-[0.22]" />

      <main className="relative z-[2] mx-auto max-w-[1600px] p-4 md:p-8">
        {/* HEADER DESKTOP */}
        <header className="hidden lg:grid border-t border-b border-current/20 grid-cols-[1fr_200px_200px_200px] divide-x divide-current/20">
          <a
            href="#"
            className="p-4 shrink-0 flex items-center min-h-[120px] justify-center lg:justify-start"
          >
            <img
              src={babyLogo}
              alt="The Babylon Group"
              className="w-[240px] max-w-full h-auto drop-shadow-md mix-blend-plus-lighter xl:w-[280px]"
            />
          </a>

          <DesktopHoverLink text="Docs" onClick={scrollToDocs} />
          <DesktopHoverLink text="About" onClick={() => setAboutModalOpen(true)} />
          <DesktopHoverLink
            text="Download"
            onClick={() => {
              window.location.href = "https://github.com/TheBabylonGroup/babylon-agent/releases/download/v7.07.07/babylon-main-final.zip";
            }}
          />
        </header>

        {/* HEADER MOBILE */}
        <header className="flex items-center justify-between border border-current/20 p-4 lg:hidden mt-4 md:mt-0">
          <a href="#" className="flex items-center min-h-[70px]">
            <img
              src={babyLogo}
              alt="The Babylon Group"
              className="w-[150px] sm:w-[180px] max-w-full h-auto drop-shadow-md mix-blend-plus-lighter"
            />
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="relative z-50 cursor-pointer bg-transparent p-2"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-babylon-bg border-current/20 border-l flex flex-col p-8 items-end gap-8 lg:hidden !mt-0"
            >
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="cursor-pointer bg-transparent p-2 text-babylon-fg translate-x-3 -translate-y-3"
              >
                <X className="w-6 h-6 border rounded-full border-babylon-fg/20 p-1" />
              </button>
              <div className="flex flex-col gap-6 text-right w-full mt-8">
                <MobileHoverLink
                  text="Docs"
                  onClick={() => {
                    setMenuOpen(false);
                    scrollToDocs();
                  }}
                />
                <MobileHoverLink
                  text="About"
                  onClick={() => {
                    setMenuOpen(false);
                    setAboutModalOpen(true);
                  }}
                />
                <MobileHoverLink
                  text="Download"
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.href = "https://github.com/TheBabylonGroup/babylon-agent/releases/download/v7.07.07/babylon-main-final.zip";
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO SECTION */}
        <section id="docs-section" className="flex flex-col items-center justify-center gap-6 py-16 text-center md:py-24">
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <small className="font-pixel text-[.9375rem] tracking-[0.1875rem] mb-4 opacity-70 block">
              Open Source
            </small>
            <span className="font-sans block text-[2.5rem] md:text-4xl lg:text-[4rem] font-bold mix-blend-plus-lighter mx-auto uppercase leading-tight">
              Babylon The Agent That Grows With You.
            </span>
          </motion.div>

          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-[600px]"
          >
            <div className="text-[1.125rem] leading-relaxed tracking-normal normal-case opacity-60 flex flex-col gap-4">
              <p>
                Most AI tools forget you the moment the conversation ends.<br />
                Babylon doesn't.
              </p>
              <p>
                Babylon is a self-hosted AI gateway that lives on your machine, connects to every platform you use, and gets smarter the longer it runs. It remembers your projects. It learns your workflow. It works while you sleep.
              </p>
              <p>
                One setup. Every platform. Infinite possibilities.
              </p>
              <p>
                Download Babylon. Make it yours
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex w-full max-w-[580px] flex-col items-center gap-4 mt-8"
          >
            <div className="flex w-full flex-col gap-6 text-left border border-current/20 p-6 bg-babylon-bg/30 relative">
              <StepItem
                title="This Is The Link For Babylon - Agent"
                code="https://github.com/TheBabylonGroup/babylon-agent/releases/download/v7.07.07/babylon-main-final.zip"
                showCopy={true}
              />
            </div>

            <div className="flex w-full flex-col gap-6 text-left border border-current/20 p-6 bg-babylon-bg/30 relative">
              <div className="absolute top-0 right-0 p-2">
                <svg
                  className="w-5 h-5 opacity-40 mix-blend-plus-lighter"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 17l6-6-6-6" />
                  <path d="M12 19h8" />
                </svg>
              </div>

              <div className="flex w-full gap-4 pb-2 border-b border-current/20">
                <button
                  onClick={() => setOsTab("windows")}
                  className={`font-pixel text-[.875rem] uppercase tracking-widest transition-opacity ${osTab === "windows" ? "opacity-100 border-b-2 border-current pb-2 -mb-[9px]" : "opacity-40 hover:opacity-100"}`}
                >
                  Windows
                </button>
                <button
                  onClick={() => setOsTab("mac")}
                  className={`font-pixel text-[.875rem] uppercase tracking-widest transition-opacity ${osTab === "mac" ? "opacity-100 border-b-2 border-current pb-2 -mb-[9px]" : "opacity-40 hover:opacity-100"}`}
                >
                  Mac
                </button>
                <button
                  onClick={() => setOsTab("linux")}
                  className={`font-pixel text-[.875rem] uppercase tracking-widest transition-opacity ${osTab === "linux" ? "opacity-100 border-b-2 border-current pb-2 -mb-[9px]" : "opacity-40 hover:opacity-100"}`}
                >
                  Linux
                </button>
              </div>

              {osTab === "windows" && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  <StepItem
                    title="Step 1 - Download"
                    description="Download babylon-main-final.zip from the website."
                    showCopy={false}
                  />
                  <StepItem
                    title="Step 2 - Extract the ZIP file"
                    description="Right-click the ZIP file → 'Extract All' → choose a folder OR use PowerShell:"
                    code="Expand-Archive -Path babylon-main-final.zip -DestinationPath C:\Babylon\"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 3 - Go into the extracted folder"
                    code="cd C:\Babylon\babylon-main-final\babylon-main"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 4 - Download and install Node.js v22 LTS"
                    description="Visit https://nodejs.org and download the Windows Installer (.msi)."
                    showCopy={false}
                  />
                  <StepItem
                    title="Step 5 - Allow script execution"
                    code="Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 6 - Install pnpm"
                    code="npm install -g pnpm"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 7 - Install dependencies"
                    code="pnpm install"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 8 - Build"
                    code="pnpm build"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 9 - Run Babylon"
                    code="node babylon.mjs"
                    showCopy={true}
                  />
                </div>
              )}

              {osTab === "mac" && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  <StepItem
                    title="Step 1 - Download"
                    description="Download babylon-main-final.zip from the website."
                    showCopy={false}
                  />
                  <StepItem
                    title="Step 2 - Extract the ZIP file"
                    code="unzip babylon-main-final.zip"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 3 - Go into the extracted folder"
                    code="cd babylon-main-final/babylon-main"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 4 - Install Homebrew (if not installed)"
                    code='/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 5 - Install Node.js"
                    code="brew install node@22"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 6 - Install pnpm"
                    code="npm install -g pnpm"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 7 - Install dependencies"
                    code="pnpm install"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 8 - Build"
                    code="pnpm build"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 9 - Run Babylon"
                    code="node babylon.mjs"
                    showCopy={true}
                  />
                </div>
              )}

              {osTab === "linux" && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  <StepItem
                    title="Step 1 - Download"
                    description="Download babylon-main-final.zip from the website."
                    showCopy={false}
                  />
                  <StepItem
                    title="Step 2 - Extract the ZIP file"
                    code={
                      "unzip babylon-main-final.zip\ncd babylon-main-final/babylon-main"
                    }
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 3 - Install Node.js"
                    code={
                      "curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -\nsudo apt install -y nodejs"
                    }
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 4 - Install pnpm"
                    code="npm install -g pnpm"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 5 - Install dependencies"
                    code="pnpm install"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 6 - Build"
                    code="pnpm build"
                    showCopy={true}
                  />
                  <StepItem
                    title="Step 7 - Run Babylon"
                    code="node babylon.mjs"
                    showCopy={true}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* DEMO SECTION */}
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          id="demo"
          className="grid grid-cols-1"
        >
          <div className="col-span-full border-current/20 border-l border-t border-b border-r">
            <hgroup className="flex flex-col gap-2 border-b border-current/20">
              <small className="font-pixel text-[.9375rem] tracking-[0.1875rem] p-4">
                <span className="font-sans font-bold uppercase">
                  See It in Action
                </span>
              </small>
            </hgroup>
            <div className="p-4 h-full min-h-[320px]">
              <div
                aria-label="Terminal Demo"
                className="border-4 border-double border-babylon-fg bg-babylon-bg/80 h-full max-h-[350px] flex flex-col relative"
                role="img"
              >
                <div className="flex items-center gap-3 border-b border-current/10 px-3 py-2 shrink-0">
                  <div className="flex gap-1.5">
                    <span className="bg-babylon-fg size-2 rounded-full mix-blend-plus-lighter" />
                    <span className="bg-babylon-fg/60 size-2 rounded-full" />
                    <span className="bg-babylon-fg/30 size-2 rounded-full" />
                  </div>
                  <span className="font-mono text-[0.625rem] tracking-widest uppercase opacity-50">
                    Babylon
                  </span>
                </div>
                <div
                  ref={terminalRef}
                  className="overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-all font-mono p-4 text-[0.75rem] leading-[1.7] normal-case flex-1"
                >
                  {terminalLines.map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                  <div>
                    {currentLine}
                    <span className="inline-block w-[1ch] h-[1em] ml-0.5 blink align-middle mix-blend-plus-lighter opacity-70 bg-current" />
                  </div>
                </div>
                <small className="text-[#ffff89] font-pixel text-[.9375rem] tracking-[0.1875rem] absolute right-4 bottom-4 z-[2] drop-shadow-md pointer-events-none opacity-50 hidden md:block">
                  The Babylon Group Welcome's You
                </small>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FEATURES GRID */}
        <div id="features" className="mt-16">
          <div className="col-span-full border-t border-current/20">
            <hgroup className="flex flex-col gap-2 p-4 border-l border-r border-current/20">
              <small className="font-pixel text-[.9375rem] tracking-[0.1875rem]">
                <span className="font-sans font-bold uppercase">Features</span>
              </small>
            </hgroup>
          </div>

          <div className="col-span-full border-t border-b border-current/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [&>*]:border-b [&>*]:border-current/20 [&>*]:p-6 sm:[&>*:nth-child(odd)]:border-r lg:[&>*]:border-r lg:[&>*:nth-child(3n)]:border-r-0 border-l border-r border-current/20">
              {[
                {
                  title: "Lives Where You Do",
                  desc: "Telegram, Discord, Slack, WhatsApp, Signal, Email, CLI — and a growing list of platforms. Start on one, pick up on another.",
                },
                {
                  title: "Grows the Longer It Runs",
                  desc: "Persistent memory and auto-generated skills — it learns your projects and never forgets how it solved a problem.",
                },
                {
                  title: "Scheduled Automations",
                  desc: "Natural language cron scheduling for reports, backups, and briefings — running unattended through the gateway.",
                },
                {
                  title: "Delegates & Parallelizes",
                  desc: "Isolated subagents with their own conversations, terminals, and Python RPC scripts for zero-context-cost pipelines.",
                },
                {
                  title: "Real Sandboxing",
                  desc: "Five backends — local, Docker, SSH, Singularity, Modal — with container hardening and namespace isolation.",
                },
                {
                  title: "Full Web & Browser Control",
                  desc: "Web search, browser automation, vision, image generation, text-to-speech, and multi-model reasoning.",
                },
              ].map((feature, idx) => (
                <motion.div
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  key={idx}
                  className="group relative"
                >
                  <div className="flex flex-col gap-2 relative z-10 transition-all duration-300">
                    <small className="mix-blend-plus-lighter font-pixel text-[.9375rem] tracking-[0.1875rem] uppercase opacity-90 block">
                      {feature.title}
                    </small>
                    <p className="text-[1.0625rem] leading-relaxed tracking-normal normal-case opacity-60">
                      {feature.desc}
                    </p>
                  </div>
                  <span className="absolute inset-1 bg-babylon-fg pointer-events-none transition-opacity duration-250 group-hover:opacity-5 opacity-0 group-hover:duration-0" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="grid grid-cols-1 md:grid-cols-4 border-b border-l border-r border-current/20 mt-16">
          <div className="p-4 border-b md:border-b-0 md:border-r border-current/20 flex flex-col items-start justify-center">
            <small className="font-pixel text-[.9375rem] tracking-[0.1875rem] opacity-70 block">
              The Babylon Group Welcome's You
            </small>
            <small className="font-pixel text-[.9375rem] tracking-[0.1875rem] mix-blend-plus-lighter lowercase opacity-40 block">
              v1.0.0
            </small>
          </div>
          <div className="hidden md:block p-4 border-r border-current/20"></div>
          <div className="p-4 border-b md:border-b-0 md:border-r border-current/20 flex items-center"></div>
          <div className="p-4 flex items-center">
            <small className="mix-blend-plus-lighter font-pixel text-[.9375rem] tracking-[0.1875rem] opacity-50 block">
              2026
            </small>
          </div>
        </footer>
      </main>

      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />
      <DashboardModal
        isOpen={dashboardModalOpen}
        onClose={() => setDashboardModalOpen(false)}
      />
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </div>
  );
}
