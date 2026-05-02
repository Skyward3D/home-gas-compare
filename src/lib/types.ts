/** A tiered usage rate segment for a gas plan */
export interface UsageRate {
  /** Human-readable label, e.g. "First 18 MJ/day" */
  label: string;
  /** Upper consumption bound in MJ/day; undefined means no upper limit */
  upToMJPerDay?: number;
  /** Rate in cents per MJ */
  rateCentsPerMJ: number;
}

/** A gas plan available in the market */
export interface GasPlan {
  id: string;
  retailer: string;
  planName: string;
  /** Gas distribution network, e.g. "Jemena" */
  distributor: string;
  /** Postcodes this plan is available in */
  postcodes: string[];
  /** Daily supply (service to property) charge in cents per day */
  supplyChargeCentsPerDay: number;
  /** Usage rate(s) — supports flat or tiered rates */
  usageRates: UsageRate[];
  /** Optional: plan notes / conditions */
  notes?: string;
  /** Optional: link to the retailer's plan or gas products page */
  retailerUrl?: string;
  /** Optional: link to the Energy Made Easy listing for this plan */
  energyMadeEasyUrl?: string;
}

/** What the user enters for their current plan */
export interface CurrentPlan {
  retailer: string;
  planName: string;
  /** Cents per day */
  supplyChargeCentsPerDay: number;
  /** Flat rate, cents per MJ */
  usageRateCentsPerMJ: number;
}

/** Comparison output for a single plan */
export interface ComparisonResult {
  plan: GasPlan;
  /** Estimated annual cost in dollars */
  estimatedAnnualCostDollars: number;
  /** Saving vs current plan in dollars (positive = cheaper, negative = more expensive) */
  annualSavingDollars: number;
}
