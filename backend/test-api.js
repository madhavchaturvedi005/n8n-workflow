import axios from 'axios';

const API_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing n8n Workflow AI API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test search endpoint
    console.log('\n2. Testing search endpoint...');
    const searchResponse = await axios.post(`${API_URL}/api/search`, {
      query: 'email notification workflow'
    });
    
    console.log('✅ Search results:');
    console.log(`   Found ${searchResponse.data.count} workflows`);
    
    if (searchResponse.data.results.length > 0) {
      const firstResult = searchResponse.data.results[0];
      console.log(`   Top result: "${firstResult.name}" (${Math.round(firstResult.score * 100)}% match)`);
    }

    console.log('\n🎉 All tests passed! API is working correctly.');

  } catch (error) {
    console.error('❌ API test failed:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   Connection refused - make sure the server is running on port 3001');
      console.error('   Run: npm run dev');
    } else if (error.response) {
      console.error(`   HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

testAPI();