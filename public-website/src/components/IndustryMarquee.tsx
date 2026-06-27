import { 
  Building2, 
  RadioTower, 
  HeartPulse, 
  Car, 
  TrendingUp, 
  Zap, 
  Landmark, 
  Scale 
} from 'lucide-react';

const industries = [
  {
    name: 'Real Estate',
    Icon: Building2,
    gradient: 'from-[#3b82f6] to-[#1d4ed8]',
  },
  {
    name: 'Telecom',
    Icon: RadioTower,
    gradient: 'from-[#8b5cf6] to-[#6d28d9]',
  },
  {
    name: 'Health & Life Science',
    Icon: HeartPulse,
    gradient: 'from-[#f43f5e] to-[#be123c]',
  },
  {
    name: 'Automobile',
    Icon: Car,
    gradient: 'from-[#f59e0b] to-[#c2410c]',
  },
  {
    name: 'Asset Management',
    Icon: TrendingUp,
    gradient: 'from-[#10b981] to-[#047857]',
  },
  {
    name: 'Energy',
    Icon: Zap,
    gradient: 'from-[#eab308] to-[#b45309]',
  },
  {
    name: 'Bank & Capital Market',
    Icon: Landmark,
    gradient: 'from-[#0ea5e9] to-[#0284c7]',
  },
  {
    name: 'Public Sector',
    Icon: Scale,
    gradient: 'from-[#64748b] to-[#0f766e]',
  },
];

export default function IndustryMarquee() {
  // Duplicate list to create seamless looping
  const doubleIndustries = [...industries, ...industries];

  return (
    <section id="industries" className="relative w-full overflow-hidden mt-10 py-4 select-none">
      {/* Left and Right Edge Masks for Fade Effect */}
      <div className="mask-marquee w-full flex overflow-hidden">
        <div className="flex w-max gap-6 py-2 animate-marquee hover:[animation-play-state:paused]">
          {doubleIndustries.map((industry, index) => {
            const { name, Icon, gradient } = industry;
            return (
              <div
                key={`${name}-${index}`}
                className="group relative h-24 w-40 shrink-0 flex flex-col items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Hover Gradient Background */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out z-0 rounded-full`}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-3">
                  <Icon className="w-5 h-5 text-navy group-hover:text-white transition-colors duration-300 mb-1" />
                  <span className="text-[12px] font-semibold text-navy group-hover:text-white transition-colors duration-300 leading-tight">
                    {name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
