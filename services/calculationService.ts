import { CostBreakdown, JobDetails, MaterialSettings, PrintSettings } from '../types';

export const calculateCosts = (
  job: JobDetails,
  material: MaterialSettings,
  printer: PrintSettings
): CostBreakdown => {
  // 1. Custo do Material (C_mat) = (C_rolo / P_rolo) * P_peça
  const materialCost = (material.spoolCost / material.spoolWeightGrams) * job.partWeightGrams;

  // 2. Custo de Energia (C_ene) = (C_kWh / 1000) * C_imp * T_imp
  // T_imp must be in hours
  const totalHours = job.printTimeHours + (job.printTimeMinutes / 60);
  const energyCost = (printer.electricityCostKwh / 1000) * printer.printerPowerWatts * totalHours;

  // 3. Custo da Mão de Obra (C_mo) = C_h * T_imp
  const laborCost = printer.workPerHourCost * totalHours;

  // 4. Taxa de Setup (C_setup)
  const setupCost = printer.setupFee;

  // 5. Custo Base Total (C_base) = C_mat + C_ene + C_mo + C_setup
  const baseCost = materialCost + energyCost + laborCost + setupCost;

  // 6. Custo Total (C_total) = C_base * (1 + Lucro%)
  // profitPercent is 0-100+, so we divide by 100
  const totalCost = baseCost * (1 + printer.profitPercent / 100);

  return {
    materialCost,
    energyCost,
    laborCost,
    setupCost,
    baseCost,
    totalCost
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};