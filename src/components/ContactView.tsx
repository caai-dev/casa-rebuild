import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';

export default function ContactView() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setFormSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
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
        <span className="text-[#b8935a] font-semibold text-[13px] tracking-widest uppercase mb-3">Get in Touch</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#0a1b33] font-medium tracking-tight max-w-2xl leading-tight">
          Connect With Our Compliance Experts
        </h1>
        <p className="font-sans text-[14px] md:text-[15px] text-slate-500 max-w-xl mt-4 leading-relaxed">
          Have a question about statutory audits, tax services, or global strategic advisory? Drop us a line and we will get back to you shortly.
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Info Details */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col gap-8 bg-white rounded-[32px] border border-slate-200/50 p-8 md:p-10 shadow-sm"
        >
          {/* Gold Star */}
          <div className="text-[#b8935a] self-start select-none">
            <span className="text-2xl">✦</span>
          </div>

          <div>
            <h2 className="font-display text-[22px] text-[#0a1b33] font-medium tracking-tight mb-2">
              Office Information
            </h2>
            <p className="font-sans text-[13px] text-slate-400 font-light leading-relaxed">
              Our specialists serve organizations globally from our main strategic base in India.
            </p>
          </div>

          {/* Contact Details Lists */}
          <div className="flex flex-col gap-6 pt-4 border-t border-slate-100">
            {/* Address */}
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-[#0a1b33]/5 text-[#0a1b33] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Head Office Address
                </span>
                <span className="font-sans text-[13.5px] text-[#0a1b33]/90 font-medium leading-relaxed mt-1">
                  C/o Sagar Agrawal, Near Dr. Shiv Swaroop Hospital, Main Market, Hasanpur, Dist. Amroha, UP - 244241, INDIA
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-[#0a1b33]/5 text-[#0a1b33] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Phone Number
                </span>
                <a 
                  href="tel:+919105130353"
                  className="font-sans text-[13.5px] text-[#0a1b33]/90 font-medium hover:text-[#b8935a] transition-colors mt-1"
                >
                  +91-91051-30353
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-[#0a1b33]/5 text-[#0a1b33] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  General Inquiries
                </span>
                <a 
                  href="mailto:info@casaauditgroup.com"
                  className="font-sans text-[13.5px] text-[#0a1b33]/90 font-medium hover:text-[#b8935a] transition-colors mt-1"
                >
                  info@casaauditgroup.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 bg-white rounded-[32px] border border-slate-200/50 p-8 md:p-10 shadow-sm relative overflow-hidden"
        >
          {formSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl text-[#0a1b33] font-medium tracking-tight mb-2">
                Inquiry Sent Successfully!
              </h2>
              <p className="font-sans text-[14px] text-slate-500 max-w-sm leading-relaxed">
                Thank you for reaching out. A specialist from CASA Audit Group will contact you within one business day.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <h2 className="font-display text-[22px] text-[#0a1b33] font-medium tracking-tight mb-2">
                Send a Message
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="form-name" className="font-sans text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] text-[#0a1b33] placeholder-slate-400 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all duration-200"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="form-email" className="font-sans text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] text-[#0a1b33] placeholder-slate-400 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="form-subject" className="font-sans text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Subject
                </label>
                <input
                  id="form-subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] text-[#0a1b33] placeholder-slate-400 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all duration-200"
                  placeholder="What is your inquiry about?"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="form-message" className="font-sans text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Message Details
                </label>
                <textarea
                  id="form-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-[13.5px] text-[#0a1b33] placeholder-slate-400 focus:outline-none focus:border-[#b8935a] focus:bg-white transition-all duration-200 resize-none"
                  placeholder="How can we assist you?"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#0a152d] text-white font-semibold text-[13.5px] py-4 rounded-2xl shadow-sm hover:shadow-md hover:bg-[#0a1b33] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4 text-white" />
                <span>Send Message</span>
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
