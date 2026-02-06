import React from 'react';
import { CheckCircle2, Circle, Loader2, FileText, BrainCircuit, PenTool } from 'lucide-react';
import { StepStatus } from '../types';

interface ProgressDisplayProps {
  steps: StepStatus[];
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ steps }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
        {/* Progress Line Background (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -z-10 transform -translate-y-1/2 rounded-full" />

        {steps.map((step, index) => {
          let Icon = Circle;
          let iconColor = "text-slate-500";
          let bgColor = "bg-slate-900";
          let borderColor = "border-slate-800";
          let shadow = "";

          if (step.status === 'completed') {
            Icon = CheckCircle2;
            iconColor = "text-green-400";
            bgColor = "bg-slate-900";
            borderColor = "border-green-500/50";
            shadow = "shadow-[0_0_15px_rgba(34,197,94,0.3)]";
          } else if (step.status === 'loading') {
            Icon = Loader2;
            iconColor = "text-primary-400";
            bgColor = "bg-slate-900";
            borderColor = "border-primary-500";
            shadow = "shadow-[0_0_20px_rgba(14,165,233,0.4)]";
          } else {
             if (step.id === 1) Icon = BrainCircuit;
             if (step.id === 2) Icon = FileText;
             if (step.id === 3) Icon = PenTool;
             bgColor = "bg-slate-950";
             borderColor = "border-white/10";
          }

          return (
            <div key={step.id} className="relative flex md:flex-col items-center gap-4 md:gap-3 w-full md:w-1/3 mb-6 md:mb-0 first:items-start md:first:items-center last:items-end md:last:items-center">
              {/* Icon Circle */}
              <div className={`
                relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500
                ${bgColor} ${borderColor} ${shadow} backdrop-blur-xl
              `}>
                <Icon className={`h-5 w-5 ${iconColor} ${step.status === 'loading' ? 'animate-spin' : ''}`} />
              </div>

              {/* Text */}
              <div className={`flex flex-col md:text-center ${index === 0 ? 'md:items-center' : index === 2 ? 'md:items-center' : ''}`}>
                <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${step.status === 'pending' ? 'text-slate-600' : 'text-slate-400'}`}>
                    Step 0{step.id}
                </span>
                <span className={`text-sm font-medium transition-colors duration-300 ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressDisplay;
