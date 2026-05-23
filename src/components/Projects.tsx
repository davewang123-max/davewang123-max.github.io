import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';
import ProjectCard from './ProjectCard';

interface ProjectItem {
  id: string;
  title: string;
  period: string;
  type: string;
  description: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  links: { github: string; demo: string };
}

export default function Projects() {
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true }) as unknown as ProjectItem[];

  return (
    <section id="projects" className="bg-slate-50/50">
      <div className="section-container">
        <ScrollReveal>
          <h2 className="section-title">{t('projects.section_title')}</h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((project, idx) => (
            <ScrollReveal key={project.id} delay={idx * 0.1}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
