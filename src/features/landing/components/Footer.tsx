'use client';

import Link from 'next/link';
import { FiLayers, FiTwitter, FiLinkedin, FiGithub, FiYoutube } from 'react-icons/fi';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: 'Product',
            links: [
                { label: 'Line Balancing Engine', href: '#features' },
                { label: 'Quality Control QMS', href: '#features' },
                { label: 'Worker Scheduling & Attendance', href: '#features' },
                { label: 'Inventory & Materials Sync', href: '#features' },
                { label: 'Executive Analytics', href: '#features' },
            ]
        },
        {
            title: 'Solutions',
            links: [
                { label: 'Apparel Factories', href: '#features' },
                { label: 'Textile & Weaving Mills', href: '#features' },
                { label: 'Contract Manufacturers', href: '#features' },
                { label: 'Multi-Plant Enterprises', href: '#features' },
            ]
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', href: '/' },
                { label: 'Careers', href: '/' },
                { label: 'Security & Compliance', href: '/' },
                { label: 'Contact Sales', href: '/' },
            ]
        },
        {
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', href: '/' },
                { label: 'Terms of Service', href: '/' },
                { label: 'Security Overview', href: '/' },
                { label: 'Cookie Settings', href: '/' },
            ]
        }
    ];

    const socialLinks = [
        { label: 'Twitter', icon: FiTwitter, href: 'https://twitter.com' },
        { label: 'LinkedIn', icon: FiLinkedin, href: 'https://linkedin.com' },
        { label: 'GitHub', icon: FiGithub, href: 'https://github.com' },
        { label: 'YouTube', icon: FiYoutube, href: 'https://youtube.com' },
    ];

    return (
        <footer className="relative bg-[#0B0F19] text-slate-400 pt-20 pb-12 border-t border-slate-800/80 overflow-hidden font-sans">
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

            <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
                {/* Main Multi-Column Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-16 border-b border-slate-800/60">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-8">
                        <Link href="/" className="flex items-center gap-2.5 mb-6 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                                <FiLayers size={20} />
                            </div>
                            <span className="text-xl font-extrabold text-white tracking-tight">
                                StitchFlow
                            </span>
                        </Link>

                        <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
                            The central operating platform for high-performance apparel and textile manufacturing operations worldwide.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-slate-800 transition-all duration-300"
                                >
                                    <social.icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="flex flex-col">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-5">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-slate-400 hover:text-purple-400 transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                    <p>© {currentYear} StitchFlow Inc. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span className="inline-flex items-center gap-2 text-emerald-400 font-mono">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            All Systems Operational
                        </span>
                        <span className="text-slate-600">|</span>
                        <span>Designed for Enterprise SaaS</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
