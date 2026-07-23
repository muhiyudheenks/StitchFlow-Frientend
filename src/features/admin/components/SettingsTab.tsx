'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiLock, FiBell, FiShield, FiSave, FiCheckCircle } from 'react-icons/fi';

export default function SettingsTab() {
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    return (
        <div className="space-y-8 font-sans max-w-4xl">
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    System & Organization Configuration
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                    Manage security, floor alerts, QMS tolerances, and admin profiles
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Organization Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4"
                >
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-2">
                        <FiSettings className="text-purple-600" size={20} />
                        <h3 className="text-base font-extrabold text-slate-900">Plant & Enterprise Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Factory Name</label>
                            <input type="text" defaultValue="StitchFlow Apparel Plant #01" className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-medium" />
                        </div>
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Super Admin Contact</label>
                            <input type="email" defaultValue="alex.vance@stitchflow.com" className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-medium" />
                        </div>
                    </div>
                </motion.div>

                {/* Floor Alert Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4"
                >
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-2">
                        <FiBell className="text-indigo-600" size={20} />
                        <h3 className="text-base font-extrabold text-slate-900">Automated Alert Triggers</h3>
                    </div>

                    <div className="space-y-3 text-xs">
                        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                            <span className="font-semibold text-slate-800">Alert supervisors when line efficiency drops below 85%</span>
                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-purple-600 cursor-pointer" />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                            <span className="font-semibold text-slate-800">Notify inventory manager on raw thread low stock threshold</span>
                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-purple-600 cursor-pointer" />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                            <span className="font-semibold text-slate-800">Automated daily attendance PDF summary at 06:00 PM</span>
                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-purple-600 cursor-pointer" />
                        </label>
                    </div>
                </motion.div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`px-6 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-md ${saved ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                    >
                        {saved ? (
                            <>
                                <FiCheckCircle size={16} /> Configuration Saved!
                            </>
                        ) : (
                            <>
                                <FiSave size={16} /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
