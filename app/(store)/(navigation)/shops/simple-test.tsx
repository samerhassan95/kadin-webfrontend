"use client";

import React, { useEffect, useState } from 'react';

export default function SimpleShopsTest() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchShops() {
      try {
        console.log('🏪 Fetching shops...');
        const response = await fetch('http://localhost:8005/api/v1/rest/shops/paginate?has_reels=1&perPage=10');
        const data = await response.json();
        
        console.log('🏪 API Response:', data);
        
        if (response.ok) {
          setShops(data.data || []);
        } else {
          throw new Error(`API Error: ${response.status}`);
        }
      } catch (err) {
        console.error('❌ Error fetching shops:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading shops...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error loading shops</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Shops Test</h1>
      <p>Found {shops.length} shops with reels</p>
      
      {shops.length === 0 ? (
        <div>
          <h2>No shops found</h2>
          <p>This means either:</p>
          <ul>
            <li>The API is not returning data</li>
            <li>No shops have reels</li>
            <li>The has_reels filter is not working</li>
          </ul>
        </div>
      ) : (
        <div>
          <h2>Shops with reels:</h2>
          {shops.map((shop, index) => (
            <div key={shop.id || index} style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              margin: '10px 0',
              borderRadius: '5px'
            }}>
              <h3>Shop ID: {shop.id}</h3>
              <p><strong>Title:</strong> {shop.translation?.title || 'No title'}</p>
              <p><strong>Status:</strong> {shop.status}</p>
              <p><strong>UUID:</strong> {shop.uuid}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}