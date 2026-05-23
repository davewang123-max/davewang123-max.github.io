import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

interface GapItem {
  title: string;
  description: string;
  tag: string;
}

const tagColorMap: Record<string, string> = {
  'Best Fit': 'bg-emerald-100 text-emerald-700',
  'High Impact': 'bg-amber-100 text-amber-700',
  'GenAI': 'bg-violet-100 text-violet-700',
  'OSS': 'bg-slate-200 text-slate-700',
  '核心项目': 'bg-emerald-100 text-emerald-700',
  '高影响力': 'bg-amber-100 text-amber-700',
  '开源': 'bg-slate-200 text-slate-700',
};

export default function GapYear() {
  const { t } = useTranslation();
  const items = t('gap_year.items', { returnObjects: true }) as unknown as GapItem[];

  return (
    <section id="gapyear" className="bg-white">
      <div className="section-container">
        <ScrollReveal>
          <h2 className="section-title">{t('gap_year.section_title')}</h2>
          <p className="section-subtitle">{t('gap_year.subtitle')}</p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 0.1}>
              <div className="card h-full flex flex-col hover:border-accent-200 transition-colors">
                <span
                  className={`self-start px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${tagColorMap[item.tag] || 'bg-slate-100 text-slate-600'}`}
                >
                  {item.tag}
                </span>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
