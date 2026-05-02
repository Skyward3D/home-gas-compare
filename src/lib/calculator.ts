import { GasPlan, CurrentPlan, UsageRate } from "./types";

/**
 * Calculates the estimated annual usage cost (in dollars) for a set of tiered
 * usage rates given a flat daily usage in MJ.
 *
 * Supports both flat (single-rate) and tiered (step) pricing.
 */
function calcUsageCostDollars(
  usageRates: UsageRate[],
  dailyUsageMJ: number
): number {
  // Sort tiers ascending by upper bound (undefined → Infinity)
  const sorted = [...usageRates].sort((a, b) => {
    const aUp = a.upToMJPerDay ?? Infinity;
    const bUp = b.upToMJPerDay ?? Infinity;
    return aUp - bUp;
  });

  let remainingMJ = dailyUsageMJ;
  let prevBound = 0;
  let dailyCostCents = 0;

  for (const tier of sorted) {
    const bound = tier.upToMJPerDay ?? Infinity;
    const tierSizeMJ = Math.min(remainingMJ, bound - prevBound);
    if (tierSizeMJ <= 0) break;
    dailyCostCents += tierSizeMJ * tier.rateCentsPerMJ;
    remainingMJ -= tierSizeMJ;
    prevBound = bound;
    if (remainingMJ <= 0) break;
  }

  const annualCostCents = dailyCostCents * 365;
  return annualCostCents / 100;
}

/**
 * Estimates the annual cost (in dollars) of a GasPlan given daily usage in MJ.
 */
export function estimateAnnualCost(
  plan: GasPlan,
  dailyUsageMJ: number
): number {
  const supplyAnnualDollars = (plan.supplyChargeCentsPerDay / 100) * 365;
  const usageDollars = calcUsageCostDollars(plan.usageRates, dailyUsageMJ);
  return supplyAnnualDollars + usageDollars;
}

/**
 * Estimates the annual cost (in dollars) for the user's current plan,
 * modelled as a simple flat-rate plan.
 */
export function estimateCurrentPlanAnnualCost(
  currentPlan: CurrentPlan,
  dailyUsageMJ: number
): number {
  const supplyAnnualDollars = (currentPlan.supplyChargeCentsPerDay / 100) * 365;
  const usageAnnualDollars =
    (currentPlan.usageRateCentsPerMJ / 100) * dailyUsageMJ * 365;
  return supplyAnnualDollars + usageAnnualDollars;
}
