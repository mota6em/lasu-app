"use client";

import toast from "react-hot-toast";
import { Undo2 } from "lucide-react";

export function showUndoToast(
  message: string,
  onUndo: () => void,
  duration = 4600
) {
  toast(
    (t) => (
      <span className="flex items-center gap-4">
        <span>{message}</span>
        <button
          onClick={() => {
            onUndo();
            toast.dismiss(t.id);
          }}
          className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Undo
        </button>
      </span>
    ),
    { duration }
  );
}
