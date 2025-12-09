export interface PrintSettings {
  printerPowerWatts: number;
  electricityCostKwh: number;
  workPerHourCost: number;
  profitPercent: number;
  setupFee: number;
}

export interface MaterialSettings {
  spoolCost: number;
  spoolWeightGrams: number;
}

export interface JobDetails {
  customerName: string;
  partName: string;
  partWeightGrams: number;
  printTimeHours: number; // Storing as decimal hours for calculation
  printTimeMinutes: number; // Helper for UI
}

export interface CostBreakdown {
  materialCost: number;
  energyCost: number;
  laborCost: number;
  setupCost: number;
  baseCost: number;
  totalCost: number;
}