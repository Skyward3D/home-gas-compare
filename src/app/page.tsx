"use client";

import { useState, useEffect, useCallback } from "react";
import CurrentPlanForm from "@/components/CurrentPlanForm";
import UsageInput from "@/components/UsageInput";
import ComparisonTable from "@/components/ComparisonTable";
import { getPlansByPostcode, getAllPlans } from "@/data/plans";
import { estimateAnnualCost, estimateCurrentPlanAnnualCost } from "@/lib/calculator";
import { CurrentPlan, ComparisonResult } from "@/lib/types";

const DEFAULT_POSTCODE = "2500";

const DEFAULT_CURRENT_PLAN: CurrentPlan = {
  retailer: "",
  planName: "",
  supplyChargeCentsPerDay: 0,
  usageRateCentsPerMJ: 0,
};

export default function Home() {
  const [postcode, setPostcode] = useState<string>(DEFAULT_POSTCODE);
  const [postcodeInput, setPostcodeInput] = useState<string>(DEFAULT_POSTCODE);
  const [postcodeError, setPostcodeError] = useState<string>("");
  const [usingFallback, setUsingFallback] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan>(DEFAULT_CURRENT_PLAN);
  const [dailyUsageMJ, setDailyUsageMJ] = useState<number>(0);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [currentAnnualCost, setCurrentAnnualCost] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handlePostcodeChange(value: string) {
    setPostcodeInput(value);
    // Only show a validation error once the user has typed at least 4 characters
    if (value.length >= 4 && !/^\d{4}$/.test(value)) {
      setPostcodeError("Postcode must be exactly 4 digits.");
    } else {
      setPostcodeError("");
      if (/^\d{4}$/.test(value)) {
        setPostcode(value);
      }
    }
  }

  const runComparison = useCallback(async () => {
    if (dailyUsageMJ <= 0) {
      setResults([]);
      setCurrentAnnualCost(null);
      return;
    }

    setIsLoading(true);
    try {
      let plans = await getPlansByPostcode(postcode);
      let fallback = false;
      if (plans.length === 0) {
        plans = await getAllPlans();
        fallback = true;
      }
      setUsingFallback(fallback);

      const hasCurrentPlanRates =
        currentPlan.supplyChargeCentsPerDay > 0 ||
        currentPlan.usageRateCentsPerMJ > 0;

      const currentCost = hasCurrentPlanRates
        ? estimateCurrentPlanAnnualCost(currentPlan, dailyUsageMJ)
        : null;

      setCurrentAnnualCost(currentCost);

      const compared: ComparisonResult[] = plans.map((plan) => {
        const estimated = estimateAnnualCost(plan, dailyUsageMJ);
        return {
          plan,
          estimatedAnnualCostDollars: estimated,
          annualSavingDollars: currentCost !== null ? currentCost - estimated : 0,
        };
      });

      compared.sort(
        (a, b) => a.estimatedAnnualCostDollars - b.estimatedAnnualCostDollars
      );

      setResults(compared);
    } finally {
      setIsLoading(false);
    }
  }, [currentPlan, dailyUsageMJ, postcode]);

  useEffect(() => {
    runComparison();
  }, [runComparison]);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            🔥 Home Gas Plan Comparator
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Comparing plans available in{" "}
            <span className="font-semibold text-gray-700">
              Postcode {postcode}
            </span>{" "}
            · Distributor: Jemena Gas Networks
          </p>
        </header>

        {/* Postcode input */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📍 Your Postcode
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="e.g. 2500"
              value={postcodeInput}
              onChange={(e) => handlePostcodeChange(e.target.value)}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder:text-gray-400"
            />
            <span className="text-sm text-gray-500">
              Enter your 4-digit postcode to filter available plans.
            </span>
          </div>
          {postcodeError && (
            <p className="mt-2 text-sm text-red-500">{postcodeError}</p>
          )}
        </section>

        {usingFallback && !postcodeError && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl px-5 py-3 text-sm text-amber-800">
            ⚠️ No plans found for postcode <strong>{postcode}</strong> in the
            mocked dataset — showing all available demo plans instead.
          </div>
        )}

        <CurrentPlanForm currentPlan={currentPlan} onChange={setCurrentPlan} />

        <UsageInput dailyUsageMJ={dailyUsageMJ} onChange={setDailyUsageMJ} />

        <ComparisonTable
          results={results}
          currentAnnualCost={currentAnnualCost}
          isLoading={isLoading}
        />

        <footer className="text-center text-xs text-gray-400 pt-4">
          Data is illustrative / mocked. Connect to the{" "}
          <a
            href="https://www.energymadeeasy.gov.au"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            Energy Made Easy API
          </a>{" "}
          for live plan data.
        </footer>
      </div>
    </main>
  );
}

