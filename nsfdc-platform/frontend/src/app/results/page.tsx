'use client';

import { ShaderBackground } from "@/components/ui/neuro-noise";

import { useState, useEffect, useRef } from 'react';
import GlassCard from '@/components/GlassCard';
import { Calculator, TrendingUp, Clock, IndianRupee } from 'lucide-react';
import { useTranslation } from '@/lib/I18nProvider';
import { calculateEmi } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';

interface EmiResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  effectiveMonths: number;
}

function drawDonut(
  canvas: HTMLCanvasElement,
  principal: number,
  interest: number,
  animProgress: number,
  t: (key: string) => string
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const size = canvas.offsetWidth;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const lineWidth = size * 0.12;
  const total = principal + interest;
  const principalAngle = (principal / total) * Math.PI * 2 * animProgress;
  const interestAngle = (interest / total) * Math.PI * 2 * animProgress;
  const startAngle = -Math.PI / 2;

  ctx.clearRect(0, 0, size, size);

  // Background ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Principal arc (violet)
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, startAngle + principalAngle);
  ctx.strokeStyle = '#013e4e';
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Interest arc (gold)
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle + principalAngle, startAngle + principalAngle + interestAngle);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Center text
  ctx.fillStyle = '#272727';
  ctx.font = `bold ${size * 0.08}px Inter, system-ui`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Note: we can hardcode 'Total' or parameterize it. I'll just leave it or use a t() if passed.
  ctx.fillText('Total', cx, cy - size * 0.04);
  ctx.font = `bold ${size * 0.1}px Inter, system-ui`;
  ctx.fillText('₹' + Math.round(total * animProgress).toLocaleString('en-IN'), cx, cy + size * 0.05);
}

export default function ResultsPage() {
  const { t } = useTranslation();
  const emiDetails = useAppStore((s) => s.emiDetails);

  const [loanAmount, setLoanAmount] = useState(emiDetails?.amount || 200000);
  const [interestRate, setInterestRate] = useState(emiDetails?.rate || 6.5);
  const [tenureMonths, setTenureMonths] = useState(60);
  const [moratoriumMonths, setMoratoriumMonths] = useState(emiDetails?.moratorium ?? 6);
  const [result, setResult] = useState<EmiResult | null>(null);
  const [animProgress, setAnimProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fallback to read from URL if Zustand state is lost (e.g. fast refresh or hard load)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('amount')) setLoanAmount(Number(params.get('amount')));
      if (params.has('rate')) setInterestRate(Number(params.get('rate')));
      if (params.has('moratorium')) setMoratoriumMonths(Number(params.get('moratorium')));
    }
  }, []);

  const calculate = async () => {
    // Local calculation for instant UI feedback
    const n = tenureMonths - moratoriumMonths;
    const r = interestRate / (12 * 100);
    let emi: number;
    if (r === 0) {
      emi = loanAmount / n;
    } else {
      emi = loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }
    setResult({
      emi: Math.round(emi * 100) / 100,
      totalPayment: Math.round(emi * n * 100) / 100,
      totalInterest: Math.round((emi * n - loanAmount) * 100) / 100,
      effectiveMonths: n,
    });
    setAnimProgress(0);

    // Try backend for validated result
    try {
      const response = await calculateEmi({
        loan_amount: loanAmount,
        interest_rate: interestRate,
        tenure_months: tenureMonths,
        moratorium_months: moratoriumMonths,
      });
      const data = response.data;
      setResult({
        emi: data.emi,
        totalPayment: data.total_payment,
        totalInterest: data.total_interest,
        effectiveMonths: data.effective_tenure_months,
      });
    } catch (err) {
      // Backend unavailable — local calculation already applied
      console.warn('EMI backend unavailable, using local calculation:', err);
    }
  };

  // Auto-calculate on mount and slider changes
  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanAmount, interestRate, tenureMonths, moratoriumMonths]);

  // Animate donut chart
  useEffect(() => {
    if (!result) return;
    let start: number;
    const duration = 1200;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimProgress(eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [result]);

  // Draw donut on canvas
  useEffect(() => {
    if (!canvasRef.current || !result) return;
    drawDonut(canvasRef.current, loanAmount, result.totalInterest, animProgress, t);
  }, [animProgress, result, loanAmount, t]);

  const formatINR = (val: number) => '₹' + val.toLocaleString('en-IN');

  return (
    <div className="relative min-h-screen bg-hummingbird-gradient overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-100 mix-blend-multiply pointer-events-none">
        <ShaderBackground className="w-full h-full" />
      </div>
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-[#013e4e] mb-4">
            <Calculator size={14} />
            {t('calc.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="text-[#013e4e]">{t('calc.titleHighlight')}</span> {t('calc.title')}
          </h1>
          <p className="text-[#5a5a5a]">{t('calc.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Sliders ── */}
          <div className="space-y-6">
            <GlassCard hover={false} className="p-8 space-y-8">
              {/* Loan Amount */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#5a5a5a] flex items-center gap-2">
                    <IndianRupee size={14} className="text-[#013e4e]" />
                    {t('calc.loanAmt')}
                  </label>
                  <div className="flex items-center justify-end">
                    <span className="text-xl font-bold text-[#013e4e]">₹</span>
                    <input 
                      type="number" 
                      value={loanAmount} 
                      onChange={(e) => setLoanAmount(Number(e.target.value))} 
                      className="text-xl font-bold text-[#013e4e] bg-transparent outline-none border-b border-transparent focus:border-[#013e4e] transition-colors text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ width: `${String(loanAmount).length + 0.5}ch` }}
                      min={10000} max={5000000}
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={10000} max={5000000} step={10000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1">
                  <span>₹10K</span><span>₹50L</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#5a5a5a] flex items-center gap-2">
                    <TrendingUp size={14} className="text-[#013e4e]" />
                    {t('calc.rate')}
                  </label>
                  <div className="flex items-center justify-end">
                    <input 
                      type="number" 
                      value={interestRate} 
                      onChange={(e) => setInterestRate(Number(e.target.value))} 
                      className="text-xl font-bold text-[#013e4e] bg-transparent outline-none border-b border-transparent focus:border-[#013e4e] transition-colors text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ width: `${String(interestRate).length + 0.5}ch` }}
                      min={4} max={15} step={0.5}
                    />
                    <span className="text-xl font-bold text-[#013e4e]">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={4} max={15} step={0.5}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1">
                  <span>4%</span><span>15%</span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#5a5a5a] flex items-center gap-2">
                    <Clock size={14} className="text-blue-400" />
                    {t('calc.tenure')}
                  </label>
                  <div className="flex items-center justify-end">
                    <input 
                      type="number" 
                      value={tenureMonths} 
                      onChange={(e) => setTenureMonths(Number(e.target.value))} 
                      className="text-xl font-bold text-blue-300 bg-transparent outline-none border-b border-transparent focus:border-blue-300 transition-colors text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ width: `${String(tenureMonths).length + 1}ch` }}
                      min={12} max={120} step={6}
                    />
                    <span className="text-xl font-bold text-blue-300 ml-1">{t('common.months')}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={12} max={120} step={6}
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1">
                  <span>1 {t('calc.yr')}</span><span>10 {t('calc.yrs')}</span>
                </div>
              </div>

              {/* Moratorium */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#5a5a5a] flex items-center gap-2">
                    <Clock size={14} className="text-[#013e4e]" />
                    {t('calc.moratorium')}
                  </label>
                  <div className="flex items-center justify-end">
                    <input 
                      type="number" 
                      value={moratoriumMonths} 
                      onChange={(e) => setMoratoriumMonths(Number(e.target.value))} 
                      className="text-xl font-bold text-emerald-300 bg-transparent outline-none border-b border-transparent focus:border-emerald-300 transition-colors text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ width: `${String(moratoriumMonths).length + 1}ch` }}
                      min={0} max={12} step={1}
                    />
                    <span className="text-xl font-bold text-emerald-300 ml-1">{t('common.months')}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0} max={12} step={1}
                  value={moratoriumMonths}
                  onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1">
                  <span>0</span><span>12 {t('common.months')}</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ── Right: Results ── */}
          <div className="space-y-6">
            {/* Donut chart */}
            <GlassCard hover={false} className="p-8 flex flex-col items-center">
              <canvas
                ref={canvasRef}
                className="w-56 h-56 sm:w-64 sm:h-64"
              />
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#013e4e]" />
                  <span className="text-xs text-[#5a5a5a]">{t('calc.chart.principal')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs text-[#5a5a5a]">{t('calc.chart.interest')}</span>
                </div>
              </div>
            </GlassCard>

            {/* EMI result cards */}
            {result && (
              <div className="grid grid-cols-2 gap-4">
                <GlassCard hover={false} glow="gold" className="p-5">
                  <p className="text-xs text-[#5a5a5a] mb-1">{t('calc.res.emi')}</p>
                  <p className="text-2xl font-bold text-[#013e4e]">{formatINR(result.emi)}</p>
                </GlassCard>
                <GlassCard hover={false} className="p-5">
                  <p className="text-xs text-[#5a5a5a] mb-1">{t('calc.res.totalPay')}</p>
                  <p className="text-2xl font-bold text-[#272727]">{formatINR(result.totalPayment)}</p>
                </GlassCard>
                <GlassCard hover={false} className="p-5">
                  <p className="text-xs text-[#5a5a5a] mb-1">{t('calc.res.totalInt')}</p>
                  <p className="text-xl font-bold text-[#013e4e]">{formatINR(result.totalInterest)}</p>
                </GlassCard>
                <GlassCard hover={false} className="p-5">
                  <p className="text-xs text-[#5a5a5a] mb-1">{t('calc.res.repayPeriod')}</p>
                  <p className="text-xl font-bold text-[#013e4e]">{result.effectiveMonths} {t('common.months')}</p>
                </GlassCard>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
