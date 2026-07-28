import React from 'react';
import {
  Sparkles,
  Umbrella,
  Shirt,
  Footprints,
  Sun,
  Wind,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { SmartRecommendation } from '../types';

interface SmartRecommendationsProps {
  recommendations: SmartRecommendation[];
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  recommendations,
}) => {
  const getCategoryIcon = (category: SmartRecommendation['category']) => {
    switch (category) {
      case 'umbrella':
        return <Umbrella className="w-5 h-5 text-sky-400" />;
      case 'clothing':
        return <Shirt className="w-5 h-5 text-indigo-400" />;
      case 'activity':
        return <Footprints className="w-5 h-5 text-emerald-400" />;
      case 'uv':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-teal-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getSeverityBadge = (severity: SmartRecommendation['severity']) => {
    switch (severity) {
      case 'alert':
        return {
          badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
        };
      case 'warning':
        return {
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'success':
        return {
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        };
      default:
        return {
          badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          icon: <Info className="w-3.5 h-3.5 text-indigo-400" />,
        };
    }
  };

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="mb-8 p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2rem] shadow-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            AI Smart Recommendations
            <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
              Live Advisory
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Contextual lifestyle guidance based on real-time atmospheric metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((item) => {
          const sev = getSeverityBadge(item.severity);
          return (
            <div
              key={item.id}
              className="p-5 bg-slate-950/70 rounded-[1.5rem] border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-slate-900 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform">
                    {getCategoryIcon(item.category)}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border ${sev.badge}`}
                  >
                    {sev.icon}
                    <span className="capitalize">{item.severity}</span>
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
