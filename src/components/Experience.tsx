import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

export default function Experience() {
  const { t } = useTranslation();
  const highlights = t('experience.highlights', { returnObjects: true }) as unknown as string[];

  return (
    <section id="experience" className="bg-white">
      <div className="section-container">
        <ScrollReveal>
          <h2 className="section-title">{t('experience.section_title')}</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="card max-w-3xl border-l-4 border-l-accent-500 rounded-l-none">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{t('experience.role')}</h3>
                <p className="text-accent-600 font-medium mt-1">{t('experience.org')}</p>
              </div>
              <span className="text-sm text-slate-400 whitespace-nowrap">{t('experience.period')}</span>
            </div>

            <ul className="space-y-3">
              {highlights.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-slate-600 leading-relaxed">
                  <span className="text-accent-400 mt-1.5 shrink-0">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
