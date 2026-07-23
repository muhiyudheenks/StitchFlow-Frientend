'use client';

import { motion } from 'framer-motion';
import { FiUsers, FiLayers, FiActivity, FiBox, FiCheck } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { TbCalendarCheck, TbFileSpreadsheet } from 'react-icons/tb';

export default function WhyChoose() {
    const modules = [
        { id: 'emp', name: 'Employees', icon: FiUsers, label: '340 Active Workers', color: 'from-purple-500/20 to-indigo-500/20 border-purple-300 text-purple-300', x: '5%', y: '5%' },
        { id: 'prd', name: 'Products', icon: FiLayers, label: '14 Active Styles', color: 'from-violet-500/20 to-pink-500/20 border-violet-300 text-violet-300', x: '60%', y: '5%' },
        { id: 'pro', name: 'Production', icon: FiActivity, label: '98.4% Efficiency', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-300 text-emerald-300', x: '35%', y: '40%' },
        { id: 'att', name: 'Attendance', icon: TbCalendarCheck, label: '99.2% Clocked In', color: 'from-amber-500/20 to-orange-500/20 border-amber-300 text-amber-300', x: '5%', y: '72%' },
        { id: 'rep', name: 'Reports', icon: TbFileSpreadsheet, label: 'Real-Time Audits', color: 'from-blue-500/20 to-indigo-500/20 border-blue-300 text-blue-300', x: '65%', y: '72%' },
        { id: 'inv', name: 'Inventory', icon: FiBox, label: 'Fabric Stock Synced', color: 'from-fuchsia-500/20 to-pink-500/20 border-fuchsia-300 text-fuchsia-300', x: '72%', y: '38%' },
    ];

    const benefits = [
        'Complete end-to-end operational transparency across floors',
        '35%+ reduction in idle machine time & assembly bottlenecks',
        'Instant audit readiness with zero manual paperwork',
        'Seamless integration for line supervisors, workers, and executives'
    ];

    return (
        <section className="relative py-32 bg-white overflow-hidden border-y border-slate-200/60">
            {/* Ambient Background Gradient Glows */}
            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-100/30 blur-[180px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    
                    {/* Left Column: Heading, Description & Benefits */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-5 flex flex-col items-start"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-700 mb-6">
                            <HiSparkles size={12} className="text-purple-600 animate-pulse" />
                            Unified Data Mesh
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
                            Why Apparel Leaders Choose StitchFlow
                        </h2>

                        <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                            Legacy factory systems store data in isolated silos. StitchFlow interconnects workforce, material inventory, active styles, and line throughput into a single living mesh—giving you real-time clarity over your entire operation.
                        </p>

                        {/* Benefits Checklist */}
                        <div className="space-y-4 w-full">
                            {benefits.map((benefit, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm mt-0.5">
                                        <FiCheck size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-800 leading-snug">
                                        {benefit}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Floating Glass Nodes with Glowing SVG Connections */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7 relative min-h-[520px] rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 shadow-2xl overflow-hidden flex items-center justify-center"
                    >
                        {/* Internal Ambient Glows */}
                        <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-purple-500/20 blur-[90px] pointer-events-none" />
                        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-emerald-500/20 blur-[90px] pointer-events-none" />

                        {/* Network Grid Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                        {/* Connecting Glowing Lines (SVG Graph) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            <defs>
                                <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                                </linearGradient>
                                <linearGradient id="lineGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                            {/* Lines connecting central Production node to other module nodes */}
                            <path d="M 25% 25% L 50% 48%" stroke="url(#lineGrad1)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                            <path d="M 70% 20% L 50% 48%" stroke="url(#lineGrad2)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                            <path d="M 20% 75% L 50% 48%" stroke="url(#lineGrad1)" strokeWidth="2" strokeDasharray="4 4" />
                            <path d="M 75% 75% L 50% 48%" stroke="url(#lineGrad2)" strokeWidth="2" strokeDasharray="4 4" />
                            <path d="M 80% 45% L 50% 48%" stroke="url(#lineGrad1)" strokeWidth="2" strokeDasharray="4 4" />
                        </svg>

                        {/* Glass Floating Cards Container */}
                        <div className="relative w-full h-full min-h-[460px] z-10">
                            {/* Center Pulse Core Badge */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    className="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center justify-center text-center text-white"
                                >
                                    <div className="h-10 w-10 rounded-2xl bg-purple-600 flex items-center justify-center mb-2 shadow-lg shadow-purple-500/50">
                                        <HiSparkles size={20} className="text-white" />
                                    </div>
                                    <span className="text-xs font-extrabold tracking-wider uppercase text-purple-300">StitchFlow Core</span>
                                    <span className="text-[10px] text-slate-300 font-mono mt-0.5">SYNCED GRAPH ENGINE</span>
                                </motion.div>
                            </div>

                            {/* 6 Connected Module Floating Glass Cards */}
                            {modules.map((m, idx) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.08, zIndex: 30 }}
                                    style={{ left: m.x, top: m.y }}
                                    className="absolute z-10 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-white/40 hover:bg-white/20 shadow-lg transition-all duration-300 group">
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${m.color} border shadow-inner`}>
                                            <m.icon size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white tracking-wide group-hover:text-purple-200 transition-colors">
                                                {m.name}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-300">
                                                {m.label}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
