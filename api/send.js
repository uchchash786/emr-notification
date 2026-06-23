const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, title, body, click_action } = req.body;

  try {
    const response = await admin.messaging().send({
      token: token,
      data: {
        title: title,
        body: body,
        click_action: click_action || ''
      }
    });
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
