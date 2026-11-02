import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { contactStorage } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';
import { Mail, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { success, error } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      error('Missing fields', 'Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Save directly to database contact_messages
      contactStorage.addMessage({
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
      });

      setLoading(false);
      setSubmitted(true);
      success('Message sent!', 'Our support desk has received your note and will reply promptly.');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Get In Touch</span>
            <h1 className="text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
              Contact Support & Engineering
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Have questions regarding subscription billing, API integration, or technical indicator mechanics? Our team is on standby to assist you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#141923] border border-white/5">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Direct Email</h4>
                  <p className="text-xs text-slate-400 mt-0.5">support@signalpulse.io</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#141923] border border-white/5">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Response Time</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Under 2 hours for Pro subscribers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#16C784]/15 text-[#16C784] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Logged to Database</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Thank you, {name}. Your ticket has been saved to our inbox. An admin will follow up at {email}.
                </p>
                <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name"
                  placeholder="e.g. Satoshi Nakamoto"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Subject"
                  placeholder="e.g. Question regarding 4h signals"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How can our engineering or support team help you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full bg-[#0E131C] text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  rightIcon={<Send className="w-4 h-4" />}
                  className="w-full"
                >
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
