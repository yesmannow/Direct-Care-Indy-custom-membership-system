'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { formatCentsAsCurrency } from '@/lib/currency';
import type { InventoryItem } from '@/db/schema';

interface WholesalePriceDirectoryProps {
  inventoryItems: InventoryItem[];
}

export function WholesalePriceDirectory({ inventoryItems }: WholesalePriceDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'medication' | 'lab'>('all');

  const medications = inventoryItems.filter(item => item.category === 'medication');
  const labs = inventoryItems.filter(item => item.category === 'lab');

  const filteredItems = (selectedCategory === 'all'
    ? inventoryItems
    : inventoryItems.filter(item => item.category === selectedCategory)
  ).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-2 border-[#2C3E50] bg-white">
      <CardHeader>
        <CardTitle className="text-2xl text-[#2C3E50]">
          Wholesale Price Directory
        </CardTitle>
        <CardDescription>
          True wholesale pricing - no markups, no insurance games. See exactly what you'll pay.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search medications or labs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-[#8A9A8A] text-white' : ''}
            >
              All ({inventoryItems.length})
            </Button>
            <Button
              variant={selectedCategory === 'medication' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('medication')}
              className={selectedCategory === 'medication' ? 'bg-[#8A9A8A] text-white' : ''}
            >
              Medications ({medications.length})
            </Button>
            <Button
              variant={selectedCategory === 'lab' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('lab')}
              className={selectedCategory === 'lab' ? 'bg-[#8A9A8A] text-white' : ''}
            >
              Labs ({labs.length})
            </Button>
          </div>
        </div>

        {/* Price List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No items found matching your search.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2C3E50]">{item.name}</h3>
                        {item.dosage && (
                          <p className="text-sm text-gray-600">{item.dosage}</p>
                        )}
                      </div>
                      <Badge variant={item.category === 'medication' ? 'default' : 'outline'}>
                        {item.category === 'medication' ? 'Med' : 'Lab'}
                      </Badge>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Wholesale Price</p>
                        <p className="text-2xl font-bold text-[#8A9A8A]">
                          {formatCentsAsCurrency(item.wholesalePrice)}
                        </p>
                      </div>
                      {item.stockLevel !== undefined && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">In Stock</p>
                          <p className="text-sm font-medium text-gray-700">
                            {item.stockLevel > 0 ? `${item.stockLevel} units` : 'Out of stock'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Note */}
        <div className="mt-6 p-4 bg-[#F0F0F0] rounded-lg border border-[#8A9A8A]">
          <p className="text-sm text-[#2C3E50]">
            <strong>Transparent Pricing:</strong> These are true wholesale prices with no markups.
            Compare to typical pharmacy prices where the same medications can cost 10x more.
            Your membership gives you access to these wholesale rates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

