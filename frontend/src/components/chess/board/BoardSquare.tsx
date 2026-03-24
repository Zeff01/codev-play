"use client";

import { cn } from "@/lib/utils";
import Piece from "./Piece";
import { motion } from "framer-motion";

interface Props {
  square: string;
  piece: string | undefined;
  isLight: boolean;
  isSelected: boolean;
  isLegal: boolean;
  isCapture: boolean;
  disabled: boolean;
  onClick: () => void;
  // New Drag Events
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function BoardSquare({
  square,
  piece,
  isLight,
  isSelected,
  isLegal,
  isCapture,
  disabled,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
}: Props) {
  return (
    <button
      role="gridcell"
      aria-label={`${square}${piece ? ` ${piece}` : ""}`}
      aria-selected={isSelected}
      disabled={disabled}
      onClick={onClick}
      // Add the drop listeners to the square itself
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "w-14 h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 relative flex items-center justify-center transition-all duration-150",
        isLight
          ? "bg-[#eaeff4] dark:bg-[#b0b8c2]"
          : "bg-[#6f8295] dark:bg-[#4b5969]",
        isSelected && "ring-inset ring-4 ring-primary bg-primary/20",
        !disabled && !isSelected && "hover:opacity-90",
        disabled ? "cursor-default" : "cursor-pointer",
      )}
    >
      {isLegal && !isCapture && (
        <span
          className="absolute w-4 h-4 rounded-full bg-primary/40 pointer-events-none z-10"
          aria-hidden="true"
        />
      )}

      {isCapture && (
        <span
          className="absolute inset-0 ring-inset ring-4 ring-destructive/60 pointer-events-none z-10"
          aria-hidden="true"
        />
      )}

      {/* FIX: Separate Framer Motion animations from Native HTML5 Dragging */}
      {piece && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={!disabled ? { scale: 1.1 } : {}}
          whileTap={!disabled ? { scale: 1.2 } : {}}
          className={cn(
            "w-[70%] h-[70%] z-20",
            disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing",
          )}
        >
          {/* Native HTML5 Drag wrapper */}
          <div
            draggable={!disabled}
            onDragStart={onDragStart}
            className="w-full h-full"
          >
            <Piece type={piece} />
          </div>
        </motion.div>
      )}
    </button>
  );
}
