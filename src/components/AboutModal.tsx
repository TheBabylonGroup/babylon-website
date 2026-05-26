import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info } from 'lucide-react';

export function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#081210] border border-babylon-fg/20 w-full max-w-2xl p-6 md:p-8 font-mono text-babylon-fg max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#081210] pt-2 pb-4 border-b border-babylon-fg/20 z-10">
            <h2 className="text-xl font-pixel uppercase tracking-widest flex items-center gap-2">
              <Info className="w-5 h-5" /> About Babylon
            </h2>
            <button
              onClick={onClose}
              className="hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6 text-sm tracking-wide leading-relaxed opacity-90 font-sans">
            <p>
              Babylon is an open-source autonomous AI gateway built for people who want more than a chatbot. It lives on your server, connects to the platforms you already use — Telegram, Discord, Slack, WhatsApp, and more — and becomes a persistent, intelligent presence that grows more capable the longer it runs.
            </p>
            <p>
              Unlike conventional AI tools that forget everything the moment a conversation ends, Babylon remembers. It builds a persistent memory of your projects, your preferences, and the problems it has solved — so every interaction is informed by everything that came before.
            </p>
            <p>
              Babylon is not a single-purpose tool. It is a foundation. A gateway that bridges multiple AI providers, automates complex workflows, schedules tasks in natural language, and deploys isolated subagents to handle parallel workloads — all from a single, unified interface.
            </p>
            <p>
              It runs where you need it. Whether on a personal machine, a remote VPS, or a cloud server, Babylon adapts to your infrastructure. It supports Docker, SSH, and multiple sandbox backends out of the box, with fine-grained security controls that give you full ownership over what it can and cannot do.
            </p>
            <p>
              Babylon was built on the belief that powerful AI should not be locked behind subscriptions, proprietary APIs, or closed ecosystems. It is free. It is yours. And it is designed to grow with you — not just today, but for every project, every platform, and every challenge that comes next.
            </p>
            
            <div className="mt-8 pt-6 border-t border-babylon-fg/20">
              <p className="font-pixel text-xs tracking-widest leading-loose text-center opacity-70">
                The Babylon Group — Building the future of autonomous AI, one gateway at a time.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
