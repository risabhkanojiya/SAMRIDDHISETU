'use client';

import { ShaderBackground } from "@/components/ui/neuro-noise";

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, GraduationCap, Briefcase, Tractor, Store, Home, CheckCircle, Upload, Loader2, ExternalLink } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import StepProgress from '@/components/StepProgress';
import { useAppStore } from '@/store/useAppStore';
import Link from 'next/link';
import MotionButton from '@/components/ui/motion-button';
import { getRecommendation } from '@/lib/api';
import { useTranslation } from '@/lib/I18nProvider';

const PROJECT_TYPES = [
  { value: 'micro_enterprise', label: 'Micro Enterprise', desc: 'Small business up to ₹1.40 Lakh', icon: Store },
  { value: 'small_business', label: 'Small Business', desc: 'Business loans up to ₹50 Lakh', icon: Briefcase },
  { value: 'education', label: 'Education', desc: 'Higher education & professional courses', icon: GraduationCap },
  { value: 'agriculture', label: 'Agriculture', desc: 'Farm, dairy, and agri-allied activities', icon: Tractor },
  { value: 'housing', label: 'Housing', desc: 'Home construction & renovation', icon: Home },
];

const EDUCATION_OPTIONS = [
  { value: 'below_10th', label: 'Below 10th' },
  { value: '10th_pass', label: '10th Pass' },
  { value: '12th_pass', label: '12th Pass' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'post_graduate', label: 'Post Graduate' },
];

interface SchemeResult {
  name: string;
  maxAmount: number;
  interestRate: string;
  moratorium: number;
  requiredDocs: string[];
  confidence: number;
}

function getSchemeResult(
  projectType: string,
  cost: number,
  income: number,
  education: string
): SchemeResult {
  if (projectType === 'education' || education === 'post_graduate') {
    return {
      name: 'Education Loan Scheme',
      maxAmount: 2000000,
      interestRate: '4% (for girls) / 6%',
      moratorium: 12,
      requiredDocs: ['AADHAR', 'CASTE_CERT', 'INCOME_CERT', 'ADMISSION_LETTER'],
      confidence: 94,
    };
  }
  if (cost <= 140000 || projectType === 'micro_enterprise') {
    return {
      name: 'Micro Credit Finance (MCF)',
      maxAmount: 140000,
      interestRate: '5% - 6%',
      moratorium: 3,
      requiredDocs: ['AADHAR', 'CASTE_CERT', 'INCOME_CERT'],
      confidence: 97,
    };
  }
  if (projectType === 'housing') {
    return {
      name: 'Housing Loan Scheme',
      maxAmount: 2500000,
      interestRate: '6%',
      moratorium: 6,
      requiredDocs: ['AADHAR', 'CASTE_CERT', 'INCOME_CERT', 'PROJECT_REPORT'],
      confidence: 89,
    };
  }
  return {
    name: 'Term Loan Scheme',
    maxAmount: 5000000,
    interestRate: '6% - 8%',
    moratorium: 6,
    requiredDocs: ['AADHAR', 'CASTE_CERT', 'INCOME_CERT', 'PROJECT_REPORT'],
    confidence: 91,
  };
}

export default function RecommendPage() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(200000);
  const [annualIncome, setAnnualIncome] = useState(250000);
  const [educationStatus, setEducationStatus] = useState('');
  const [result, setResult] = useState<SchemeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setRecommendedScheme = useAppStore((s) => s.setRecommendedScheme);
  const setEmiDetails = useAppStore((s) => s.setEmiDetails);
  const { t } = useTranslation();

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
        };
        setResult(res);
        setRecommendedScheme(res.name);
        setEmiDetails({
          amount: res.maxAmount,
          rate: parseFloat(res.interestRate) || 6.5,
          moratorium: res.moratorium
        });
      } catch (err) {
        console.warn('Backend unavailable, using local fallback:', err);
        const res = getSchemeResult(projectType, estimatedCost, annualIncome, educationStatus);
        setResult(res);
        setRecommendedScheme(res.name);
        setEmiDetails({
          amount: res.maxAmount,
          rate: parseFloat(res.interestRate) || 6.5,
          moratorium: res.moratorium
        });
        setError('Used offline mode — backend was unreachable.');
      } finally {
        setLoading(false);
        setStep(4);
      }
    }
  };

  const formatINR = (val: number) => '₹' + val.toLocaleString('en-IN');

  return (
    <div className="relative min-h-screen bg-hummingbird-gradient overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-100 mix-blend-multiply pointer-events-none">
        <ShaderBackground className="w-full h-full" />
      </div>
      <div className="relative z-10 pt-24 pb-16 px-4">
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
            labels={[t('recommend.prog.proj'), t('recommend.prog.fin'), t('recommend.prog.edu'), t('recommend.prog.res')]}
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
                          {pt.value === 'micro_enterprise' ? t('recommend.proj.micro') : pt.value === 'small_business' ? t('recommend.proj.small') : pt.value === 'education' ? t('recommend.proj.edu') : pt.value === 'agriculture' ? t('recommend.proj.agri') : t('recommend.proj.house')}
                        </h3>
                        <p className="text-[13px] leading-relaxed text-[#5a5a5a]">{pt.value === 'micro_enterprise' ? t('recommend.proj.microDesc') : pt.value === 'small_business' ? t('recommend.proj.smallDesc') : pt.value === 'education' ? t('recommend.proj.eduDesc') : pt.value === 'agriculture' ? t('recommend.proj.agriDesc') : t('recommend.proj.houseDesc')}</p>
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
                  <label className="text-sm font-semibold text-[#272727] uppercase tracking-wide">{t('recommend.fin.cost')}</label>
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
                  <label className="text-sm font-semibold text-[#272727] uppercase tracking-wide">{t('recommend.fin.income')}</label>
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
              {EDUCATION_OPTIONS.map((edu) => {
                const selected = educationStatus === edu.value;
                return (
                  <div
                    key={edu.value}
                    onClick={() => setEducationStatus(edu.value)}
                    className={`p-4 rounded-xl cursor-pointer flex items-center gap-4 transition-all duration-200 bg-white border hover:shadow-sm ${
                      selected
                        ? 'border-[#013e4e] ring-1 ring-[#013e4e] bg-[#013e4e]/5'
                        : 'border-black/5 hover:border-[#013e4e]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#013e4e]' : 'border-gray-300'}`}>
                          {selected && <div className="w-2 h-2 rounded-full bg-[#013e4e]" />}
                        </div>
                        <h3 className={`font-semibold ${selected ? 'text-[#013e4e]' : 'text-[#272727]'}`}>
                          {edu.value === 'below_10th' ? t('recommend.edu.b10') : edu.value === '10th_pass' ? t('recommend.edu.10') : edu.value === '12th_pass' ? t('recommend.edu.12') : edu.value === 'graduate' ? t('recommend.edu.grad') : t('recommend.edu.pg')}
                        </h3>
                      </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Loading State ── */}
        {loading && (
          <div className="animate-fade-in-up flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-[#013e4e] animate-spin mb-4" />
            <p className="text-lg font-semibold text-[#272727]">{t('recommend.loading.title')}</p>
            <p className="text-sm text-[#5a5a5a] mt-1">{t('recommend.loading.desc')}</p>
          </div>
        )}

        {/* ── STEP 4: Result ── */}
        {step === 4 && result && !loading && (
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
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#013e4e] to-[#1a6b80]">
                  {result.name}
                </h2>
                <p className="text-[#5a5a5a] text-base mb-8">
                  Based on your profile, this is the best NSFDC scheme for you.
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
                </div>

                {/* Required docs */}
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-[#272727] mb-4">{t('recommend.res.reqDocs')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.requiredDocs.map((doc) => (
                      <span key={doc} className="px-4 py-1.5 bg-white border border-[#013e4e]/20 rounded-full text-xs font-semibold text-[#013e4e]">
                        {doc.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                  <MotionButton href={`/results?amount=${result.maxAmount}&rate=${parseFloat(result.interestRate) || 6.5}&moratorium=${result.moratorium}`} label={t('recommend.btn.calc')} classes="w-full sm:w-auto" />
                  <Link href="/vault" className="bg-white text-[#013e4e] px-7 py-3.5 rounded-[30px] font-medium text-base border border-[#e5e7eb] transition-all duration-500 ease-out hover:bg-[#013e4e] hover:text-white hover:border-[#013e4e] flex justify-center items-center gap-2 shadow-sm hover:shadow-md w-full sm:w-auto">
                    <Upload size={16} /> {t('recommend.btn.upload')}
                  </Link>
                  <Link href="/locator" className="bg-white text-[#013e4e] px-7 py-3.5 rounded-[30px] font-medium text-base border border-[#e5e7eb] transition-all duration-500 ease-out hover:bg-[#013e4e] hover:text-white hover:border-[#013e4e] flex justify-center items-center gap-2 shadow-sm hover:shadow-md w-full sm:w-auto">
                    <MapPin size={16} /> {t('recommend.btn.find')}
                  </Link>
                  <a href="https://nsfdc.nic.in" target="_blank" rel="noopener noreferrer" className="bg-white text-[#013e4e] px-7 py-3.5 rounded-[30px] font-medium text-base border border-[#e5e7eb] transition-all duration-500 ease-out hover:bg-[#013e4e] hover:text-white hover:border-[#013e4e] flex justify-center items-center gap-2 shadow-sm hover:shadow-md w-full sm:w-auto">
                    <ExternalLink size={16} /> Apply Now
                  </a>
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
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
            >
              {step === 3 ? t('recommend.btn.ai') : t('common.next')}
              {step === 3 ? <Sparkles size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setStep(1);
                setResult(null);
                setProjectType('');
                setEducationStatus('');
              }}
              className="text-sm font-semibold text-[#5a5a5a] hover:text-[#013e4e] transition-colors"
            >
              {t('recommend.startOver')}
            </button>
          </div>
        )}
      </div>
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
