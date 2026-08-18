'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { FiTrendingUp, FiEye, FiZap } from 'react-icons/fi';
import { HiShieldCheck } from 'react-icons/hi2';

function Counter({ value, decimal = 0, suffix = '' }: { value: number; decimal?: number; suffix?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let start = 0;
        const end = value;
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (now: number) => {
            const timeElapsed = now - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const current = start + (end - start) * (1 - (1 - progress) * (1 - progress));
            setCount(current);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }, [isInView, value]);

    return (
        <span ref={ref}>
            {decimal > 0 ? count.toFixed(decimal) : Math.round(count)}
            {suffix}
        </span>
    );
}

export default function Stats() {
    const statsList = [
        {
            numericValue: 38,
            decimal: 0,
            suffix: '%',
            title: 'Throughput Increase',
            description: 'Average gain in daily finished garment units across active lines.',
            icon: FiTrendingUp,
            color: 'text-purple-600 bg-purple-50 border-purple-100',
            badge: '+38% vs Manual Lines'
        },
        {
            numericValue: 64,
            decimal: 0,
            suffix: '%',
            title: 'Defect Rate Reduction',
            description: 'Fewer stitching flaws & material rejections caught in real-time.',
            icon: HiShieldCheck,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            badge: 'Zero-Defect Standard'
        },
        {
            numericValue: 99.9,
            decimal: 1,
            suffix: '%',
            title: 'Real-Time Visibility',
            description: 'Uptime coverage across floor stations, shifts, and workstations.',
            icon: FiEye,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
            badge: 'Live Shop Floor Sync'
        },
        {
            numericValue: 4.2,
            decimal: 1,
            suffix: 'x',
            title: 'Faster Batch Setup',
            description: 'Accelerated style onboarding & operator layout configuration.',
            icon: FiZap,
            color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100',
            badge: 'Instant Shift Start'
        }
    ];

    return (
        <section className="relative py-28 bg-[#FAFAFC] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-purple-100/20 blur-[150px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="text-xs font-extrabold uppercase tracking-[0.2em] text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100"
                    >
                        Proven Operational Impact
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4"
                    >
                        Quantifiable Results for Enterprise Floor Operations
                    </motion.h2>
                </div>

                {/* 4 Large Statistic Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {statsList.map((stat, idx) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className="relative rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-8 shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_rgba(124,58,237,0.08)] hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group"
                        >
                            {/* Card Top Icon & Badge */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`p-3 rounded-2xl border ${stat.color}`}>
                                        <stat.icon size={22} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                        {stat.badge}
                                    </span>
                                </div>

                                {/* Animated Stat Counter */}
                                <div className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight mb-2 group-hover:text-purple-700 transition-colors">
                                    <Counter value={stat.numericValue} decimal={stat.decimal} suffix={stat.suffix} />
                                </div>

                                <h3 className="text-base font-bold text-slate-900 mb-2">
                                    {stat.title}
                                </h3>

                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {stat.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
