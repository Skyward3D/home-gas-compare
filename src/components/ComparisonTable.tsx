"use client";

import { ComparisonResult } from "@/lib/types";

interface Props {
  results: ComparisonResult[];
  currentAnnualCost: number | null;
  isLoading: boolean;
}

function fmt(dollars: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(dollars);
}

export default function ComparisonTable({
  results,
  currentAnnualCost,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🔍 Available Plans
        </h2>
        <p className="text-sm text-gray-400 animate-pulse">Loading plans…</p>
      </section>
    );
  }

  if (results.length === 0) {
    return (
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🔍 Available Plans
        </h2>
        <p className="text-sm text-gray-500">
          Enter your usage above to see a comparison of available plans.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        🔍 Available Plans
      </h2>
      {currentAnnualCost !== null && (
        <p className="text-sm text-gray-500 mb-4">
          Your estimated current annual cost:{" "}
          <span className="font-semibold text-gray-700">
            {fmt(currentAnnualCost)}
          </span>
          . Savings shown below are vs. your current plan.
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <th className="px-4 py-3 border-b border-gray-200">#</th>
              <th className="px-4 py-3 border-b border-gray-200">Retailer</th>
              <th className="px-4 py-3 border-b border-gray-200">Plan</th>
              <th className="px-4 py-3 border-b border-gray-200">
                Supply charge
                <br />
                <span className="font-normal normal-case">(¢/day)</span>
              </th>
              <th className="px-4 py-3 border-b border-gray-200">
                Usage rate
                <br />
                <span className="font-normal normal-case">(¢/MJ)</span>
              </th>
              <th className="px-4 py-3 border-b border-gray-200">
                Est. annual cost
              </th>
              <th className="px-4 py-3 border-b border-gray-200">
                vs. current
              </th>
              <th className="px-4 py-3 border-b border-gray-200">Notes</th>
              <th className="px-4 py-3 border-b border-gray-200">Links</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => {
              const { plan } = result;
              const saving = result.annualSavingDollars;
              const isCheapest = idx === 0;
              const savingText =
                currentAnnualCost === null
                  ? "—"
                  : saving >= 0
                  ? `Save ${fmt(saving)}`
                  : `+${fmt(Math.abs(saving))} more`;
              const savingColor =
                currentAnnualCost === null
                  ? "text-gray-400"
                  : saving > 0
                  ? "text-green-600 font-semibold"
                  : saving < 0
                  ? "text-red-500"
                  : "text-gray-500";

              // Build a display string for usage rates
              const rateDisplay = plan.usageRates
                .map((r) =>
                  r.upToMJPerDay
                    ? `${r.rateCentsPerMJ}¢ (≤${r.upToMJPerDay} MJ/day)`
                    : `${r.rateCentsPerMJ}¢`
                )
                .join(", ");

              return (
                <tr
                  key={plan.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    isCheapest ? "bg-green-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-gray-500">
                    {isCheapest ? (
                      <span
                        title="Cheapest plan"
                        className="text-green-600 font-bold"
                      >
                        🥇
                      </span>
                    ) : (
                      idx + 1
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {plan.retailer}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{plan.planName}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {plan.supplyChargeCentsPerDay.toFixed(2)}¢
                  </td>
                  <td className="px-4 py-3 text-gray-700">{rateDisplay}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {fmt(result.estimatedAnnualCostDollars)}
                  </td>
                  <td className={`px-4 py-3 ${savingColor}`}>{savingText}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-[160px]">
                    {plan.notes ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs space-y-1 whitespace-nowrap">
                    {plan.retailerUrl && (
                      <a
                        href={plan.retailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline"
                      >
                        Retailer ↗
                      </a>
                    )}
                    {plan.energyMadeEasyUrl && (
                      <a
                        href={plan.energyMadeEasyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline"
                      >
                        Energy Made Easy ↗
                      </a>
                    )}
                    {!plan.retailerUrl && !plan.energyMadeEasyUrl && "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        * Estimates based on your entered usage. Actual costs may vary due to
        billing periods, conditional discounts, and GST. Always verify rates
        with the retailer directly.
      </p>
    </section>
  );
}
