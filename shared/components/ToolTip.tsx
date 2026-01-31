"use client";

import { motion } from "framer-motion";
import WeatherWidget from "@/shared/components/WeatherWidget";
import FriendsSidebar from "@/shared/components/friends/FriendSidebar";

type Panel = "weather" | "friends";

interface ToolTipProps {
  hubState: "open" | "minimized";
  panel: Panel;
  passive?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChangePanel: (panel: Panel) => void;
}

export default function ToolTip({
  hubState,
  panel,
  passive = false,
  onOpen,
  onClose,
  onChangePanel,
}: ToolTipProps) {
  const isOpen = hubState === "open";

  return (
    <>
     <motion.button
        drag
        dragMomentum={false}
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
        className={`
          fixed z-50 rounded-full bg-primary text-white font-bold shadow-lg
          select-none transition-all duration-200

          ${passive
            ? "h-9 w-9 opacity-40 right-1 bottom-24"
            : hubState === "open"
              ? "h-9 w-9 right-2 bottom-6 opacity-60"
              : "h-14 w-14 right-6 bottom-6"
          }
        `}
      >
        N
      </motion.button>


  
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={onClose}
        >
          <div
            className="
              absolute bottom-24 right-4
              w-[320px] max-h-[70vh]
              overflow-hidden rounded-2xl
              bg-surface shadow-xl
            "
            onClick={(e) => e.stopPropagation()}
          >
         
            <div className="flex gap-2 border-b bg-surface-muted p-2 text-sm">
              <button
                onClick={() => onChangePanel("weather")}
                className={`flex-1 rounded-lg py-2 ${
                  panel === "weather"
                    ? "bg-surface text-primary font-semibold"
                    : "text-text-secondary"
                }`}
              >
                날씨
              </button>
              <button
                onClick={() => onChangePanel("friends")}
                className={`flex-1 rounded-lg py-2 ${
                  panel === "friends"
                    ? "bg-surface text-primary font-semibold"
                    : "text-text-secondary"
                }`}
              >
                친구
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {panel === "weather" && <WeatherWidget />}
              {panel === "friends" && <FriendsSidebar />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
