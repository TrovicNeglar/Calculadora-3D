import React, { useState, useEffect } from 'react';
import { Download, Calculator, Settings, Box, Zap, Clock } from 'lucide-react';
import { PrintSettings, MaterialSettings, JobDetails, CostBreakdown } from './types';
import { calculateCosts, formatCurrency } from './services/calculationService';
import { generateBudgetPDF } from './services/pdfService';
import { NumberInput } from './components/NumberInput';
import { ResultsChart } from './components/ResultsChart';

const DEFAULT_SETTINGS: PrintSettings = {
  printerPowerWatts: 350,
  electricityCostKwh: 0.92, // Average in Brazil
  workPerHourCost: 15.00,
  profitPercent: 50,
  setupFee: 5.00
};

const DEFAULT_MATERIAL: MaterialSettings = {
  spoolCost: 120.00,
  spoolWeightGrams: 1000
};

const DEFAULT_JOB: JobDetails = {
  customerName: '',
  partName: '',
  partWeightGrams: 0,
  printTimeHours: 0,
  printTimeMinutes: 0
};

const App: React.FC = () => {
  // State initialization with localStorage persistence check would go here
  // For simplicity, we initialize with defaults but save to localStorage on change
  const [settings, setSettings] = useState<PrintSettings>(() => {
    const saved = localStorage.getItem('calc3d_settings');
    // Migration: if wasteRatePercent exists but profitPercent doesn't, we might want to handle it,
    // but simplifying to default fallback if structure doesn't match is safer for now.
    // Or just simple JSON parse. If the old key exists, it will be ignored, profitPercent will be undefined.
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.profitPercent === 'undefined') {
        return DEFAULT_SETTINGS; // Reset to defaults if schema changed significantly
      }
      return parsed;
    }
    return DEFAULT_SETTINGS;
  });

  const [material, setMaterial] = useState<MaterialSettings>(() => {
    const saved = localStorage.getItem('calc3d_material');
    return saved ? JSON.parse(saved) : DEFAULT_MATERIAL;
  });

  const [job, setJob] = useState<JobDetails>(DEFAULT_JOB);
  const [costs, setCosts] = useState<CostBreakdown | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('calc3d_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('calc3d_material', JSON.stringify(material));
  }, [material]);

  // Calculation Handler
  const handleCalculate = () => {
    const result = calculateCosts(job, material, settings);
    setCosts(result);
  };

  const handleDownloadPDF = () => {
    if (costs) {
      generateBudgetPDF(job, material, settings, costs);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Box className="w-8 h-8 text-indigo-600" />
              Calc3D Pro
            </h1>
            <p className="text-slate-500 mt-1">Calculadora de Custos de Impressão 3D</p>
          </div>
          {costs && (
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
            >
              <Download className="w-5 h-5" />
              Gerar Orçamento PDF
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Job Details Card */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                <Box className="w-5 h-5 text-slate-500" />
                <h2 className="font-semibold text-slate-700">Dados da Peça e Cliente</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nome do Cliente</label>
                  <input 
                    type="text" 
                    value={job.customerName}
                    onChange={(e) => setJob({...job, customerName: e.target.value})}
                    className="w-full mt-1 bg-white border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Descrição da Peça</label>
                  <input 
                    type="text" 
                    value={job.partName}
                    onChange={(e) => setJob({...job, partName: e.target.value})}
                    className="w-full mt-1 bg-white border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: Suporte de Fone"
                  />
                </div>
                <NumberInput 
                  label="Peso da Peça" 
                  value={job.partWeightGrams} 
                  onChange={(v) => setJob({...job, partWeightGrams: v})} 
                  unit="g" 
                />
                <NumberInput 
                  label="Tempo (Horas)" 
                  value={job.printTimeHours} 
                  onChange={(v) => setJob({...job, printTimeHours: v})} 
                  unit="h" 
                  step="1"
                />
                <NumberInput 
                  label="Tempo (Minutos)" 
                  value={job.printTimeMinutes} 
                  onChange={(v) => setJob({...job, printTimeMinutes: v})} 
                  unit="min" 
                  step="1"
                />
              </div>
            </section>

            {/* 2. Material & Printer Config */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-500" />
                <h2 className="font-semibold text-slate-700">Configuração de Custos</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Material Group */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-600">Material (Filamento)</h3>
                  <NumberInput 
                    label="Custo do Rolo (1kg)" 
                    value={material.spoolCost} 
                    onChange={(v) => setMaterial({...material, spoolCost: v})} 
                    unit="R$" 
                  />
                  <NumberInput 
                    label="Peso do Rolo" 
                    value={material.spoolWeightGrams} 
                    onChange={(v) => setMaterial({...material, spoolWeightGrams: v})} 
                    unit="g" 
                    step="100"
                  />
                </div>

                {/* Machine Group */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-600">Máquina e Energia</h3>
                  <NumberInput 
                    label="Consumo Impressora" 
                    value={settings.printerPowerWatts} 
                    onChange={(v) => setSettings({...settings, printerPowerWatts: v})} 
                    unit="W" 
                    step="10"
                  />
                   <NumberInput 
                    label="Custo Energia (kWh)" 
                    value={settings.electricityCostKwh} 
                    onChange={(v) => setSettings({...settings, electricityCostKwh: v})} 
                    unit="R$" 
                    step="0.01"
                  />
                </div>

                {/* Labor Group */}
                <div className="space-y-4 md:col-span-2 border-t border-slate-100 pt-4">
                  <h3 className="text-sm font-bold text-indigo-600">Mão de Obra e Taxas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <NumberInput 
                      label="Valor Hora Trabalho" 
                      value={settings.workPerHourCost} 
                      onChange={(v) => setSettings({...settings, workPerHourCost: v})} 
                      unit="R$/h" 
                    />
                    <NumberInput 
                      label="Taxa de Setup" 
                      value={settings.setupFee} 
                      onChange={(v) => setSettings({...settings, setupFee: v})} 
                      unit="R$" 
                    />
                    <NumberInput 
                      label="Margem de Lucro (%)" 
                      value={settings.profitPercent} 
                      onChange={(v) => setSettings({...settings, profitPercent: v})} 
                      unit="%" 
                      step="5"
                    />
                  </div>
                </div>
              </div>
            </section>

             <button 
                onClick={handleCalculate}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="w-6 h-6" />
                Calcular Custo Final
              </button>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5 space-y-6">
            {costs ? (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden sticky top-6">
                <div className="bg-slate-900 text-white p-6 text-center">
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Custo Total Estimado</p>
                  <div className="text-4xl md:text-5xl font-bold tracking-tight">
                    {formatCurrency(costs.totalCost)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-center text-sm font-semibold text-slate-500 mb-4">Composição de Custos</h3>
                    <ResultsChart costs={costs} />
                  </div>

                  <div className="space-y-3">
                    <ResultRow label="Custo Material" value={costs.materialCost} icon={<Box className="w-4 h-4" />} />
                    <ResultRow label="Custo Energia" value={costs.energyCost} icon={<Zap className="w-4 h-4" />} />
                    <ResultRow label="Mão de Obra" value={costs.laborCost} icon={<Clock className="w-4 h-4" />} />
                    <ResultRow label="Taxa Setup" value={costs.setupCost} />
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Subtotal (Base)</span>
                      <span className="text-base font-semibold text-slate-700">{formatCurrency(costs.baseCost)}</span>
                    </div>
                     <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Margem de Lucro</span>
                      <span className="text-sm font-mono text-slate-600">+{settings.profitPercent}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 p-8 text-center">
                <Calculator className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Preencha os dados e clique em calcular</p>
                <p className="text-sm mt-2">O resultado detalhado aparecerá aqui.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

const ResultRow: React.FC<{ label: string; value: number; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex justify-between items-center group">
    <div className="flex items-center gap-2 text-slate-600">
      <span className="text-slate-400">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className="text-base font-bold text-slate-800">{formatCurrency(value)}</span>
  </div>
);

export default App;