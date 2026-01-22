// Netlify function: .netlify/functions/submit-hubspot.js
// ✅ No changes needed - already correct
const fetch = require('node-fetch');

const HUBSPOT_PORTAL_ID = "22103193";
const HUBSPOT_FORM_GUID = "0d05d36d-71ff-45ff-91b4-8188b1b578af";

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

    // Enhanced logging for debugging
    console.log('Submitting to HubSpot:', {
      product: data.currentProduct,
      productType: typeof data.currentProduct,
      calculatorType: data.calculatorType,
      squareFootage: data.squareFootage,
      buildingType: data.buildingType,
      savings: data.calculatedSavings,
      allData: data
    });

    // Filter out empty fields but log if critical fields are missing
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
      { name: 'calculator_square_footage', value: data.squareFootage ? String(data.squareFootage) : '' },
      { name: 'calculator_building_type', value: data.buildingType || '' },
      { name: 'calculator_current_product', value: data.currentProduct ? String(data.currentProduct) : '' },
      { name: 'calculator_savings', value: data.calculatedSavings ? String(data.calculatedSavings) : '' },
    ];

    // Log any critical calculator fields that are empty
    const calculatorFields = fields.filter(f => f.name.startsWith('calculator_'));
    const emptyCalcFields = calculatorFields.filter(f => !f.value);
    if (emptyCalcFields.length > 0) {
      console.log('WARNING: Empty calculator fields:', emptyCalcFields.map(f => f.name));
    }

    const payload = {
      fields: fields.filter(field => field.value !== ''),
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
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Failed to submit to HubSpot', 
          details: result,
          submittedFields: payload.fields.map(f => ({name: f.name, value: f.value}))
        }),
      };
    }

    console.log('HubSpot success:', result);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Form submitted successfully',
        submittedFields: payload.fields
      }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
