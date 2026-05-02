"use client";

import { CurrentPlan } from "@/lib/types";

interface Props {
  currentPlan: CurrentPlan;
  onChange: (plan: CurrentPlan) => void;
}

export default function CurrentPlanForm({ currentPlan, onChange }: Props) {
  function handleChange(field: keyof CurrentPlan, value: string | number) {
    onChange({ ...currentPlan, [field]: value });
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        📋 My Current Plan
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter your current gas plan details from your latest bill or account
        portal.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Retailer name
          </label>
          <input
            type="text"
            placeholder="e.g. AGL"
            value={currentPlan.retailer}
            onChange={(e) => handleChange("retailer", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plan name
          </label>
          <input
            type="text"
            placeholder="e.g. Natural Value"
            value={currentPlan.planName}
            onChange={(e) => handleChange("planName", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supply charge{" "}
            <span className="text-gray-400 font-normal">(cents/day)</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 82.5"
            value={currentPlan.supplyChargeCentsPerDay || ""}
            onChange={(e) =>
              handleChange(
                "supplyChargeCentsPerDay",
                parseFloat(e.target.value) || 0
              )
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usage rate{" "}
            <span className="text-gray-400 font-normal">(cents/MJ)</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 2.15"
            value={currentPlan.usageRateCentsPerMJ || ""}
            onChange={(e) =>
              handleChange(
                "usageRateCentsPerMJ",
                parseFloat(e.target.value) || 0
              )
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
    </section>
  );
}
