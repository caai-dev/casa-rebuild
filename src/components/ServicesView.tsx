import { motion } from 'motion/react';
import { ShieldCheck, Scale, TrendingUp, Briefcase, CheckCircle2 } from 'lucide-react';
import IndustryMarquee from './IndustryMarquee';

const services = [
  {
    title: 'Audit & Assurance',
    desc: 'At CASA group, we act in the public interest and the capital markets. Our professionals inspire trust in data and financial information and our focus on innovation delivers efficiency and value to our clients.',
    Icon: ShieldCheck,
    offerings: [
      'Statutory & Regulatory Audits',
      'Internal Audit & Risk Assessment',
      'SOC 2 Type I & II Compliance',
      'Forensic Auditing & Investigation',
    ],
  },
  {
    title: 'Tax & Legal',
    desc: 'We are united by our values, governed by Global Tax Principles, and driven by our purpose to inspire confidence and empower change by delivering modern tax services and data-driven solutions needed today.',
    Icon: Scale,
    offerings: [
      'Corporate Tax Planning & Compliance',
      'GST / Indirect Tax Services',
      'Transfer Pricing & International Tax',
      'Regulatory & Legal Filings',
    ],
  },
  {
    title: 'Advisory',
    desc: 'CASA group is with you, shoulder-to-shoulder, all the way to strong performance, lasting value and responsible growth. Together, we can help make your business fit for tomorrow — a future that is sustainable and secure.',
    Icon: TrendingUp,
    offerings: [
      'Business Strategy & Valuation',
      'Corporate Restructuring',
      'Internal Controls & Governance',
      'Global Capability Centre (GCC) Setup',
    ],
  },
  {
    title: 'Private Enterprises',
    desc: 'Helping entrepreneurs build great businesses. We know what it takes to be successful at each stage of your business. Your success is our legacy, we are dedicated to working with you and your business.',
    Icon: Briefcase,
    offerings: [
      'Accounting & Bookkeeping Services',
      'End-to-End Payroll Management',
      'Startup Advisory & Fundraising Support',
      'Technology & ERP Integration',
    ],
  },
];

export default function ServicesView() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-10 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-16"
      >
        <span className="text-[#b8935a] font-semibold text-[13px] tracking-widest uppercase mb-3">Our Expertise</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#0a1b33] font-medium tracking-tight max-w-2xl leading-tight">
          Precision Assurance, Taxation, and Advisory Services
        </h1>
        <p className="font-sans text-[14px] md:text-[15px] text-slate-500 max-w-xl mt-4 leading-relaxed">
          Through a truly collaborative approach, we act as a dedicated strategic partner to help your enterprise comply, grow, and adapt.
        </p>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-8 mb-20"
      >
        {services.map((service) => {
          const { title, desc, Icon, offerings } = service;
          return (
            <motion.div
              key={title}
              variants={cardVariants}
              className="group relative bg-white rounded-[32px] border border-slate-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.015)] p-8 md:p-10 transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.03)] hover:border-slate-300/80 flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700"
            >
              {/* Top Accent Star */}
              <div className="absolute top-6 right-6 text-[#b8935a] opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xl">✦</span>
              </div>

              <div>
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#0a1b33]/5 flex items-center justify-center text-[#0a1b33] group-hover:bg-[#b8935a]/10 group-hover:text-[#b8935a] transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="font-display text-[22px] text-[#0a1b33] font-medium tracking-tight">
                    {title}
                  </h2>
                </div>

                {/* Description */}
                <p className="font-sans text-[13.5px] text-slate-500 leading-relaxed mb-6 font-light">
                  {desc}
                </p>

                {/* Offerings list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  {offerings.map((offering) => (
                    <div key={offering} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#b8935a] shrink-0" />
                      <span className="text-[12px] font-semibold text-[#0a1b33]/85">{offering}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Hover Accent Bar */}
              <div className="absolute bottom-0 left-10 right-10 h-[3px] bg-[#b8935a] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-t-full" />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Industries Marquee Section */}
      <div className="pt-8 border-t border-slate-100">
        <div className="flex flex-col items-center text-center mb-6">
          <span className="text-[#b8935a] font-semibold text-[13px] tracking-widest uppercase mb-1">Sector Focus</span>
          <h2 className="font-display text-2xl md:text-3xl text-[#0a1b33] font-medium tracking-tight">
            Industries We Support
          </h2>
        </div>
        <IndustryMarquee />
      </div>
    </div>
  );
}
