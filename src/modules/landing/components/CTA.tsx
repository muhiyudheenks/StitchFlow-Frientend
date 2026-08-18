'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setAuthIntent } from '@/store/slices/appSlice';
import { FiArrowRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { TbBuildingFactory2 } from 'react-icons/tb';

export default function CTA() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSignIn = () => {
        dispatch(setAuthIntent('signin'));
        router.push('/login');
    };

    return (
        <section className="relative py-24 bg-[#FAFAFC] overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-10 sm:p-16 md:p-20 text-center shadow-2xl border border-white/10"
                >
                    {/* Glowing Radial Background Blobs */}
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-500/30 blur-[130px] pointer-events-none" />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/30 blur-[130px] pointer-events-none" />

                    {/* Subtle Grid Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                        {/* Small Illustration / Badge */}
                        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-purple-400/30 bg-purple-500/10 backdrop-blur-md px-4 py-2 text-xs font-bold uppercase tracking-widest text-purple-300">
                            <TbBuildingFactory2 size={15} className="text-purple-400" />
                            <span>Enterprise Floor OS</span>
                            <HiSparkles size={12} className="text-purple-400 animate-pulse" />
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
                            Ready to Transform Your Manufacturing Business?
                        </h2>

                        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-10">
                            Join high-yield garment manufacturers optimizing assembly lines, worker schedules, and quality audits with real-time floor intelligence.
                        </p>

                        {/* ONE Sign In Button Only */}
                        <button
                            onClick={handleSignIn}
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-950 font-extrabold text-base hover:bg-purple-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.03] group"
                        >
                            <span>Sign In to StitchFlow</span>
                            <FiArrowRight size={18} className="text-slate-900 group-hover:translate-x-1.5 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
