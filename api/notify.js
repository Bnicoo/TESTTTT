export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, embeds } = req.body;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not defined');
    return res.status(500).json({ error: 'Configuration error' });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        embeds,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorData = await response.text();
      console.error('Discord API error:', errorData);
      return res.status(response.status).json({ error: 'Discord API error' });
    }
  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
