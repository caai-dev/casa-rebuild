import { motion } from 'motion/react';
import { Building, Target, Award, User } from 'lucide-react';

const teamMembers = [
  { name: 'CA Sagar Agrawal', role: 'Co-Founder & Strategist' },
  { name: 'Naina Rastogi', role: 'Co-Founder & Resource Management' },
  { name: 'CA Prateek Rastogi', role: 'Auditor' },
  { name: 'CA Nikhil Rawat', role: 'Auditor' },
  { name: 'Sahana Sham', role: 'Audit Senior' },
  { name: 'Pooja Goswami', role: 'Senior Consultant' },
  { name: 'Sumukha N P', role: 'Audit Senior' },
  { name: 'Himanshu Gupta', role: 'Audit Senior' },
  { name: 'Amrutha BG', role: 'Senior Consultant' },
  { name: 'Mohd Arbaz', role: 'Consultant' },
  { name: 'Mohd Abdullah', role: 'Consultant' },
  { name: 'Kopal Agrawal', role: 'Media Consultant' },
];

export default function AboutView() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
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
        <span className="text-[#b8935a] font-semibold text-[13px] tracking-widest uppercase mb-3">Our Identity</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#0a1b33] font-medium tracking-tight max-w-2xl leading-tight">
          Pioneering Financial Clarity & Trust Globally
        </h1>
        <p className="font-sans text-[14px] md:text-[15px] text-slate-500 max-w-xl mt-4 leading-relaxed">
          CASA Audit Group enhances business functions as a dedicated Global Capability Centre (GCC), uniting young and experienced minds in commerce.
        </p>
      </motion.div>

      {/* Grid: Story, GCC Role & Culture */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {/* Card 1: Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-[32px] border border-slate-200/50 p-8 shadow-sm flex flex-col items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0a1b33]/5 flex items-center justify-center text-[#0a1b33] mb-6">
            <Building className="w-5 h-5" />
          </div>
          <h2 className="font-display text-[20px] text-[#0a1b33] font-medium tracking-tight mb-4">Our Journey</h2>
          <p className="font-sans text-[13.5px] text-slate-500 leading-relaxed font-light">
            Founded in 2020 (formerly Young Alliedz), CASA Audit Group was created to serve enterprises globally by connecting energetic, highly-competent financial minds. Over the years, we have grown into a tech-equipped, trusted compliance partner.
          </p>
        </motion.div>

        {/* Card 2: The GCC Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-[32px] border border-slate-200/50 p-8 shadow-sm flex flex-col items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0a1b33]/5 flex items-center justify-center text-[#0a1b33] mb-6">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="font-display text-[20px] text-[#0a1b33] font-medium tracking-tight mb-4">Global Capability Centre</h2>
          <p className="font-sans text-[13.5px] text-slate-500 leading-relaxed font-light">
            We act as an extension of your business—a dedicated Global Capability Centre (GCC)—bringing a fresh, data-driven perspective to Audit, Taxation, Corporate Advisory, Accounting, and Payroll management.
          </p>
        </motion.div>

        {/* Card 3: Expanded Horizon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-[32px] border border-slate-200/50 p-8 shadow-sm flex flex-col items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0a1b33]/5 flex items-center justify-center text-[#0a1b33] mb-6">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="font-display text-[20px] text-[#0a1b33] font-medium tracking-tight mb-4">Expanded Horizons</h2>
          <p className="font-sans text-[13.5px] text-slate-500 leading-relaxed font-light">
            Majorly serving insurance, real estate, NPOs, FMCG, and the public sector, our firm has recently expanded into cutting-edge compliance areas such as SOC 2 Readiness Audits, Forensic Auditing, and Financial Investigation.
          </p>
        </motion.div>
      </div>

      {/* Leadership & Team Section */}
      <div className="pt-10 border-t border-slate-100">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[#b8935a] font-semibold text-[13px] tracking-widest uppercase mb-2">Our People</span>
          <h2 className="font-display text-3xl md:text-4xl text-[#0a1b33] font-medium tracking-tight">
            Our Leadership & Specialist Team
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {teamMembers.map((member) => {
            const { name, role } = member;
            // Highlight founders
            const isFounder = role.toLowerCase().includes('founder');
            return (
              <motion.div
                key={name}
                variants={cardVariants}
                className={`group relative bg-white rounded-3xl border ${
                  isFounder ? 'border-[#b8935a]/30 shadow-md shadow-[#b8935a]/2' : 'border-slate-200/50'
                } p-6 transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:border-slate-300/80 flex flex-col items-center text-center overflow-hidden`}
              >
                {/* Gold Star for Founders */}
                {isFounder && (
                  <div className="absolute top-4 right-4 text-[#b8935a] text-sm font-semibold select-none">
                    ✦
                  </div>
                )}

                {/* Avatar Icon */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                  isFounder 
                    ? 'bg-[#b8935a]/10 text-[#b8935a]' 
                    : 'bg-[#0a1b33]/5 text-[#0a1b33] group-hover:bg-[#0a1b33]/10'
                }`}>
                  <User className="w-6 h-6" />
                </div>

                {/* Name */}
                <h3 className="font-display text-[16px] text-[#0a1b33] font-semibold tracking-tight mb-1 group-hover:text-[#b8935a] transition-colors duration-300">
                  {name}
                </h3>

                {/* Role */}
                <span className="font-sans text-[12px] text-slate-400 font-medium">
                  {role}
                </span>

                {/* Bottom line hover */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#b8935a] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-t-full" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
