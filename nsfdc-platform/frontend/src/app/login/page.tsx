'use client';

import { useState, useRef, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import ParticleBackground from '@/components/ParticleBackground';
import { Phone, ArrowRight, CheckCircle, Shield } from 'lucide-react';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = () => {
    if (phoneNumber.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every((d) => d !== '') && newOtp.join('').length === 6) {
      setVerifying(true);
      setTimeout(() => {
        setVerifying(false);
        setVerified(true);
      }, 1500);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Auto-focus first OTP input
  useEffect(() => {
    if (otpSent) {
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    }
  }, [otpSent]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <ParticleBackground particleCount={30} />

      {/* Ambient orbs */}
      <div className="orb orb-violet w-[400px] h-[400px] -top-20 -left-40" />
      <div className="orb orb-gold w-[300px] h-[300px] -bottom-20 -right-20" />

      <div className="relative z-10 w-full max-w-md">
        {/* Success State */}
        {verified ? (
          <div className="animate-scale-in text-center">
            <GlassCard hover={false} glow="violet" className="p-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome!</h2>
              <p className="text-slate-400 mb-6">
                You're now logged in. Your Digi-Vault is ready.
              </p>
              <a href="/vault" className="btn-gold inline-flex items-center gap-2">
                Go to Digi-Vault
                <ArrowRight size={16} />
              </a>
            </GlassCard>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-amber-400 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-violet-500/20">
                SS
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {otpSent ? 'Enter OTP' : 'Welcome Back'}
              </h1>
              <p className="text-sm text-slate-400">
                {otpSent
                  ? `We sent a 6-digit code to +91 ${phoneNumber}`
                  : 'Login with your phone number'
                }
              </p>
            </div>

            <GlassCard hover={false} className="p-8 animate-border-glow">
              {!otpSent ? (
                /* ── Phone Input ── */
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="input-glass !w-20 text-center text-slate-400 flex items-center justify-center">
                        +91
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        className="input-glass flex-1"
                        maxLength={10}
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={phoneNumber.length < 10}
                    className="w-full btn-primary flex items-center justify-center gap-2 !py-3.5 text-base disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Phone size={18} />
                    Send OTP
                  </button>

                  <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                    <Shield size={12} />
                    Secured with end-to-end encryption
                  </div>
                </div>
              ) : (
                /* ── OTP Input ── */
                <div className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl transition-all duration-300 outline-none ${
                          digit
                            ? 'input-glass !border-violet-500 !bg-violet-500/10 text-white'
                            : 'input-glass'
                        } ${verifying ? 'animate-pulse' : ''}`}
                      />
                    ))}
                  </div>

                  {verifying && (
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-violet-300 mt-2">Verifying...</p>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      onClick={() => { setOtpSent(false); setOtp(['', '', '', '', '', '']); }}
                      className="text-xs text-slate-400 hover:text-violet-300 transition-colors"
                    >
                      ← Change phone number
                    </button>
                  </div>

                  <div className="text-center">
                    <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                      Didn&apos;t receive OTP? Resend in 30s
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
