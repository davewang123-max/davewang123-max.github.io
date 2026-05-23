import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

export default function Hero() {
  const { t } = useTranslation();
  const titles = t('hero.titles', { returnObjects: true }) as unknown as string[];
  const [titleIdx, setTitleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTitleIdx((i) => (i + 1) % titles.length), 3000);
    return () => clearInterval(id);
  }, [titles.length]);

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white pt-16"
    >
      <div className="section-container text-center">
        <ScrollReveal>
          <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-8 rounded-full bg-slate-200 overflow-hidden ring-4 ring-white shadow-lg">
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-display">
              TW
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-sm font-medium text-accent-600 uppercase tracking-widest mb-4">
            {t('hero.greeting')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-slate-900 mb-6 tracking-tight">
            {t('hero.name')}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="h-8 md:h-10 flex items-center justify-center mb-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={titleIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="text-lg md:text-xl text-slate-500 font-light"
              >
                {titles[titleIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="projects"
              smooth
              offset={-80}
              className="px-8 py-3 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('hero.cta_projects')}
            </Link>
            <Link
              to="contact"
              smooth
              offset={-80}
              className="px-8 py-3 border border-slate-200 text-slate-700 text-sm font-medium rounded-full hover:border-slate-400 transition-colors cursor-pointer"
            >
              {t('hero.cta_contact')}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
