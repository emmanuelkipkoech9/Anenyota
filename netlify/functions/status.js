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
    const pathParts = event.path.split('/');
    const transactionId = pathParts[pathParts.length - 1];

    if (!transactionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Transaction ID is required' })
      };
    }

    const response = await fetch(`https://api.paylorke.com/api/v1/merchants/payments/transactions/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: text || 'Failed to fetch transaction status' })
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Status Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};