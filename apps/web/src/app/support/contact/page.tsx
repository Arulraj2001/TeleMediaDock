'use client';

import React, { useState } from 'react';
import { Button, Card } from '@mediadock/ui';
import { Send, Bug, MessageSquare } from 'lucide-react';

export default function ContactSupportPage() {
  const [ticketType, setTicketType] = useState<'support' | 'bug'>('bug');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 space-y-8 select-none">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Contact Support & Bug Report</h1>
        <p className="text-xs text-slate-400">
          Have a question or encountered a bug with MediaDock? Send a ticket directly to our development team.
        </p>
      </header>

      {submitted ? (
        <Card className="p-8 text-center space-y-4 bg-[#111827] border-emerald-900/50">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto font-bold text-lg">
            ✓
          </div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Ticket Received</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Thank you for contacting MediaDock support. Our team will review your report and respond within 24 hours.
          </p>
          <Button variant="outline" className="text-xs" onClick={() => setSubmitted(false)}>
            Submit Another Ticket
          </Button>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTicketType('bug')}
              className={`flex-1 p-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                ticketType === 'bug'
                  ? 'bg-[#4F46E5]/15 border-[#4F46E5] text-[#F8FAFC]'
                  : 'bg-[#111827] border-[#243047] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bug className="w-4 h-4 text-amber-400" />
              <span>Report a Bug</span>
            </button>
            <button
              type="button"
              onClick={() => setTicketType('support')}
              className={`flex-1 p-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                ticketType === 'support'
                  ? 'bg-[#4F46E5]/15 border-[#4F46E5] text-[#F8FAFC]'
                  : 'bg-[#111827] border-[#243047] text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#06B6D4]" />
              <span>General Inquiry</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Your Email Address</label>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#111827] border border-[#243047] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Subject</label>
              <input
                type="text"
                required
                placeholder={ticketType === 'bug' ? 'e.g. Telegram Web K layout detection issue' : 'e.g. Question about annual plan billing'}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#111827] border border-[#243047] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Description & Reproduction Steps</label>
              <textarea
                rows={5}
                required
                placeholder={
                  ticketType === 'bug'
                    ? 'Please describe: 1. Telegram Web version (K or A) 2. Browser version 3. Exact error message or expected behavior.'
                    : 'How can we help you?'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#111827] border border-[#243047] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
          </div>

          <Button variant="primary" className="w-full font-bold flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit Support Ticket</span>
          </Button>
        </form>
      )}
    </main>
  );
}
