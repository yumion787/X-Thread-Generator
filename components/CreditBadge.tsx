"use client";

interface CreditBadgeProps {
  credits: number | null;
  onBuy: () => void;
}

export function CreditBadge({ credits, onBuy }: CreditBadgeProps) {
  if (credits === null) return null;

  const isLow = credits <= 1;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          isLow
            ? "bg-red-100 text-red-600"
            : "bg-blue-100 text-blue-600"
        }`}
      >
        残り {credits} 回
      </span>
      {isLow && (
        <button
          onClick={onBuy}
          className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors cursor-pointer underline underline-offset-2"
        >
          購入する
        </button>
      )}
    </div>
  );
}
