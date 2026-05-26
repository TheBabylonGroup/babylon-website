import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function DashboardModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { profile, signOut } = useAuth();

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
          className="bg-[#081210] border border-babylon-fg/20 w-full max-w-md p-6 font-mono text-babylon-fg max-h-screen overflow-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-pixel uppercase tracking-widest flex items-center gap-2">
              <User className="w-5 h-5" /> Dashboard
            </h2>
            <button
              onClick={onClose}
              className="hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {profile ? (
              <>
                <div>
                  <p className="text-xs opacity-50 mb-1">EMAIL ADDRESS</p>
                  <p className="text-sm tracking-widest break-all">
                    {profile.email || "N/A"}
                  </p>
                </div>

                <div className="pt-4 border-t border-babylon-fg/20 mt-2">
                  <button
                    onClick={() => {
                      signOut();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center p-4 border border-babylon-fg hover:bg-babylon-fg hover:text-babylon-bg transition-colors tracking-widest"
                  >
                    SIGN OUT
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm opacity-50">Profile data unavailable.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
