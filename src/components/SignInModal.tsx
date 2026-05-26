import React, { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth, UserProfile } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";

export function SignInModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, profile, setProfile } = useAuth();

  const [step, setStep] = useState<"auth" | "success">(
    "auth",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const newProfile = {
        email: result.user.email || "",
        provider: "google",
      };

      const userDocRef = doc(db, "users", result.user.uid);
      await setDoc(userDocRef, {
        ...newProfile,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setProfile(newProfile as UserProfile);
      setStep("success");
      
      setTimeout(() => {
        onClose();
        setStep("auth");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError(""); // User closed popup, no need to show scary error
      } else if (err.code === "auth/network-request-failed") {
        setError(
          "Network error or popup blocked by iframe restrictions. Please click 'Open App' in the top right to open this app in a new tab and try again."
        );
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Decide what to render based on auth state if we are in initial phases
  let currentStep = step;
  if (user && profile && step === "auth") {
    currentStep = "success";
  }

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
            <h2 className="text-xl font-pixel uppercase tracking-widest">
              {currentStep === "auth" && "Authenticate"}
              {currentStep === "success" && "Authorized"}
            </h2>
            <button
              onClick={() => {
                onClose();
                setStep("auth");
              }}
              className="hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-3 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            {currentStep === "auth" && (
              <>
                <p className="text-xs opacity-70 mb-2">
                  Select your authentication provider:
                </p>

                <button
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center p-4 border border-babylon-fg hover:bg-babylon-fg hover:text-babylon-bg transition-colors tracking-widest disabled:opacity-50"
                >
                  {loading ? "WAIT..." : "LOGIN WITH GOOGLE"}
                </button>
              </>
            )}

            {currentStep === "success" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 rounded-full border border-babylon-fg flex items-center justify-center mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <p className="text-sm tracking-widest uppercase text-center">
                  ACCESS GRANTED
                </p>
                {profile && (
                  <p className="text-xs opacity-50 mt-2 text-center break-all">
                    ID: {profile.email}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
