import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="bg-white">
      <div className="section-container">
        <ScrollReveal>
          <h2 className="section-title">{t('about.section_title')}</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl text-balance">
            {t('about.content')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
