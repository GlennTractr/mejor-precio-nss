'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const CategoryPage = () => {
  const { category } = useParams();

  // Static product data with slugs
  const products = [
    {
      title: 'Product 1',
      description: 'Description for product 1',
      price: '$10.00',
      slug: 'product-1',
    },
    {
      title: 'Product 2',
      description: 'Description for product 2',
      price: '$20.00',
      slug: 'product-2',
    },
    {
      title: 'Product 3',
      description: 'Description for product 3',
      price: '$30.00',
      slug: 'product-3',
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Category: {category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <Link key={index} href={`/products/${category}/${product.slug}`}>
            <Card className="cursor-pointer hover:bg-gray-100">
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{product.price}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
