import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CostBreakdown, JobDetails, MaterialSettings, PrintSettings } from '../types';
import { formatCurrency, formatNumber } from './calculationService';

export const generateBudgetPDF = (
  job: JobDetails,
  material: MaterialSettings,
  settings: PrintSettings,
  costs: CostBreakdown
) => {
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString('pt-BR');
  const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'); // +7 days

  // --- Header ---
  doc.setFillColor(63, 81, 181); // Indigo color
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('ORÇAMENTO DE IMPRESSÃO 3D', 14, 25);
  
  doc.setFontSize(10);
  doc.text(`Data de Emissão: ${today}`, 150, 20);
  doc.text(`Validade: ${validUntil}`, 150, 28);

  // --- Customer Info ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Cliente / Projeto', 14, 50);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Cliente: ${job.customerName || 'Não informado'}`, 14, 58);
  doc.text(`Peça: ${job.partName || 'Peça Genérica'}`, 14, 64);
  
  // --- Technical Details ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Resumo Técnico', 14, 80);

  const totalTime = `${job.printTimeHours}h ${job.printTimeMinutes}m`;

  // Simplified table for end-customer
  autoTable(doc, {
    startY: 85,
    head: [['Item', 'Detalhe']],
    body: [
      ['Peso Estimado da Peça', `${formatNumber(job.partWeightGrams)} g`],
      ['Tempo de Impressão Estimado', totalTime],
    ],
    theme: 'striped',
    headStyles: { fillColor: [100, 116, 139] },
  });

  // --- Final Price Section (Highlighted) ---
  // @ts-ignore - access finalY from previous table
  let finalY = doc.lastAutoTable.finalY + 20;

  // Draw a box for the price
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 250, 252); // Slate-50 mostly
  doc.rect(14, finalY, 182, 40, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(63, 81, 181); // Indigo
  doc.text('VALOR TOTAL DO SERVIÇO', 105, finalY + 12, { align: 'center' });

  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(formatCurrency(costs.totalCost), 105, finalY + 28, { align: 'center' });

  // --- Footer ---
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Este orçamento refere-se aos serviços de impressão 3D conforme especificações acima.', 105, 280, { align: 'center' });
  doc.text('Gerado por Calc3D Pro', 105, 285, { align: 'center' });

  doc.save(`Orcamento_${job.partName.replace(/\s+/g, '_') || '3D'}.pdf`);
};