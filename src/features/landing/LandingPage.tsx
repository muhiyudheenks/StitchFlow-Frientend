'use client';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedCompanies from './components/TrustedCompanies';
import Features from './components/Features';
import WhyChoose from './components/WhyChoose';
import Stats from './components/Stats';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function LandingPage() {
    return (
        <div className="bg-[#FAFAFC] min-h-screen text-slate-900 font-sans overflow-x-hidden antialiased selection:bg-primary/30 selection:text-white">
            <Navbar />
            <Hero />
            <TrustedCompanies />
            <Features />
            <WhyChoose />
            <Stats />
            <CTA />
            <Footer />
        </div>
    );
}
