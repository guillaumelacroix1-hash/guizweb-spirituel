/* Envoi du formulaire de contact via Resend.
   La clé API vit dans la variable d'environnement RESEND_API_KEY
   (configurée sur Vercel) — jamais dans le code. */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, activity, message, website } = req.body || {};

  // honeypot anti-spam : un humain ne remplit jamais ce champ
  if (website) return res.status(200).json({ ok: true });

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  const clip = (s, n) => String(s).slice(0, n);

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Guizweb <onboarding@resend.dev>',
      to: ['guillaumelacroix1@gmail.com'],
      reply_to: clip(email, 200),
      subject: `✦ Contact guizweb — ${clip(name, 100)}`,
      text: [
        `Nom : ${clip(name, 100)}`,
        `Email : ${clip(email, 200)}`,
        `Pratique : ${clip(activity || '—', 200)}`,
        '',
        'Message :',
        clip(message, 5000),
      ].join('\n'),
    }),
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    console.error('Resend error', r.status, detail);
    return res.status(502).json({ error: 'Envoi impossible' });
  }

  return res.status(200).json({ ok: true });
}
