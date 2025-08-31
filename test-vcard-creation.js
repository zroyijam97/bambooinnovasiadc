const fetch = require('node-fetch');

async function testVCardCreation() {
  try {
    console.log('Testing VCard creation...');
    
    const testVCard = {
      slug: 'test-user-' + Date.now(),
      templateId: 'classic', // Use the seeded template
      title: 'Test User Card', // Required field
      name: 'Test User',
      email: 'test@example.com',
      phone: '123-456-7890',
      company: 'Test Company',
      jobTitle: 'Software Developer',
      bio: 'This is a test VCard'
    };

    console.log('Sending request to create VCard:', testVCard);
    
    const response = await fetch('http://localhost:3001/api/vcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testVCard)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (response.ok) {
      console.log('✅ VCard creation successful!');
      try {
        const data = JSON.parse(responseText);
        console.log('Created VCard:', data);
      } catch (e) {
        console.log('Response is not JSON');
      }
    } else {
      console.log('❌ VCard creation failed!');
      console.log('Error details:', responseText);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testVCardCreation();