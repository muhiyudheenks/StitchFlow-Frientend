'use client';

import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiCpu, FiActivity, FiZap, FiBarChart2 } from 'react-icons/fi';
import { HiShieldCheck } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setAuthIntent } from '@/store/slices/appSlice';

export default function Features() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleAction = () => {
        dispatch(setAuthIntent('signin'));
        router.push('/login');
    };

    return (
        <section id="features" className="relative py-32 bg-[#FAFAFC] overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/3 left-0 w-[600px] h-[600px] rounded-full bg-purple-100/25 blur-[160px] pointer-events-none" />
            <div className="absolute bottom-10 right-0 w-[600px] h-[600px] rounded-full bg-indigo-100/25 blur-[160px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10 space-y-32">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/70 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.15em] text-purple-700 mb-6"
                    >
                        <FiZap size={12} className="text-purple-600 animate-pulse" />
                        Next-Gen Manufacturing Control
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
                    >
                        Engineered for High-Yield Precision Manufacturing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-slate-500 mt-6 leading-relaxed"
                    >
                        Replace disconnected spreadsheets and manual logs with automated real-time floor intelligence designed like software for modern factories.
                    </motion.p>
                </div>

                {/* FEATURE ROW 1 (Apple Product Page Style: Left Graphic, Right Copy) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Left: Large Abstract Graphic Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="lg:col-span-7 relative group"
                    >
                        {/* Graphic Frame Card */}
                        <div className="relative rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 group-hover:border-purple-300 group-hover:shadow-[0_30px_70px_rgba(124,58,237,0.08)]">
                            {/* Graphic Ambient Glow */}
                            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-200/40 blur-[80px] pointer-events-none" />

                            {/* Top Bar Mock Control */}
                            <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                                        <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                                        <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 tracking-wide font-mono">
                                        LINE_BALANCER_NODE_v2.4
                                    </span>
                                </div>
                                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                    OPTIMIZED • 98.4%
                                </span>
                            </div>

                            {/* Abstract Visual Elements */}
                            <div className="space-y-4">
                                {/* Line Workstations Nodes Graphic */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { station: 'Station #01 - Cutting', rate: '142 pcs/hr', status: 'Optimal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                                        { station: 'Station #02 - Collar Stitch', rate: '128 pcs/hr', status: 'Active', color: 'text-purple-600 bg-purple-50 border-purple-200' },
                                        { station: 'Station #03 - Sleeve Join', rate: '135 pcs/hr', status: 'Balanced', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' }
                                    ].map((node, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300">
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{node.station}</div>
                                            <div className="text-lg font-extrabold text-slate-900 mt-1">{node.rate}</div>
                                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-2 ${node.color}`}>
                                                {node.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Dynamic Flow Progress Visual */}
                                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-3 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <FiCpu size={16} className="text-purple-400" />
                                            <span className="text-xs font-bold text-slate-200">Auto-Balancing Engine</span>
                                        </div>
                                        <span className="text-xs font-bold text-purple-300">Tact Time: 42s</span>
                                    </div>

                                    {/* Animated Progress Bar */}
                                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden relative z-10">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 rounded-full"
                                            animate={{ width: ['40%', '85%', '98%'] }}
                                            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                                        />
                                    </div>

                                    <div className="mt-3 flex justify-between text-[11px] text-slate-300 font-mono relative z-10">
                                        <span>Batch #GAR-8092</span>
                                        <span>Target: 2,400 units</span>
                                        <span className="text-emerald-400 font-bold">+14% vs Shift Baseline</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Copy & Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="lg:col-span-5 flex flex-col items-start"
                    >
                        <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100 mb-4">
                            <FiActivity size={14} />
                            Assembly Line Intelligence
                        </div>

                        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
                            Real-Time Assembly Line Balancing & Floor Control
                        </h3>

                        <p className="text-slate-600 text-base leading-relaxed mb-8">
                            Identify assembly line bottlenecks in seconds. StitchFlow automatically analyzes workstation cycle times and suggests instant operator rebalancing to eliminate idle hours and maximize throughput.
                        </p>

                        {/* 3 Feature Bullets */}
                        <div className="space-y-4 mb-8 w-full">
                            {[
                                { title: 'Live Operator Throughput & Tact-Time Analytics', desc: 'Monitor cycle times per workstation in real time.' },
                                { title: 'Automated Bottleneck Detection & Alerting', desc: 'Instant supervisor alerts when work-in-progress builds up.' },
                                { title: 'Dynamic Workstation Workload Distribution', desc: 'Auto-calculate optimal operator assignments per batch.' }
                            ].map((bullet, idx) => (
                                <div key={idx} className="flex gap-3.5 items-start">
                                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                                        <FiCheckCircle size={14} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{bullet.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{bullet.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handleAction}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-xl group"
                        >
                            Explore Line Balancing
                            <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                {/* FEATURE ROW 2 (Alternate Layout: Left Copy, Right Graphic) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Left: Copy & Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="lg:col-span-5 flex flex-col items-start lg:order-1 order-2"
                    >
                        <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100 mb-4">
                            <HiShieldCheck size={14} />
                            Zero-Defect Quality Control
                        </div>

                        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
                            End-to-End Quality Inspection & Defect Intelligence
                        </h3>

                        <p className="text-slate-600 text-base leading-relaxed mb-8">
                            Catch stitching errors, fabric flaws, and measurement mismatches before garments hit final packing. Standardize digital audit checklists and trace quality metrics back to specific workers and machines.
                        </p>

                        {/* 3 Feature Bullets */}
                        <div className="space-y-4 mb-8 w-full">
                            {[
                                { title: 'In-Line Defect Tagging & Root-Cause Analysis', desc: 'Log defective garments with visual reason codes instantly.' },
                                { title: 'Automated Inspector Audit Checklists', desc: 'Standardized digital QMS forms for tablet & mobile kiosks.' },
                                { title: 'Batch Yield & Waste Optimization Dashboards', desc: 'Live yield metrics per style, cutting lot, and floor shift.' }
                            ].map((bullet, idx) => (
                                <div key={idx} className="flex gap-3.5 items-start">
                                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                                        <FiCheckCircle size={14} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{bullet.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{bullet.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handleAction}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-xl group"
                        >
                            Discover Quality Suite
                            <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Right: Large Abstract Graphic Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="lg:col-span-7 relative group lg:order-2 order-1"
                    >
                        {/* Graphic Frame Card */}
                        <div className="relative rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 group-hover:border-purple-300 group-hover:shadow-[0_30px_70px_rgba(124,58,237,0.08)]">
                            {/* Graphic Ambient Glow */}
                            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-200/40 blur-[80px] pointer-events-none" />

                            {/* Top Bar Mock Control */}
                            <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                                        <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                                        <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 tracking-wide font-mono">
                                        QUALITY_AUDIT_STATION_A4
                                    </span>
                                </div>
                                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
                                    DEFECT RATE: 0.42%
                                </span>
                            </div>

                            {/* Abstract Visual Elements */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Inspection Metrics Card */}
                                <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pass Rate Yield</span>
                                            <FiBarChart2 size={16} className="text-emerald-400" />
                                        </div>
                                        <div className="text-3xl font-extrabold text-white tracking-tight">99.58%</div>
                                        <p className="text-xs text-slate-400 mt-1">2,840 inspected / 12 flagged</p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                                        <span>Lot #DF-9921</span>
                                        <span className="text-emerald-400 font-bold">Grade A Target</span>
                                    </div>
                                </div>

                                {/* Defect Distribution Card */}
                                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Inspection Audit Logs</div>

                                        {[
                                            { defect: 'Seam Puckering', count: '4 cases', severity: 'Low' },
                                            { defect: 'Missing Thread Lock', count: '2 cases', severity: 'Medium' },
                                            { defect: 'Fabric Misalignment', count: '1 case', severity: 'Resolved' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-white border border-slate-100">
                                                <span className="font-semibold text-slate-800">{item.defect}</span>
                                                <span className="font-mono text-purple-700 font-bold">{item.count}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-purple-700">
                                        <span>Automated Alert Router</span>
                                        <span>Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
