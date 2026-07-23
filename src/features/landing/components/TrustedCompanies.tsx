'use client';

import { motion } from 'framer-motion';

export default function TrustedCompanies() {
    const companies = [
        { name: 'Apex Threads', symbol: '✦', location: 'Milan' },
        { name: 'Precision Loom', symbol: '❖', location: 'Tokyo' },
        { name: 'Vanguard Apparel', symbol: '▲', location: 'New York' },
        { name: 'SilkRoute Mfg', symbol: '⬡', location: 'Istanbul' },
        { name: 'CoreTextile', symbol: '⚙', location: 'London' },
        { name: 'Zenith Garments', symbol: '⚡', location: 'Dhaka' },
        { name: 'Nexus Stitch', symbol: '◈', location: 'Seoul' },
        { name: 'Solis Mills', symbol: '✵', location: 'Saigon' },
    ];

    const doubleCompanies = [...companies, ...companies];

    return (
        <section className="relative py-16 border-y border-slate-200/60 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[150px] bg-purple-100/30 blur-[100px] pointer-events-none rounded-full" />

            <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-10"
                >
                    Trusted by forward-thinking apparel & textile enterprises worldwide
                </motion.p>

                {/* Marquee Wrapper with Edge Blurs */}
                <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]">
                    <div className="flex gap-16 min-w-full shrink-0 animate-marquee py-3 select-none">
                        {doubleCompanies.map((company, idx) => (
                            <div
                                key={`${company.name}-${idx}`}
                                className="group flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-slate-100/60 cursor-pointer"
                            >
                                <span className="text-xl text-purple-600/80 group-hover:text-purple-600 transition-colors">
                                    {company.symbol}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-base font-semibold text-slate-700 tracking-tight group-hover:text-slate-900 transition-colors">
                                        {company.name}
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-400 group-hover:text-purple-600/80 transition-colors">
                                        {company.location}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
