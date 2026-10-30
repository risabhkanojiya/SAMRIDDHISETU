'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // --- Liquid Physics Background Logic ---
    const [mounted, setMounted] = useState(false);
    const [blobsData, setBlobsData] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        setBlobsData(
            Array.from({ length: 5 }).map(() => ({
                size: Math.random() * 250 + 150,
                left: Math.random() * 80 + 10,
                top: Math.random() * 80 + 10,
                animationDelay: Math.random() * -20,
                animationDuration: Math.random() * 15 + 15,
            }))
        );
    }, []);

    // Keep track of the blob DOM elements for high-performance updates
    const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            // Apply subtle parallax effect to each blob
            blobRefs.current.forEach((blob, index) => {
                if (blob) {
                    const speed = (index + 1) * 20;
                    // Using margins for parallax so we don't overwrite the CSS transform animation
                    blob.style.marginLeft = `${x * speed}px`;
                    blob.style.marginTop = `${y * speed}px`;
                }
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    // --- Form Logic ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (phone !== '9876543210' || otp !== '1234') {
            setError('Invalid credentials. For demo, use 9876543210 and 1234.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            // Set the authentication cookie to the current server's boot ID
            const bootId = process.env.NEXT_PUBLIC_BOOT_ID || 'true';
            document.cookie = `auth-token=${bootId}; path=/; max-age=86400`; // Expires in 1 day or on server restart
            router.push('/');
        }, 1500);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#f4f4f1] overflow-hidden">
            
            {/* Liquid Physics Styles & Filters */}
            <style>{`
                .stage {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    filter: url('#gooey');
                    opacity: 0.25; /* Subtle background presence */
                    pointer-events: none;
                }

                .blob {
                    position: absolute;
                    background: linear-gradient(135deg, #013e4e, #2bd2ef); /* SamriddhiSetu Teal & Cyan */
                    border-radius: 50%;
                    filter: blur(20px);
                    animation: float 20s infinite alternate ease-in-out;
                    transition: margin 0.1s ease-out;
                }

                @keyframes float {
                    0% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(10vw, 20vh) scale(1.2); }
                    66% { transform: translate(-5vw, 10vh) scale(0.8); }
                    100% { transform: translate(5vw, -10vh) scale(1.1); }
                }
            `}</style>

            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="gooey">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                        <feColorMatrix 
                            in="blur" 
                            mode="matrix" 
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" 
                            result="goo" 
                        />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
                    </filter>
                </defs>
            </svg>

            {/* Liquid Physics Blobs */}
            <div className="stage" id="stage">
                {mounted && blobsData.map((data, index) => (
                    <div
                        key={index}
                        ref={(el) => {
                            if (el) blobRefs.current[index] = el;
                        }}
                        className="blob"
                        style={{
                            width: `${data.size}px`,
                            height: `${data.size}px`,
                            left: `${data.left}%`,
                            top: `${data.top}%`,
                            animationDelay: `${data.animationDelay}s`,
                            animationDuration: `${data.animationDuration}s`,
                        }}
                    />
                ))}
            </div>

            {/* Clean Form Card */}
            <div className="relative z-10 w-full max-w-[500px] bg-[#f8faf9]/80 backdrop-blur-xl rounded-[24px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60">
                <h1 className="text-[32px] tracking-tight text-[#1a1a1a] mb-8 font-normal">
                    Secure Login
                </h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[14px] text-[#333] mb-2 font-medium">
                            Phone number*
                        </label>
                        <input 
                            type="tel" 
                            placeholder="9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-12 px-4 rounded-[12px] border border-[#e2e8e4] bg-white text-[15px] text-[#1a1a1a] outline-none transition-all focus:border-[#013e4e] focus:outline-none focus:ring-0 bg-opacity-90"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] text-[#333] mb-2 font-medium">
                            OTP Verification*
                        </label>
                        <input 
                            type="password"
                            placeholder="1234"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full h-12 px-4 rounded-[12px] border border-[#e2e8e4] bg-white text-[15px] text-[#1a1a1a] outline-none transition-all focus:border-[#013e4e] focus:outline-none focus:ring-0 bg-opacity-90"
                        />
                    </div>

                    {error && (
                        <p className="text-[13px] font-medium text-red-500 pt-1">
                            {error}
                        </p>
                    )}

                    <p className="text-[13px] leading-relaxed text-[#5a5a5a] pt-2">
                        By logging in, you agree to the processing of your personal data by SamriddhiSetu as described in the <a href="#" className="text-[#3b82f6] hover:underline">Privacy Statement</a>. You may safely log out at any time.
                    </p>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary inline-flex items-center gap-2 !px-6 !py-3 !rounded-[12px] !font-medium !text-[15px] mt-2 disabled:opacity-70"
                    >
                        {loading ? 'Verifying...' : 'Login now'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
