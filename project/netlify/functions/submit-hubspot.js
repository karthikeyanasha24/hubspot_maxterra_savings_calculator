const fetch = require('node-fetch');

const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
const HUBSPOT_FORM_GUID = process.env.HUBSPOT_FORM_GUID;

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    const fields = [
      { name: 'firstname', value: data.firstName || '' },
      { name: 'lastname', value: data.lastName || '' },
      { name: 'email', value: data.email || '' },
      { name: 'phone', value: data.phone || '' },
      { name: 'address', value: data.streetAddress || '' },
      { name: 'city', value: data.city || '' },
      { name: 'state', value: data.state || '' },
      { name: 'zip', value: data.zipCode || '' },
      { name: 'company', value: data.company || '' },
      { name: 'calculator_type', value: data.calculatorType || '' },
      { name: 'calculator_square_footage', value: data.squareFootage || '' },
      { name: 'calculator_building_type', value: data.buildingType || '' },
      { name: 'calculator_current_product', value: data.currentProduct || '' },
      { name: 'calculator_savings', value: data.calculatedSavings || '' },
    ];

    const payload = {
      fields: fields,
      context: {
        pageUri: data.pageUri || 'https://nexgenbp.com/skip-the-dip',
        pageName: data.pageName || 'Skip the Dip Savings Calculator',
      },
    };

    if (data.hutk) {
      payload.context.hutk = data.hutk;
    }

    const hubspotResponse = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await hubspotResponse.json();

    if (!hubspotResponse.ok) {
      console.error('HubSpot API Error:', result);
      return {
        statusCode: hubspotResponse.status,
        body: JSON.stringify({ 
          error: 'Failed to submit to HubSpot', 
          details: result 
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Form submitted successfully' 
      }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
