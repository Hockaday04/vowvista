import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.SENDGRID_FROM_EMAIL || 'hello@vowvista.co.uk',
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  await sgMail.send({ to, from, subject, html });
}
