const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

// Step 1: Proxy and filter data from external API
app.get('/step1', async (req, res) => {
  try {
    const response = await axios.get('http://interview.surya-digital.in/get-electronics');
    const products = Array.isArray(response.data) ? response.data : [];
    //console.log('Raw API response:', products);
    // Filter and format products using camelCase keys from API response
    const filtered = products.filter(item => {
      return item.productId && item.productName && item.brandName && item.category && item.description && item.price && item.currency && item.processor && item.memory && item.releaseDate && item.averageRating && item.ratingCount;
    }).map(item => ({
      product_id: item.productId || null,
      product_name: item.productName || null,
      brand_name: item.brandName || null,
      category_name: item.category || null,
      description_text: item.description || null,
      price: item.price || null,
      currency: item.currency || null,
      processor: item.processor || null,
      memory: item.memory || null,
      release_date: item.releaseDate || null,
      average_rating: item.averageRating || null,
      rating_count: item.ratingCount || null
    }));
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching products:', error.message, error.response?.data);
    res.status(500).json({ error: 'Failed to fetch products.', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
