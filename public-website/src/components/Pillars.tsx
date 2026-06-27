import { motion } from 'motion/react';

const pillars = [
  {
    title: 'Our Promise',
    desc: 'Through a truly collaborative, firm-wide approach we continue to help develop solutions that better enable our clients to overcome their challenges and make the most of their opportunities.',
  },
  {
    title: 'Our Values',
    desc: 'Through commitment to our values, embracing our diversity and our responsibility to our communities, we aim to create an environment in which people are proud to work.',
  },
  {
    title: 'Our Culture',
    desc: 'We recognise potential, nurture talent and reward high performance, in an environment where you are encouraged to fulfil your sense of purpose and drive lasting change.',
  },
  {
    title: 'Our Vision',
    desc: 'Platforms to solve real-life business problems for leading corporations and contribute to the community at large.',
  },
];

export default function Pillars() {
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
        ease: [0.16, 1, 0.3, 1] as const
      }
    },
  };

  return (
    <section id="services" className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-[#b8935a] font-semibold text-[13px] tracking-widest uppercase mb-2">Why CASA</span>
        <h2 className="font-display text-3xl md:text-4xl text-[#0a1b33] font-medium tracking-tight">
          Core Pillars of Our Assurance Practice
        </h2>
      </div>

      {/* Grid of Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {pillars.map((pillar) => (
          <motion.div
            key={pillar.title}
            variants={cardVariants}
            className="group relative bg-white rounded-3xl border border-slate-200/50 shadow-[0_15px_40px_rgba(0,0,0,0.015)] p-8 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:border-slate-300/80 flex flex-col justify-between overflow-hidden"
          >
            {/* Gold Star Monogram */}
            <div className="absolute top-6 right-6 text-[#b8935a] opacity-30 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xl">✦</span>
            </div>

            <div>
              <h3 className="font-display text-[20px] text-[#0a1b33] font-medium tracking-tight mb-4 group-hover:text-[#b8935a] transition-colors duration-300">
                {pillar.title}
              </h3>
              <p className="font-sans text-[13.5px] text-slate-500 leading-relaxed font-light italic">
                {pillar.desc}
              </p>
            </div>
            
            {/* Bottom Golden Line Hover Effect */}
            <div className="absolute bottom-0 left-8 right-8 h-[3px] bg-[#b8935a] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-t-full" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
