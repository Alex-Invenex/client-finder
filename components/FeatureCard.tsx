import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: 'primary' | 'accent' | 'secondary';
}

export default function FeatureCard({ icon: Icon, title, description, color = 'primary' }: FeatureCardProps) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    accent: 'bg-accent-100 text-accent-600',
    secondary: 'bg-secondary-100 text-secondary-600',
  };

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600 leading-relaxed">{description}</p>
    </div>
  );
}