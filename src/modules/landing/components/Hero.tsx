'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setAuthIntent } from '@/store/slices/appSlice';
import { FiArrowRight, FiCheckCircle, FiActivity, FiUsers } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { motion, Variants } from 'framer-motion';

export default function Hero() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSignIn = () => {
        dispatch(setAuthIntent('signin'));
        router.push('/login');
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.05
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#FAFAFC]">
            {/* Glowing background radial blur blobs - Soft purple/violet tints */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-200/30 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-100/40 blur-[150px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center relative z-10">
                {/* Left Side: Modern Copy & Conversion */}
                <motion.div
                    className="lg:col-span-6 flex flex-col items-start text-left"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Top small badge */}
                    <motion.div
                        variants={itemVariants}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/60 px-4 py-1.5 text-xs font-bold tracking-wider text-purple-700 uppercase"
                    >
                        <HiSparkles size={12} className="text-purple-600 animate-pulse" />
                        AI-Powered Operations
                    </motion.div>

                    {/* Large Heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900 mb-6"
                    >
                        Manufacturing Operations,{' '}
                        <span className="bg-gradient-to-r from-primary via-violet-600 to-secondary bg-clip-text text-transparent">
                            Reimagined.
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg text-slate-600 leading-relaxed max-w-xl mb-8"
                    >
                        StitchFlow coordinates factory floor workers, automates shift scheduling, and tracks production throughput in real-time. Gain complete operational clarity from a single dashboard.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10"
                    >
                        <button
                            onClick={handleSignIn}
                            className="group flex h-13 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-7 text-sm font-bold text-white shadow-md hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all duration-250"
                        >
                            Sign In
                            <FiArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <a
                            href="#features"
                            className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/70 hover:bg-white px-7 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 active:scale-[0.99]"
                        >
                            Learn More
                        </a>
                    </motion.div>

                    {/* Below buttons trust points */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-slate-200/60 w-full max-w-xl"
                    >
                        <div className="flex items-center gap-2 text-slate-650">
                            <FiCheckCircle size={16} className="text-purple-600" />
                            <span className="text-xs font-semibold">Real-time scheduling</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-650">
                            <FiCheckCircle size={16} className="text-purple-600" />
                            <span className="text-xs font-semibold">99.9% uptime guaranteed</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-650">
                            <FiCheckCircle size={16} className="text-purple-600" />
                            <span className="text-xs font-semibold">Enterprise grade security</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Side: Abstract Illustration (Floating Cards & Connecting Paths) */}
                <div className="lg:col-span-6 relative h-[520px] w-full flex items-center justify-center select-none">
                    {/* SVG Connector Net with glowing lines */}
                    <svg className="absolute inset-0 w-full h-full text-purple-200/70" xmlns="http://www.w3.org/2000/svg">
                        <line x1="15%" y1="20%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" />
                        <line x1="85%" y1="18%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" />
                        <line x1="10%" y1="75%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" />
                        <line x1="90%" y1="70%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" />
                        <line x1="50%" y1="10%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" />
                        <circle cx="50%" cy="50%" r="5" fill="#7C3AED" className="animate-ping" />
                        <circle cx="50%" cy="50%" r="3" fill="#7C3AED" />
                    </svg>

                    {/* Center suggestion bubble */}
                    <div className="absolute w-[240px] h-[240px] rounded-full bg-gradient-to-br from-purple-100 to-indigo-50/50 blur-[45px] pointer-events-none" />

                    {/* 1. Employee Management Widget (Top Left) */}
                    <motion.div
                        className="absolute top-[8%] left-[2%] w-[220px] rounded-2xl border border-black/[0.04] bg-white/80 backdrop-blur-md p-4 shadow-[0_12px_30px_rgba(0,0,0,0.03)] animate-float-slow"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                                <FiUsers size={16} />
                            </div>
                            <div>
                                <h4 className="text-[12px] font-bold text-slate-800">Shift Roster</h4>
                                <p className="text-[10px] text-slate-500">124 Floor Workers Active</p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[10px] border-t border-slate-100 pt-2 text-slate-500">
                            <span>Status</span>
                            <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">All Cleared</span>
                        </div>
                    </motion.div>

                    {/* 2. Production Tracker Widget (Top Right) */}
                    <motion.div
                        className="absolute top-[3%] right-[3%] w-[230px] rounded-2xl border border-black/[0.04] bg-white/80 backdrop-blur-md p-4 shadow-[0_12px_30px_rgba(0,0,0,0.03)] animate-float"
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                    >
                        <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <FiActivity size={13} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Line Efficiency</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+8.2%</span>
                        </div>
                        <div className="text-lg font-extrabold text-slate-850">96.4 pcs / hr</div>
                    </motion.div>

                    {/* 3. Attendance Status Widget (Bottom Left) */}
                    <motion.div
                        className="absolute bottom-[10%] left-[4%] w-[210px] rounded-2xl border border-black/[0.04] bg-white/80 backdrop-blur-md p-4 shadow-[0_12px_30px_rgba(0,0,0,0.03)] animate-float-fast"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="20" cy="20" r="16" className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="transparent" />
                                    <circle cx="20" cy="20" r="16" className="text-purple-600" strokeWidth="3.5" strokeDasharray={2 * Math.PI * 16} strokeDashoffset={2 * Math.PI * 16 * (1 - 0.95)} strokeLinecap="round" stroke="currentColor" fill="transparent" />
                                </svg>
                                <span className="absolute text-[9px] font-extrabold text-slate-850">95%</span>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-slate-850">Attendance</h4>
                                <p className="text-[10px] text-slate-400">Shift A Present</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* 4. Inventory Alert Widget (Bottom Right) */}
                    <motion.div
                        className="absolute bottom-[5%] right-[2%] w-[240px] rounded-2xl border border-black/[0.04] bg-white/80 backdrop-blur-md p-4 shadow-[0_12px_30px_rgba(0,0,0,0.03)] animate-float-slow"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.45 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inventory Levels</span>
                            <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Cotton Thread</span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-500">Available Reels</span>
                                <span className="text-slate-800 font-bold">14,250 / 15k</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: '95%' }} />
                            </div>
                        </div>
                    </motion.div>

                    {/* 5. AI Suggestions Node (Middle Top) */}
                    <motion.div
                        className="absolute top-[28%] left-[30%] w-[180px] rounded-xl border border-purple-100 bg-purple-50/90 backdrop-blur-sm p-3 shadow-md animate-float"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <div className="flex items-center gap-2 text-purple-700 font-bold text-[10px]">
                            <HiSparkles size={11} className="text-purple-600 animate-spin-slow" />
                            <span>AI SUGGESTION</span>
                        </div>
                        <p className="text-[10px] text-slate-650 mt-1 leading-snug">Line B output optimized. Bottleneck cleared.</p>
                    </motion.div>

                    {/* 6. Reports Mini Graph (Middle Right) */}
                    <motion.div
                        className="absolute top-[35%] right-[6%] w-[160px] rounded-xl border border-black/[0.04] bg-white/90 p-3 shadow-md animate-float-fast"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Batch Progress</div>
                        <div className="text-[12px] font-bold text-slate-800 mb-2">99.2% Completed</div>
                        <div className="h-4 w-full flex items-end gap-1">
                            <div className="bg-slate-200 w-full h-[40%] rounded-sm" />
                            <div className="bg-slate-200 w-full h-[60%] rounded-sm" />
                            <div className="bg-slate-200 w-full h-[80%] rounded-sm" />
                            <div className="bg-primary w-full h-[99%] rounded-sm" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
