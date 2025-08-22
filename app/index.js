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

// Step 2: Add release date filters
app.get('/step2', async (req, res) => {
  try {
    const { release_date_start, release_date_end } = req.query;
    // Validate date format if provided
    const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (release_date_start && !isValidDate(release_date_start)) {
      return res.status(400).json({ error: 'Invalid release_date_start format. Use YYYY-MM-DD.' });
    }
    if (release_date_end && !isValidDate(release_date_end)) {
      return res.status(400).json({ error: 'Invalid release_date_end format. Use YYYY-MM-DD.' });
    }
    const response = await axios.get('http://interview.surya-digital.in/get-electronics');
    const products = Array.isArray(response.data) ? response.data : [];
    const filtered = products.filter(item => {
      // Only include items with all required fields
      if (!(item.productId && item.productName && item.brandName && item.category && item.description && item.price && item.currency && item.processor && item.memory && item.releaseDate && item.averageRating && item.ratingCount)) {
        return false;
      }
      // Filter by release date if provided
      if (release_date_start && item.releaseDate < release_date_start) return false;
      if (release_date_end && item.releaseDate > release_date_end) return false;
      return true;
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
    console.error('Error in /step2:', error.message, error.response?.data);
    res.status(500).json({ error: 'Failed to fetch products.', details: error.message });
  }
});

// Step 3: Add brand filters (with release date filters)
app.get('/step3', async (req, res) => {
  try {
    const { brands, release_date_start, release_date_end } = req.query;
    // Validate date format if provided
    const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (release_date_start && !isValidDate(release_date_start)) {
      return res.status(400).json({ error: 'Invalid release_date_start format. Use YYYY-MM-DD.' });
    }
    if (release_date_end && !isValidDate(release_date_end)) {
      return res.status(400).json({ error: 'Invalid release_date_end format. Use YYYY-MM-DD.' });
    }
    // Parse brands into array
    let brandList = [];
    if (brands) {
      brandList = brands.split(',').map(b => b.trim()).filter(b => b.length > 0);
    }
    const response = await axios.get('http://interview.surya-digital.in/get-electronics');
    const products = Array.isArray(response.data) ? response.data : [];
    const filtered = products.filter(item => {
      // Only include items with all required fields
      if (!(item.productId && item.productName && item.brandName && item.category && item.description && item.price && item.currency && item.processor && item.memory && item.releaseDate && item.averageRating && item.ratingCount)) {
        return false;
      }
      // Filter by release date if provided
      if (release_date_start && item.releaseDate < release_date_start) return false;
      if (release_date_end && item.releaseDate > release_date_end) return false;
      // Filter by brand(s) if provided
      if (brandList.length > 0 && !brandList.includes(item.brandName)) return false;
      return true;
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
    console.error('Error in /step3:', error.message, error.response?.data);
    res.status(500).json({ error: 'Failed to fetch products.', details: error.message });
  }
});

// Step 4: Add pagination (with brand and release date filters)
app.get('/step4', async (req, res) => {
  try {
    const { page_size, page_number, brands, release_date_start, release_date_end } = req.query;
    // Validate date format if provided
    const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (release_date_start && !isValidDate(release_date_start)) {
      return res.status(400).json({ error: 'Invalid release_date_start format. Use YYYY-MM-DD.' });
    }
    if (release_date_end && !isValidDate(release_date_end)) {
      return res.status(400).json({ error: 'Invalid release_date_end format. Use YYYY-MM-DD.' });
    }
    // Validate pagination params
    const size = parseInt(page_size, 10);
    const number = parseInt(page_number, 10);
    if (isNaN(size) || size <= 0) {
      return res.status(400).json({ error: 'page_size is required and must be a positive integer.' });
    }
    if (isNaN(number) || number <= 0) {
      return res.status(400).json({ error: 'page_number is required and must be a positive integer.' });
    }
    // Parse brands into array
    let brandList = [];
    if (brands) {
      brandList = brands.split(',').map(b => b.trim()).filter(b => b.length > 0);
    }
    const response = await axios.get('http://interview.surya-digital.in/get-electronics');
    const products = Array.isArray(response.data) ? response.data : [];
    // Filter products
    const filtered = products.filter(item => {
      if (!(item.productId && item.productName && item.brandName && item.category && item.description && item.price && item.currency && item.processor && item.memory && item.releaseDate && item.averageRating && item.ratingCount)) {
        return false;
      }
      if (release_date_start && item.releaseDate < release_date_start) return false;
      if (release_date_end && item.releaseDate > release_date_end) return false;
      if (brandList.length > 0 && !brandList.includes(item.brandName)) return false;
      return true;
    });
    // Pagination
    const startIdx = (number - 1) * size;
    const paginated = filtered.slice(startIdx, startIdx + size).map(item => ({
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
    res.json(paginated);
  } catch (error) {
    console.error('Error in /step4:', error.message, error.response?.data);
    res.status(500).json({ error: 'Failed to fetch products.', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
