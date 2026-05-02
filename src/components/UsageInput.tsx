"use client";

import { useState } from "react";

interface Props {
  dailyUsageMJ: number;
  onChange: (dailyMJ: number) => void;
}

type InputMode = "daily" | "annual" | "bill";

export default function UsageInput({ dailyUsageMJ, onChange }: Props) {
  const [mode, setMode] = useState<InputMode>("daily");
  const [billTotalMJ, setBillTotalMJ] = useState<string>("");
  const [billDays, setBillDays] = useState<string>("");

  function handleValueChange(raw: string) {
    const val = parseFloat(raw) || 0;
    if (mode === "daily") {
      onChange(val);
    } else {
      // Convert annual MJ → daily MJ
      onChange(val / 365);
    }
  }

  function switchMode(newMode: InputMode) {
    if (newMode !== "bill") {
      setBillTotalMJ("");
      setBillDays("");
    }
    setMode(newMode);
  }

  function handleBillChange(totalMJRaw: string, daysRaw: string) {
    const total = parseFloat(totalMJRaw) || 0;
    const days = parseFloat(daysRaw) || 0;
    if (total > 0 && days >= 1) {
      onChange(total / days);
    } else {
      onChange(0);
    }
  }

  const displayValue =
    mode === "daily"
      ? dailyUsageMJ || ""
      : dailyUsageMJ
      ? (dailyUsageMJ * 365).toFixed(0)
      : "";

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        ⚡ My Gas Usage
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter your average gas consumption. You can find this on your bill
        (usually in MJ).
      </p>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => switchMode("daily")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            mode === "daily"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
          }`}
        >
          MJ / day
        </button>
        <button
          type="button"
          onClick={() => switchMode("annual")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            mode === "annual"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
          }`}
        >
          MJ / year
        </button>
        <button
          type="button"
          onClick={() => switchMode("bill")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            mode === "bill"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
          }`}
        >
          Bill period
        </button>
      </div>

      {mode === "bill" ? (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 1200"
              value={billTotalMJ}
              onChange={(e) => {
                setBillTotalMJ(e.target.value);
                handleBillChange(e.target.value, billDays);
              }}
              className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-sm text-gray-500">total MJ</span>
          </div>
          <span className="text-gray-400">over</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 60"
              value={billDays}
              onChange={(e) => {
                setBillDays(e.target.value);
                handleBillChange(billTotalMJ, e.target.value);
              }}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-sm text-gray-500">days</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder={mode === "daily" ? "e.g. 20" : "e.g. 7300"}
            value={displayValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-sm text-gray-500">
            {mode === "daily" ? "MJ per day" : "MJ per year"}
          </span>
        </div>
      )}

      {dailyUsageMJ > 0 && (
        <p className="mt-3 text-sm text-gray-400">
          ≈{" "}
          <span className="font-medium text-gray-600">
            {dailyUsageMJ.toFixed(1)} MJ/day
          </span>{" "}
          ·{" "}
          <span className="font-medium text-gray-600">
            {(dailyUsageMJ * 365).toFixed(0)} MJ/year
          </span>
        </p>
      )}
    </section>
  );
}

