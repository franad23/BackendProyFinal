import { Resend } from 'resend';
const resend = new Resend('re_2R5oXo86_PbiVW6TwMPf647uipXqSMd2V');

export const sendEmail = async (email, subject, content) => {
  try {
    const data = await resend.emails.send({
      from: 'Echosurvey <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: content,
    });

    console.log(data);
  } catch (error) {
    console.error(error);
  }
};