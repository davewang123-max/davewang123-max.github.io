import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="bg-slate-900 text-white">
      <div className="section-container text-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            {t('contact.section_title')}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-10 text-slate-300">
            <a
              href={`mailto:${t('contact.email')}`}
              className="flex items-center gap-3 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{t('contact.email')}</span>
            </a>
            <a
              href={`tel:${t('contact.phone')}`}
              className="flex items-center gap-3 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm">{t('contact.phone')}</span>
            </a>
            <span className="flex items-center gap-3 text-slate-400 text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('contact.location')}
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
