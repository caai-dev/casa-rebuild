import { motion } from 'motion/react';
import { 
  Receipt, 
  Building, 
  Users, 
  Globe, 
  ExternalLink
} from 'lucide-react';

const categories = [
  {
    title: 'Taxation Portals',
    Icon: Receipt,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    links: [
      { name: 'Income Tax Login', desc: 'Income tax e-filing portal for filing returns and tax audits.', url: 'https://www.incometax.gov.in/' },
      { name: 'Income Tax Sections', desc: 'Reference database for sections, rules, and circulars.', url: 'https://www.incometaxindia.gov.in/' },
      { name: 'E-Pay Challan', desc: 'Online portal for payment of direct taxes (Challan 280/281).', url: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/epay-tax-prelogin' },
      { name: 'Traces', desc: 'TDS reconciliation, correction, and Form 16/26AS services.', url: 'https://www.tdscpc.gov.in/' },
      { name: 'GST Search', desc: 'Verify tax identity and filing records of any GSTIN.', url: 'https://www.gst.gov.in/' },
      { name: 'GST Portal', desc: 'Online filing of GST returns, payments, and registration.', url: 'https://www.gst.gov.in/' },
    ],
  },
  {
    title: 'Corporate & Licensing',
    Icon: Building,
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    links: [
      { name: 'MCA21', desc: 'Ministry of Corporate Affairs corporate compliance portal.', url: 'https://www.mca.gov.in/' },
      { name: 'Trademark Registry', desc: 'IP India portal for trademark filing and name availability search.', url: 'https://ipindiaonline.gov.in/' },
      { name: 'MSME Registration', desc: 'Udyam registration for micro, small, and medium businesses.', url: 'https://udyamregistration.gov.in/' },
      { name: 'FSSAI License', desc: 'Food Safety and Standards Authority food licensing portal.', url: 'https://foscos.fssai.gov.in/' },
      { name: 'Cibil Portal', desc: 'Credit Information Bureau checking credit reports.', url: 'https://www.cibil.com/' },
    ],
  },
  {
    title: 'Labor Compliance',
    Icon: Users,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    links: [
      { name: 'Employee EPFO', desc: 'Provident fund portal for checking balance & pension claims.', url: 'https://www.epfindia.gov.in/' },
      { name: 'Employer EPFO', desc: 'PF deposit, return filing, and compliance management.', url: 'https://unifiedportal-emp.epfindia.gov.in/' },
      { name: 'ESIC Portal', desc: 'Employees State Insurance registration and filings.', url: 'https://www.esic.gov.in/' },
    ],
  },
  {
    title: 'Business Utilities',
    Icon: Globe,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    links: [
      { name: 'Currency Convertor', desc: 'Real-time foreign currency exchange rates converter.', url: 'https://www.xe.com/currencyconverter/' },
    ],
  },
];

export default function QuickLinksView() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
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
        <span className="text-[#b8935a] font-semibold text-[13px] tracking-widest uppercase mb-3">Resources</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#0a1b33] font-medium tracking-tight max-w-2xl leading-tight">
          Client Utilities & Regulatory Links
        </h1>
        <p className="font-sans text-[14px] md:text-[15px] text-slate-500 max-w-xl mt-4 leading-relaxed">
          Access essential governmental compliance, taxation, labor pension, and business registry portals directly from a single secure hub.
        </p>
      </motion.div>

      {/* Grid Categories */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-8"
      >
        {categories.map((cat) => {
          const { title, Icon, color, links } = cat;
          return (
            <motion.div
              key={title}
              variants={cardVariants}
              className="bg-white rounded-[32px] border border-slate-200/50 p-8 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3.5 mb-6 border-b border-slate-100 pb-4">
                  <div className={`p-2.5 rounded-2xl border ${color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-[18px] text-[#0a1b33] font-semibold tracking-tight">
                    {title}
                  </h2>
                </div>

                {/* Links list */}
                <div className="flex flex-col gap-4">
                  {links.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center justify-between p-3.5 rounded-2xl border border-transparent hover:border-slate-200/60 hover:bg-slate-50/50 transition-all duration-300"
                    >
                      <div className="flex flex-col pr-4">
                        <span className="font-sans text-[13.5px] font-semibold text-[#0a1b33] group-hover/link:text-[#b8935a] transition-colors duration-200">
                          {link.name}
                        </span>
                        <span className="font-sans text-[12px] text-slate-400 font-light mt-0.5 leading-relaxed">
                          {link.desc}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover/link:text-[#0a1b33] group-hover/link:border-slate-300 group-hover/link:bg-white transition-all duration-350 shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
