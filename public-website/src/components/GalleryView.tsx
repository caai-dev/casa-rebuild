import { useState } from 'react';
import { motion } from 'motion/react';
import { Palmtree, Trees, Sparkles, Gift, Flag, MessageSquare, Compass, Heart } from 'lucide-react';

const events = [
  {
    title: "Team Outing",
    date: "",
    desc: "17 January - 202 Work together, eat together, laugh together, and roam together. We are overwhelmed to share this #celebration moment of our #team where we learn, grow and achieve goals sometime beyond our expectations and get chance for outings. Major missing our all work-from-home #wfh team members.",
    Icon: Trees,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    images: ["/images/gallery/event_1_img_1.png","/images/gallery/event_1_img_2.png"]
  },
  {
    title: "Offsite to Goa 2025",
    date: "20 - Aug - 2025",
    desc: "20 August - 202 From beach sunsets to long conversations, team games to late-night laughs — this trip was more than just a getaway. It was about connection beyond screens, celebrating milestones, and strengthening the bonds that make our workplace feel like family. Seeing everyone together in one place reminded us that while we work hard individually, we grow stronger collectively. #TeamTrip #GoaDiaries #WorkFamily #TeamBonding #Gratitude #2025Memories",
    Icon: Palmtree,
    color: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    images: ["/images/gallery/event_2_img_1.png","/images/gallery/event_2_img_2.png"]
  },
  {
    title: "Team Outing",
    date: "09 - Jul - 2025",
    desc: "09 Work together, eat together, laugh together, click together. We are overwhelmed to share this #celebration moment of our #team where we learn, grow and achieve goals sometime beyond our expectations and get chance for outings. Major missing our all work-from-home #wfh team members.",
    Icon: Trees,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    images: ["/images/gallery/event_3_img_1.png","/images/gallery/event_3_img_2.png"]
  },
  {
    title: "Adventure Trip 2024",
    date: "30 - Dec - 2024",
    desc: "30 What an incredible trip we had as we said goodbye to 2024! Our office ventured into the lush green woods during winter, and it was magical. Hiking through serene trails, surrounded by towering trees covered in a gentle frost. The beauty of the landscape was a perfect backdrop for team bonding, reflection, and rejuvenation. It was an experience that not only brought us closer as colleagues but showed us the other crazy side of our #colleagues cum friends. As always, major missing our WFH team.",
    Icon: Compass,
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    images: ["/images/gallery/event_4_img_1.png","/images/gallery/event_4_img_2.png","/images/gallery/event_4_img_3.png","/images/gallery/event_4_img_4.png"]
  },
  {
    title: "Team Outing",
    date: "14 - Sep - 2024",
    desc: "14 Work together, eat together, laugh together, click together. We are overwhelmed to share this #celebration moment of our #team where we learn, grow and achieve goals sometime beyond our expectations and get chance for outings. Major missing our all work-from-home #wfh team members.",
    Icon: Trees,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    images: ["/images/gallery/event_5_img_1.png","/images/gallery/event_5_img_2.png","/images/gallery/event_5_img_3.png","/images/gallery/event_5_img_4.png","/images/gallery/event_5_img_5.png","/images/gallery/event_5_img_6.png"]
  },
  {
    title: "Birthday Celebrations",
    date: "14 - Sep - 2024",
    desc: "14 Any moment of celebration should not be missed. We all tried to fit in one frame.",
    Icon: Gift,
    color: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    images: ["/images/gallery/event_6_img_1.png","/images/gallery/event_6_img_2.png","/images/gallery/event_6_img_3.png"]
  },
  {
    title: "Independence Day 2024",
    date: "15 - Aug - 2024",
    desc: "Salutie to our Indian Flag and remembering our heroes of independence.",
    Icon: Flag,
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    images: ["/images/gallery/event_7_img_1.png","/images/gallery/event_7_img_2.png","/images/gallery/event_7_img_3.png"]
  },
  {
    title: "Team Connect",
    date: "17 - Feb - 2024",
    desc: "17 Just one of the weekly laughter doses that should never end.",
    Icon: MessageSquare,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    images: ["/images/gallery/event_8_img_1.png","/images/gallery/event_8_img_2.png"]
  },
  {
    title: "New Year Connect 2024",
    date: "01 - Jan - 2024",
    desc: "01 Welcome 2024! Seeing everyone on 1st day of the new year feels like a heartwarming blessing from each team member and god, welcoming 2024 with love, passion and energy.",
    Icon: MessageSquare,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    images: ["/images/gallery/event_9_img_1.png","/images/gallery/event_9_img_2.png"]
  },
  {
    title: "Team Outing (Thank You 2023)",
    date: "30 - Dec - 2023",
    desc: "30 December - 202 Years will come and go, beautiful memories will never be shed. We are thankful to 2023 Major missing our all work -from- home #wfh team members.",
    Icon: Trees,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    images: ["/images/gallery/event_10_img_1.png","/images/gallery/event_10_img_2.png","/images/gallery/event_10_img_3.png","/images/gallery/event_10_img_4.png","/images/gallery/event_10_img_5.png"]
  },
  {
    title: "Birthday Celebrations",
    date: "",
    desc: "25 November - 202 Any moment of celebration should not be missed. We all tried to fit in one frame.",
    Icon: Gift,
    color: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    images: ["/images/gallery/event_11_img_1.png","/images/gallery/event_11_img_2.png"]
  },
  {
    title: "Diwali Meet 2023",
    date: "10 - Nov - 2023",
    desc: "10 Any moment of celebration should not be missed. How about getting dipped in the same color \"Red\".",
    Icon: MessageSquare,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    images: ["/images/gallery/event_12_img_1.png","/images/gallery/event_12_img_2.png"]
  },
  {
    title: "Team Outing",
    date: "10 - Sep - 2023",
    desc: "10 Work together, eat together, laugh together, click together. We are overwhelmed to share this #celebration moment of our #team where we learn, grow and achieve goals sometime beyond our expectations and get chance for outings. Major missing our all work from home #wfh team members.",
    Icon: Trees,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    images: ["/images/gallery/event_13_img_1.png","/images/gallery/event_13_img_2.png"]
  },
  {
    title: "Social Activities",
    date: "",
    desc: "09 September - 202 Education is the key to where the nation is heading in the next 20-30 years or even more. We want to share a small beautiful moment with these kids having shone in their eyes for a bright future. Our small attempt is to keep the candle of education enlightened forever in children's life. Donation of food packets and stationary items.",
    Icon: Heart,
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    images: ["/images/gallery/event_14_img_1.png","/images/gallery/event_14_img_2.png","/images/gallery/event_14_img_3.png","/images/gallery/event_14_img_4.png"]
  },
  {
    title: "Award Ceremony",
    date: "31 - Mar - 2023",
    desc: "We are overwhelmed to share this #celebration moment of our #team where we learn, grow and achieve goals sometime beyond our expectations. All thanks to our beloved team members making an exceptional contribution of their hard work and intelligence. Our special #thanks to team working #remotely working from home #wfh , for whom we just try to give the corporate environment remotely. We at CASA Audit Group appreciate every bit of their effort to bring the best on table to deliver exceptional client service.",
    Icon: Sparkles,
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    images: ["/images/gallery/event_15_img_1.png","/images/gallery/event_15_img_2.png","/images/gallery/event_15_img_3.png","/images/gallery/event_15_img_4.png"]
  },
  {
    title: "Team Movie Outing",
    date: "01 - Dec - 2022",
    desc: "1 - December - 202 Picture can be blurred, but memories are not. What a movie and a beautiful time spent with team watching Drashyam! We are blessed to sharing time together from watching training sessions to watching movie together. Thanks to the team members for coming up with great idea to share this bond.",
    Icon: Compass,
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    images: ["/images/gallery/event_16_img_1.png"]
  },
  {
    title: "Social Activities",
    date: "10 - Sep - 2022",
    desc: "10 Education is the key to where the nation is heading in the next 20-30 years or even more. We want to share a small beautiful moment with these kids having shone in their eyes for a bright future. Our small attempt is to keep the candle of education enlightened forever in children's life.",
    Icon: Heart,
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    images: ["/images/gallery/event_17_img_1.png","/images/gallery/event_17_img_2.png","/images/gallery/event_17_img_3.png","/images/gallery/event_17_img_4.png"]
  },
  {
    title: "Social Activities",
    date: "28 - Aug - 2022",
    desc: "28 Education is the key to where the nation is heading in the next 20-30 years or even more. We want to share a small beautiful moment with these kids having shone in their eyes for a bright future. Our small attempt is to keep the candle of education enlightened forever in children's life.",
    Icon: Heart,
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    images: ["/images/gallery/event_18_img_1.png"]
  }
];

function GalleryCard({ event, cardVariants }: { event: typeof events[0]; cardVariants: any }) {
  const { title, date, desc, Icon, color, images } = event;
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      className="group relative bg-white rounded-[32px] border border-slate-200/50 p-8 shadow-[0_15px_40px_rgba(0,0,0,0.01)] transition-all duration-300 hover:shadow-[0_25px_50px_rgba(0,0,0,0.025)] hover:border-[#b8935a]/35 flex flex-col justify-between overflow-hidden"
      variants={cardVariants}
    >
      {/* Gold Star Monogram */}
      <div className="absolute top-6 right-6 text-[#b8935a] opacity-10 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-xl">✦</span>
      </div>

      <div>
        {/* Outing Image Preview */}
        {images && images.length > 0 && !imgError && (
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-6 bg-slate-100/50 border border-slate-200/20 group-hover:border-[#b8935a]/20 transition-all duration-300">
            <img 
              src={images[0]} 
              alt={title} 
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-[1.03] select-none"
              loading="lazy"
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-[#0a1b33]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200/10 flex items-center gap-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                <span className="text-[10px] font-semibold text-[#b8935a] tracking-wider uppercase">
                  +{images.length - 1} Photos
                </span>
              </div>
            )}
          </div>
        )}
        {/* Badge Tag & Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2.5 rounded-2xl border ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              {date}
            </span>
            <h3 className="font-display text-[16px] text-[#0a1b33] font-semibold tracking-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="font-sans text-[13px] text-slate-500 leading-relaxed font-light italic">
          "{desc}"
        </p>
      </div>

      {/* Decorative side block */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#b8935a] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-t-full" />
    </motion.div>
  );
}

export default function GalleryView() {
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
        <span className="text-[#b8935a] font-semibold text-[13px] tracking-widest uppercase mb-3">Our Culture</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#0a1b33] font-medium tracking-tight max-w-2xl leading-tight">
          Life & Moments at CASA Audit Group
        </h1>
        <p className="font-sans text-[14px] md:text-[15px] text-slate-500 max-w-xl mt-4 leading-relaxed">
          Glimpses from our joyful moments of celebration, outings, offsites, and bonding beyond screens.
        </p>
      </motion.div>

      {/* Events Cards Timeline Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {events.map((event, index) => (
          <GalleryCard key={`${event.title}-${index}`} event={event} cardVariants={cardVariants} />
        ))}
      </motion.div>
    </div>
  );
}
