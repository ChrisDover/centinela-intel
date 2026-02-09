export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = req.body?.email;
  if (!email) {
    return res.redirect(302, '/');
  }

  try {
    // Hit Beehiiv magic link from server — triggers confirmation email
    await fetch(
      `https://magic.beehiiv.com/v1/db534200-5b71-4bd3-9ebd-f3f6153ab37d?email=${encodeURIComponent(email)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CentinelaIntel/1.0)',
          'Accept': 'text/html,application/xhtml+xml'
        }
      }
    );
  } catch (e) {
    // Still redirect to welcome even if Beehiiv call fails
  }

  res.redirect(302, '/welcome');
}
