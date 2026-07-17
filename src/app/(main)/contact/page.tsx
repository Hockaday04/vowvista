'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="section-padding">
        <div className="container-main max-w-lg text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Message Sent!</h1>
          <p className="mt-4 text-gray-600">
            Thank you for getting in touch. Well get back to you within 24 hours.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-primary mt-6">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="section-padding bg-gradient-to-b from-primary-50 to-white">
        <div className="container-main max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 text-center">
            Contact Us
          </h1>
          <p className="mt-6 text-lg text-gray-600 text-center">
            Have a question or need help? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card p-6 text-center">
              <div className="text-2xl mb-3">📧</div>
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-sm text-gray-600 mt-1">hello@vowvista.co.uk</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-2xl mb-3">📞</div>
              <h3 className="font-semibold text-gray-900">Phone</h3>
              <p className="text-sm text-gray-600 mt-1">0800 123 4567</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-2xl mb-3">🕐</div>
              <h3 className="font-semibold text-gray-900">Hours</h3>
              <p className="text-sm text-gray-600 mt-1">Mon-Fri, 9am-6pm GMT</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Your Name"
                placeholder="Jane Smith"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="jane@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <Select
              label="Subject"
              error={errors.subject?.message}
              options={[
                { value: '', label: 'Select a subject...' },
                { value: 'general', label: 'General Enquiry' },
                { value: 'supplier', label: 'Supplier Support' },
                { value: 'billing', label: 'Billing Question' },
                { value: 'partnership', label: 'Partnership Opportunity' },
                { value: 'feedback', label: 'Feedback' },
              ]}
              {...register('subject')}
            />

            <Textarea
              label="Your Message"
              placeholder="Tell us how we can help..."
              error={errors.message?.message}
              {...register('message')}
            />

            <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
