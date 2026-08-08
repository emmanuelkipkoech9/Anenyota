const fetch = require('node-fetch');

const apiKey = "pk_z8Oze0kjIu8Nd1P9qN31Y-nK0oaRcvhA".trim();

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { phone, amount, reference, channelId, description } = JSON.parse(event.body);

    if (!phone || !amount || !reference || !channelId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: phone, amount, reference, channelId' })
      };
    }

    const payload = {
      phone: phone,  // already in 254 format from frontend
      amount: Number(amount),
      reference,
      channelId,
      description: description || 'NYOTA Fund Payment'
    };

    const response = await fetch('https://api.paylorke.com/api/v1/merchants/payments/stk-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: data.message || data.error || 'STK push failed' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('STK Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};