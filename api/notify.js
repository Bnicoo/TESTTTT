export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, embeds } = req.body;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_CHANNEL_ID;

  if (!botToken || !channelId) {
    console.error('DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ID is not defined');
    return res.status(500).json({ error: 'Configuration error' });
  }

  try {
    // API Discord pour envoyer un message dans un salon spécifique
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${botToken}`,
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
