'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, GraduationCap, Briefcase, Tractor, Store, Home, CheckCircle, Loader2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import StepProgress from '@/components/StepProgress';
import { useAppStore } from '@/store/useAppStore';
import { getRecommendation } from '@/lib/api';
import Link from 'next/link';
import { useTranslation } from '@/lib/I18nProvider';

export default function RecommendPage() {
  const { t } = useTranslation();

  const PROJECT_TYPES = [
    { value: 'micro_enterprise', label: t('recommend.proj.micro'), desc: t('recommend.proj.microDesc'), icon: Store },
    { value: 'small_business', label: t('recommend.proj.small'), desc: t('recommend.proj.smallDesc'), icon: Briefcase },
    { value: 'education', label: t('recommend.proj.edu'), desc: t('recommend.proj.eduDesc'), icon: GraduationCap },
    { value: 'agriculture', label: t('recommend.proj.agri'), desc: t('recommend.proj.agriDesc'), icon: Tractor },
    { value: 'housing', label: t('recommend.proj.house'), desc: t('recommend.proj.houseDesc'), icon: Home },
  ];

  const EDUCATION_OPTIONS = [
    { value: 'below_10th', label: t('recommend.edu.b10') },
    { value: '10th_pass', label: t('recommend.edu.10') },
    { value: '12th_pass', label: t('recommend.edu.12') },
    { value: 'graduate', label: t('recommend.edu.grad') },
    { value: 'post_graduate', label: t('recommend.edu.pg') },
  ];

  interface SchemeResult {
    name: string;
    maxAmount: number;
    interestRate: string;
    moratorium: number;
    requiredDocs: string[];
    confidence: number;
    rationale: string;
    isEligible: boolean;
    maxRepaymentYears: number;
  }

  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(200000);
  const [annualIncome, setAnnualIncome] = useState(250000);
  const [educationStatus, setEducationStatus] = useState('');
  const [result, setResult] = useState<SchemeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setRecommendedScheme = useAppStore((s) => s.setRecommendedScheme);

  const canProceed = () => {
    if (step === 1) return projectType !== '';
    if (step === 2) return true;
    if (step === 3) return educationStatus !== '';
    return true;
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (step === 3) {
      setLoading(true);
      setError(null);
      try {
        const response = await getRecommendation({
          project_type: projectType,
          estimated_cost: estimatedCost,
          annual_income: annualIncome,
          education_status: educationStatus,
        });
        const data = response.data;
        const res: SchemeResult = {
          name: data.recommended_scheme_name,
          maxAmount: data.max_eligible_loan,
          interestRate: `${data.interest_rate_pct}%`,
          moratorium: data.moratorium_months,
          requiredDocs: ['AADHAR', 'CASTE_CERT', 'INCOME_CERT'],
          confidence: data.is_eligible ? 95 : 0,
          rationale: data.rationale,
          isEligible: data.is_eligible,
          maxRepaymentYears: data.max_repayment_years,
        };
        setResult(res);
        setRecommendedScheme(res.name);
        setStep(4);
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Failed to get AI recommendation. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatINR = (val: number) => '₹' + val.toLocaleString('en-IN');

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-hummingbird-gradient">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e5e7eb] shadow-sm text-xs font-semibold text-[#013e4e] mb-4">
            <Sparkles size={14} />
            {t('recommend.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[#272727]">
            {t('recommend.title')} <span className="text-[#013e4e]">{t('recommend.titleHighlight')}</span>
          </h1>
          <p className="text-[#5a5a5a] text-lg">{t('recommend.desc')}</p>
        </div>

        {/* Step Progress */}
        <div className="mb-10">
          <StepProgress
            currentStep={step}
            totalSteps={4}
            labels={[t('recommend.step.project'), t('recommend.step.finance'), t('recommend.step.edu'), 'Result']}
          />
        </div>

        {/* ── STEP 1: Project Type ── */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-[#272727] mb-2">{t('recommend.step.project')}</h2>
            <p className="text-[#5a5a5a] text-sm mb-6">{t('recommend.step.projectDesc')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROJECT_TYPES.map((pt) => {
                const Icon = pt.icon;
                const selected = projectType === pt.value;
                return (
                  <div
                    key={pt.value}
                    onClick={() => setProjectType(pt.value)}
                    className={`p-5 rounded-[20px] bg-white border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selected
                        ? 'border-[#013e4e] shadow-md ring-1 ring-[#013e4e]'
                        : 'border-black/5 shadow-sm hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 transition-all ${
                        selected
                          ? 'bg-[#013e4e] text-white'
                          : 'bg-black/5 text-[#5a5a5a]'
                      }`}>
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className={`font-bold mb-1 text-base ${selected ? 'text-[#013e4e]' : 'text-[#272727]'}`}>
                          {pt.label}
                        </h3>
                        <p className="text-[13px] leading-relaxed text-[#5a5a5a]">{pt.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: Cost & Income ── */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-[#272727] mb-2">{t('recommend.step.finance')}</h2>
            <p className="text-[#5a5a5a] text-sm mb-8">{t('recommend.step.financeDesc')}</p>

            <div className="bg-white rounded-[20px] p-8 space-y-8 border border-black/5 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#5a5a5a]">{t('recommend.fin.cost')}</label>
                  <span className="text-lg font-bold text-[#013e4e]">{formatINR(estimatedCost)}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={5000000}
                  step={10000}
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  className="w-full accent-[#013e4e]"
                />
                <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1">
                  <span>₹10K</span>
                  <span>₹50L</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#5a5a5a]">{t('recommend.fin.income')}</label>
                  <span className="text-lg font-bold text-[#013e4e]">{formatINR(annualIncome)}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={500000}
                  step={10000}
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full accent-[#013e4e]"
                />
                <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1">
                  <span>₹50K</span>
                  <span>₹5L</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Education ── */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-[#272727] mb-2">{t('recommend.step.edu')}</h2>
            <p className="text-[#5a5a5a] text-sm mb-6">{t('recommend.step.eduDesc')}</p>

            <div className="space-y-3">
              {EDUCATION_OPTIONS.map((opt) => {
                const selected = educationStatus === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => setEducationStatus(opt.value)}
                    className={`p-4 rounded-xl cursor-pointer flex items-center gap-4 transition-all duration-200 bg-white border hover:shadow-sm ${
                      selected
                        ? 'border-[#013e4e] ring-1 ring-[#013e4e] bg-[#013e4e]/5'
                        : 'border-black/5 hover:border-[#013e4e]/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selected
                        ? 'border-[#013e4e] bg-[#013e4e]'
                        : 'border-slate-300'
                    }`}>
                      {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className={`font-medium ${selected ? 'text-[#013e4e]' : 'text-[#5a5a5a]'}`}>
                      {opt.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Loading State ── */}
        {loading && (
          <div className="animate-fade-in-up text-center py-16">
            <Loader2 size={48} className="animate-spin text-[#013e4e] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#272727] mb-2">{t('recommend.loading.title')}</h2>
            <p className="text-[#5a5a5a]">{t('recommend.loading.desc')}</p>
          </div>
        )}

        {/* ── Error State ── */}
        {error && !loading && (
          <div className="animate-fade-in-up bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
            <p className="text-red-700 font-medium mb-3">{error}</p>
            <button
              onClick={() => { setError(null); setStep(3); }}
              className="text-sm text-red-600 underline hover:text-red-800"
            >
              {t('recommend.startOver')}
            </button>
          </div>
        )}

        {/* ── STEP 4: Result ── */}
        {step === 4 && result && (
          <div className="animate-scale-in">
            <div className="bg-white rounded-[24px] p-8 relative overflow-hidden border border-black/5 shadow-xl shadow-black/5">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#013e4e]/10 to-transparent rounded-bl-full -z-10 pointer-events-none" />

              <div className="relative z-10">
                {/* Confidence badge */}
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle size={20} className="text-[#013e4e]" />
                  <span className="text-sm text-[#013e4e] font-bold">
                    {result.confidence}% {t('recommend.res.match')}
                  </span>
                </div>

                {/* Scheme name */}
                <h2 className="text-3xl sm:text-4xl font-bold text-[#272727] mb-3">
                  {result.name}
                </h2>
                <p className="text-[#5a5a5a] text-base mb-8">
                  {result.rationale || 'Based on your profile, this is the best NSFDC scheme for you.'}
                </p>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-[#f4f4f1] p-4 rounded-xl border border-black/5">
                    <p className="text-xs font-semibold text-[#5a5a5a] mb-1 uppercase tracking-wider">{t('recommend.res.maxAmt')}</p>
                    <p className="text-xl font-bold text-[#013e4e]">
                      ₹{result.maxAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-[#f4f4f1] p-4 rounded-xl border border-black/5">
                    <p className="text-xs font-semibold text-[#5a5a5a] mb-1 uppercase tracking-wider">{t('recommend.res.rate')}</p>
                    <p className="text-xl font-bold text-[#013e4e]">{result.interestRate}</p>
                  </div>
                  <div className="bg-[#f4f4f1] p-4 rounded-xl border border-black/5">
                    <p className="text-xs font-semibold text-[#5a5a5a] mb-1 uppercase tracking-wider">{t('recommend.res.moratorium')}</p>
                    <p className="text-xl font-bold text-[#013e4e]">{result.moratorium} {t('common.months')}</p>
                  </div>
                  <div className="bg-[#f4f4f1] p-4 rounded-xl border border-black/5">
                    <p className="text-xs font-semibold text-[#5a5a5a] mb-1 uppercase tracking-wider">{t('recommend.res.maxTenure')}</p>
                    <p className="text-xl font-bold text-[#013e4e]">{result.maxRepaymentYears} {t('common.years')}</p>
                  </div>
                </div>

                {/* Required docs */}
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-[#272727] mb-4">{t('recommend.res.reqDocs')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.requiredDocs.map((doc: string) => (
                      <span key={doc} className="px-4 py-1.5 bg-white border border-[#013e4e]/20 rounded-full text-xs font-semibold text-[#013e4e]">
                        {doc.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/results" className="bg-[#013e4e] text-white hover:bg-[#1a6b80] transition-colors rounded-full px-6 py-3 font-semibold text-center flex items-center justify-center gap-2">
                    {t('recommend.btn.calc')}
                    <ArrowRight size={18} />
                  </Link>
                  <Link href="/vault" className="bg-white border border-[#013e4e]/20 text-[#013e4e] hover:bg-[#013e4e]/5 transition-colors rounded-full px-6 py-3 font-semibold text-center flex items-center justify-center gap-2">
                    {t('recommend.btn.upload')}
                  </Link>
                  <Link href="/locator" className="bg-white border border-[#013e4e]/20 text-[#013e4e] hover:bg-[#013e4e]/5 transition-colors rounded-full px-6 py-3 font-semibold text-center flex items-center justify-center gap-2">
                    <MapPin size={18} />
                    {t('recommend.btn.find')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="btn-ghost flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft size={16} />
              {t('common.back')}
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> {t('recommend.loading.title')}</>
              ) : step === 3 ? (
                <><Sparkles size={16} /> {t('recommend.btn.ai')}</>
              ) : (
                <>{t('common.next')} <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => { setStep(1); setResult(null); setProjectType(''); setEducationStatus(''); }}
              className="text-sm text-[#5a5a5a] hover:text-[#013e4e] transition-colors"
            >
              {t('recommend.startOver')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MapPin(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
