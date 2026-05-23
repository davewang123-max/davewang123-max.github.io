import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';
import SkillRadar from './SkillRadar';

interface Tool {
  name: string;
  level: number;
}

interface Lang {
  name: string;
  level: string;
  pct: number;
}

export default function Skills() {
  const { t } = useTranslation();
  const tools = t('skills.tools', { returnObjects: true }) as unknown as Tool[];
  const languages = t('skills.languages', { returnObjects: true }) as unknown as Lang[];
  const competencies = t('skills.competencies', { returnObjects: true }) as unknown as string[];
  const radarAxes = t('skills.radar_axes', { returnObjects: true }) as unknown as Record<string, string>;

  return (
    <section id="skills" className="bg-slate-50/50">
      <div className="section-container">
        <ScrollReveal>
          <h2 className="section-title">{t('skills.section_title')}</h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <ScrollReveal delay={0.1}>
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">{t('skills.tools_title')}</h3>
              <div className="space-y-4">
                {tools.map((tool) => (
                  <div key={tool.name}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-sm text-slate-600">{tool.name}</span>
                      <span className="text-xs text-slate-400">{tool.level}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-800 rounded-full transition-all duration-700"
                        style={{ width: `${tool.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            <ScrollReveal delay={0.15}>
              <div className="card">
                <SkillRadar axes={radarAxes} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('skills.languages_title')}</h3>
                <div className="space-y-3">
                  {languages.map((lang) => (
                    <div key={lang.name} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-700 w-20">{lang.name}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-500 rounded-full"
                          style={{ width: `${lang.pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-28 text-right">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal delay={0.25}>
          <div className="mt-10 card">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('skills.competencies_title')}</h3>
            <div className="flex flex-wrap gap-2">
              {competencies.map((c) => (
                <span key={c} className="px-4 py-2 bg-slate-800 text-white text-sm rounded-full">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
