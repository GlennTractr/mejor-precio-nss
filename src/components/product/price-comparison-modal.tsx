'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

interface PriceComparisonModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bestPricePerUnit: number;
  quantityType: string;
  productTitle: string;
  bestOfferLink: string;
  bestOfferShop: string;
}

export function PriceComparisonModal({
  isOpen,
  onOpenChange,
  bestPricePerUnit,
  quantityType,
  productTitle,
  bestOfferLink,
  bestOfferShop,
}: PriceComparisonModalProps) {
  const t = useTranslations();
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  
  // Calculated values
  const [userPricePerUnit, setUserPricePerUnit] = useState<number | null>(null);
  const [percentageDifference, setPercentageDifference] = useState<number | null>(null);

  // Calculate price per unit and percentage difference when inputs change
  useEffect(() => {
    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(price);

    if (quantityNum > 0 && priceNum > 0) {
      const calculatedPricePerUnit = priceNum / quantityNum;
      setUserPricePerUnit(calculatedPricePerUnit);

      const difference = ((calculatedPricePerUnit - bestPricePerUnit) / bestPricePerUnit) * 100;
      setPercentageDifference(difference);
    } else {
      setUserPricePerUnit(null);
      setPercentageDifference(null);
    }
  }, [quantity, price, bestPricePerUnit]);

  // Clear inputs when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuantity('');
      setPrice('');
      setUserPricePerUnit(null);
      setPercentageDifference(null);
    }
  }, [isOpen]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value);
  };

  const getDifferenceColor = (percentage: number | null) => {
    if (percentage === null) return '';
    if (percentage < 0) return 'text-green-600';
    if (percentage > 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getDifferenceText = (percentage: number | null) => {
    if (percentage === null) return '';
    if (percentage < 0) {
      return `${Math.abs(percentage).toFixed(1)}% ${t('product.compareModal.better')}`;
    }
    if (percentage > 0) {
      return `${percentage.toFixed(1)}% ${t('product.compareModal.worse')}`;
    }
    return t('product.compareModal.same');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('product.compareModal.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Product info */}
          <div className="text-sm text-muted-foreground">
            <p className="truncate">{productTitle}</p>
          </div>
          
          {/* Best price reference */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">
              {t('product.compareModal.bestPrice')}
            </p>
            <p className="text-lg font-semibold text-green-600">
              {formatPrice(bestPricePerUnit)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / {quantityType || t('product.units.unit', { count: 1 })}
              </span>
            </p>
          </div>

          {/* Input fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('product.compareModal.price')}</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">
                {t('product.compareModal.quantity')} ({quantityType || t('product.units.unit', { count: 1 })})
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                min="0"
                step="any"
              />
            </div>
          </div>

          {/* Calculation results */}
          {userPricePerUnit !== null && (
            <div className="space-y-3 pt-2 border-t">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('product.compareModal.yourPrice')}
                </p>
                <p className="text-lg font-semibold">
                  {formatPrice(userPricePerUnit)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    / {quantityType || t('product.units.unit', { count: 1 })}
                  </span>
                </p>
              </div>

              {percentageDifference !== null && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('product.compareModal.difference')}
                  </p>
                  <p className={`text-lg font-semibold ${getDifferenceColor(percentageDifference)}`}>
                    {getDifferenceText(percentageDifference)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.close')}
            </Button>
            <Button
              variant="default"
              className="bg-accent hover:bg-accent/90"
              onClick={() => {
                window.open(bestOfferLink, '_blank');
              }}
            >
              {t('product.compareModal.buyBest')} - {bestOfferShop}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}