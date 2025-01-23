'use client';

import React from 'react';
import { useParams } from 'next/navigation';

const ProductPage = () => {
  const { category, product_slug } = useParams();

  // Static product data
  const product = {
    title: 'Sample Product',
    description: 'This is a sample product description.',
    price: '$99.99',
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl font-semibold">{product.price}</p>
      <ul>
        <li>Category: {category}</li>
        <li>Product Slug: {product_slug}</li>
      </ul>
    </div>
  );
};

export default ProductPage;
