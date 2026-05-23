import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

export default function Education() {
  const { t } = useTranslation();
  const courses = t('education.courses', { returnObjects: true }) as unknown as string[];

  return (
    <section id="education" className="bg-slate-50/50">
      <div className="section-container">
        <ScrollReveal>
          <h2 className="section-title">{t('education.section_title')}</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="card max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{t('education.school')}</h3>
                <p className="text-slate-600 font-medium mt-1">{t('education.degree')}</p>
              </div>
              <span className="text-sm text-slate-400 whitespace-nowrap">{t('education.period')}</span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
              <span>{t('education.gpa')}</span>
              <span className="hidden sm:inline">·</span>
              <span>{t('education.honors')}</span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                {t('education.coursework_title')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {courses.map((course) => (
                  <span
                    key={course}
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-full"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
