const axios = require('axios');

async function testOrder() {
  try {
    // 1. Generate QR Token
    const res = await axios.get('http://localhost:5001/api/qr/generate?locationName=Masa%2016');
    const token = res.data.token;
    console.log('Token generated:', token);

    // 2. Submit Order
    const payload = {
      qrToken: token,
      note: "test note from node",
      language: "en",
      items: [
        {
          productId: "7500",
          quantity: 1,
          note: "",
          selectedPreferencesJson: ""
        }
      ]
    };
    
    console.log('Submitting order...');
    const orderRes = await axios.post('http://localhost:5001/api/orders', payload);
    console.log('Order created successfully:', orderRes.data);
  } catch (err) {
    console.error('Failed:');
    if (err.response) {
      console.error(err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

testOrder();
