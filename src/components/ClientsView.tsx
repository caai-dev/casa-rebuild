import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Network, 
  Activity, 
  FileText, 
  Sparkles,
  Plane
} from 'lucide-react';

const clients = [
  {
    name: "4814 Outlook Drive",
    location: "New York, US",
    industry: "Real Estate & Properties",
    Icon: Building2,
    img: "/images/clients/client_1.png",
    color: "text-sky-500 bg-sky-500/10 border-sky-500/20"
  },
  {
    name: "CPA Group",
    location: "Florida, US",
    industry: "Assurance & Professional Services",
    Icon: FileText,
    img: "/images/clients/client_2.png",
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
  },
  {
    name: "Rucept Inc.",
    location: "California, US",
    industry: "Private Enterprise & Tech",
    Icon: Network,
    img: "/images/clients/client_3.png",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
  },
  {
    name: "Water Resource",
    location: "California, US",
    industry: "Public Sector Utility",
    Icon: Building2,
    img: "/images/clients/client_4.png",
    color: "text-teal-500 bg-teal-500/10 border-teal-500/20"
  },
  {
    name: "Wachna Law",
    location: "Ontario, Canada",
    industry: "Corporate Law Practice",
    Icon: FileText,
    img: "/images/clients/client_5.png",
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
  },
  {
    name: "Wolf Ausch CPA",
    location: "New York, US",
    industry: "Audit & CPA Firm",
    Icon: FileText,
    img: "/images/clients/client_6.png",
    color: "text-violet-500 bg-violet-500/10 border-violet-500/20"
  },
  {
    name: "Charm Estate Inc.",
    location: "New York, US",
    industry: "Real Estate Development",
    Icon: Building2,
    img: "/images/clients/client_7.png",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
  },
  {
    name: "Advantage Partners",
    location: "United States",
    industry: "Asset Management",
    Icon: Sparkles,
    img: "/images/clients/client_8.png",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
  },
  {
    name: "Pico Clinics",
    location: "United States",
    industry: "Health & Life Sciences",
    Icon: Activity,
    img: "/images/clients/client_9.png",
    color: "text-pink-500 bg-pink-500/10 border-pink-500/20"
  },
  {
    name: "Saffire Holidays Pvt Ltd",
    location: "Global / Holidays",
    industry: "Travel & Leisure Services",
    Icon: Plane,
    img: "/images/clients/client_10.png",
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20"
  }
];

function ClientCard({ client, cardVariants }: { client: typeof clients[0]; cardVariants: any }) {
  const { name, location, industry, Icon, color, img } = client;
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="group relative bg-white rounded-[32px] border border-slate-200/50 p-10 shadow-[0_15px_40px_rgba(0,0,0,0.01)] transition-all duration-300 hover:shadow-[0_25px_50px_rgba(0,0,0,0.025)] hover:border-[#b8935a]/35 flex flex-col justify-between overflow-hidden"
    >
      {/* Gold Star Monogram */}
      <div className="absolute top-6 right-6 text-[#b8935a] opacity-10 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-xl">✦</span>
      </div>

      <div>
        {/* Header Icon & Info */}
        <div className="flex items-center gap-5 mb-6">
          {img && !imgError ? (
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200/60 bg-white flex items-center justify-center shrink-0 p-1.5 shadow-sm group-hover:border-[#b8935a]/25 transition-all duration-300 select-none">
              <img 
                src={img} 
                alt={name} 
                onError={() => setImgError(true)}
                className="w-full h-full object-contain opacity-95 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-300" 
                loading="lazy" 
              />
            </div>
          ) : (
            <div className={`p-4 rounded-2xl border ${color} flex items-center justify-center shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-[20px] text-[#0a1b33] font-semibold tracking-tight group-hover:text-[#b8935a] transition-colors duration-200">
              {name}
            </h3>
            <span className="font-sans text-[13px] text-slate-400 font-medium">
              {industry}
            </span>
          </div>
        </div>
      </div>

      {/* Location Badge */}
      <div className="flex items-center gap-1.5 mt-2 self-start bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-100 transition-colors duration-250 group-hover:bg-[#b8935a]/5 group-hover:border-[#b8935a]/10">
        <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#b8935a] transition-colors" />
        <span className="font-sans text-[12px] font-semibold text-slate-500 group-hover:text-[#b8935a] transition-colors">
          {location}
        </span>
      </div>

      {/* Decorative line hover */}
      <div className="absolute bottom-0 left-10 right-10 h-[2.5px] bg-[#b8935a] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-t-full" />
    </motion.div>
  );
}

export default function ClientsView() {
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
        <span className="text-[#b8935a] font-semibold text-[13px] tracking-widest uppercase mb-3">Our Network</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#0a1b33] font-medium tracking-tight max-w-2xl leading-tight">
          Trust & Excellence with Valued Partners
        </h1>
        <p className="font-sans text-[14px] md:text-[15px] text-slate-500 max-w-xl mt-4 leading-relaxed">
          We pride ourselves on acting as a key compliance and advisory partner for leading startups, NPOs, corporate firms, and global groups.
        </p>
      </motion.div>

      {/* Clients Grid - Increased card sizes by shifting to 2 columns */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-10"
      >
        {clients.map((client) => (
          <ClientCard key={client.name} client={client} cardVariants={cardVariants} />
        ))}
      </motion.div>
    </div>
  );
}
