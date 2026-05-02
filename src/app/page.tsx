"use client";

import { useState, useEffect, useCallback } from "react";
import CurrentPlanForm from "@/components/CurrentPlanForm";
import UsageInput from "@/components/UsageInput";
import ComparisonTable from "@/components/ComparisonTable";
import { getPlansByPostcode } from "@/data/plans";
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
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan>(DEFAULT_CURRENT_PLAN);
  const [dailyUsageMJ, setDailyUsageMJ] = useState<number>(0);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [currentAnnualCost, setCurrentAnnualCost] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runComparison = useCallback(async () => {
    if (dailyUsageMJ <= 0) {
      setResults([]);
      setCurrentAnnualCost(null);
      return;
    }

    setIsLoading(true);
    try {
      const plans = await getPlansByPostcode(DEFAULT_POSTCODE);

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
  }, [currentPlan, dailyUsageMJ]);

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
              Wollongong NSW (2500)
            </span>{" "}
            · Distributor: Jemena Gas Networks
          </p>
        </header>

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
