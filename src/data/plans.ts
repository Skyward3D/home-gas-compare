/**
 * Pluggable data layer for gas plans.
 *
 * Currently returns a mocked dataset. Replace `MOCK_PLANS` or the
 * `getPlansByPostcode` function to connect to a real data source such as
 * the Australian Energy Regulator (AER) / Energy Made Easy API.
 */

import { GasPlan } from "@/lib/types";

// ---------------------------------------------------------------------------
// Mocked dataset — representative plans for Wollongong NSW (postcode 2500)
// Distributor: Jemena Gas Networks (NSW)
// Rates are illustrative and based on publicly available plan data.
// ---------------------------------------------------------------------------
const MOCK_PLANS: GasPlan[] = [
  {
    id: "agl-natural-value",
    retailer: "AGL",
    planName: "Natural Value",
    distributor: "Jemena Gas Networks",
    postcodes: ["2500", "2501", "2502", "2505", "2506"],
    supplyChargeCentsPerDay: 82.5,
    usageRates: [{ label: "Usage", rateCentsPerMJ: 2.156 }],
    notes: "No lock-in contract.",
    retailerUrl: "https://www.agl.com.au/residential/gas/products",
    energyMadeEasyUrl: "https://www.energymadeeasy.gov.au",
  },
  {
    id: "origin-green-future",
    retailer: "Origin Energy",
    planName: "Green Future Gas",
    distributor: "Jemena Gas Networks",
    postcodes: ["2500", "2501", "2502", "2505", "2506"],
    supplyChargeCentsPerDay: 91.0,
    usageRates: [
      { label: "First 18 MJ/day", upToMJPerDay: 18, rateCentsPerMJ: 1.98 },
      { label: "Above 18 MJ/day", rateCentsPerMJ: 1.75 },
    ],
    notes: "100% carbon-offset natural gas. Tiered pricing.",
    retailerUrl: "https://www.originenergy.com.au/gas/plans/",
    energyMadeEasyUrl: "https://www.energymadeeasy.gov.au",
  },
  {
    id: "energyaustralia-secure",
    retailer: "EnergyAustralia",
    planName: "Secure Saver",
    distributor: "Jemena Gas Networks",
    postcodes: ["2500", "2501", "2502", "2505", "2506"],
    supplyChargeCentsPerDay: 78.0,
    usageRates: [{ label: "Usage", rateCentsPerMJ: 2.312 }],
    notes: "12-month fixed rate.",
    retailerUrl: "https://www.energyaustralia.com.au/home/gas/plans",
    energyMadeEasyUrl: "https://www.energymadeeasy.gov.au",
  },
  {
    id: "alinta-everydays",
    retailer: "Alinta Energy",
    planName: "Alinta Everyday",
    distributor: "Jemena Gas Networks",
    postcodes: ["2500", "2501", "2502", "2505", "2506"],
    supplyChargeCentsPerDay: 85.0,
    usageRates: [{ label: "Usage", rateCentsPerMJ: 2.05 }],
    notes: "No exit fees.",
    retailerUrl: "https://www.alintaenergy.com.au/nsw/gas",
    energyMadeEasyUrl: "https://www.energymadeeasy.gov.au",
  },
  {
    id: "lumo-smart-gas",
    retailer: "Lumo Energy",
    planName: "Smart Gas",
    distributor: "Jemena Gas Networks",
    postcodes: ["2500", "2501", "2502", "2505", "2506"],
    supplyChargeCentsPerDay: 88.0,
    usageRates: [
      { label: "First 14 MJ/day", upToMJPerDay: 14, rateCentsPerMJ: 2.1 },
      { label: "Above 14 MJ/day", rateCentsPerMJ: 1.95 },
    ],
    notes: "Pay-on-time discount available.",
    retailerUrl: "https://www.lumoenergy.com.au/gas",
    energyMadeEasyUrl: "https://www.energymadeeasy.gov.au",
  },
  {
    id: "red-energy-living-saver",
    retailer: "Red Energy",
    planName: "Living Saver",
    distributor: "Jemena Gas Networks",
    postcodes: ["2500", "2501", "2502", "2505", "2516"],
    supplyChargeCentsPerDay: 76.5,
    usageRates: [{ label: "Usage", rateCentsPerMJ: 2.28 }],
    notes: "Backed by Snowy Hydro. No lock-in.",
    retailerUrl: "https://www.redenergy.com.au/gas/plans",
    energyMadeEasyUrl: "https://www.energymadeeasy.gov.au",
  },
];

// Note: energyMadeEasyUrl uses the generic Energy Made Easy homepage for now.
// Once connected to real AER plan data, replace with plan-specific deep-links.

// ---------------------------------------------------------------------------
// Data layer API
// ---------------------------------------------------------------------------

/**
 * Returns all gas plans available for a given postcode.
 *
 * Swap the implementation here to load from the AER Energy Made Easy API
 * or another data source in the future.
 */
export async function getPlansByPostcode(postcode: string): Promise<GasPlan[]> {
  // Simulated async (real API call would go here)
  return MOCK_PLANS.filter((plan) => plan.postcodes.includes(postcode));
}

/**
 * Returns all available plans regardless of postcode (useful for testing).
 */
export async function getAllPlans(): Promise<GasPlan[]> {
  return MOCK_PLANS;
}
