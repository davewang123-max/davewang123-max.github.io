import { useTranslation } from 'react-i18next';

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

const colorMap: Record<string, string> = {
  co2: 'from-emerald-500 to-teal-600',
  derivatives: 'from-violet-500 to-purple-600',
  credit: 'from-amber-500 to-orange-600',
  b2b: 'from-accent-500 to-blue-600',
};

function gradientColor(id: string): string {
  for (const [key, val] of Object.entries(colorMap)) {
    if (id.includes(key)) return val;
  }
  return 'from-slate-500 to-slate-700';
}

export default function ProjectCard({ project }: { project: ProjectItem }) {
  const { t } = useTranslation();

  return (
    <div className="card group h-full flex flex-col">
      <div
        className={`relative h-40 rounded-xl bg-gradient-to-br ${gradientColor(project.id)} flex items-center justify-center mb-5 overflow-hidden`}
      >
        <span className="text-white/80 text-6xl font-display font-bold">
          {project.title.charAt(0)}
        </span>
        {project.metrics.length > 0 && (
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
            {project.metrics[0].label}: {project.metrics[0].value}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-accent-600 bg-accent-50 px-2.5 py-0.5 rounded-full">
          {project.type}
        </span>
        <span className="text-xs text-slate-400">{project.period}</span>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-accent-600 transition-colors">
        {project.title}
      </h3>

      <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tech.map((t) => (
          <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {t('projects.source_code')}
          </a>
        )}
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent-600 hover:text-accent-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {t('projects.live_demo')}
          </a>
        )}
      </div>
    </div>
  );
}
