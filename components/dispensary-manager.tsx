'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit } from 'lucide-react';
import { formatCentsAsCurrency } from '@/lib/currency';
import type { InventoryItem } from '@/db/schema';

interface DispensaryManagerProps {
  inventoryItems: InventoryItem[];
}

export function DispensaryManager({ inventoryItems }: DispensaryManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'medication' | 'lab'>('all');

  const medications = inventoryItems.filter(item => item.category === 'medication');

  const filteredItems = (categoryFilter === 'all'
    ? inventoryItems
    : inventoryItems.filter(item => item.category === categoryFilter)
  ).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock expiration dates - in production these would be in the database
  const getExpirationDate = (itemId: number) => {
    const monthsFromNow = (itemId % 12) + 1;
    const date = new Date();
    date.setMonth(date.getMonth() + monthsFromNow);
    return date;
  };

  const getStockStatus = (stockLevel: number) => {
    if (stockLevel === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stockLevel < 20) return { label: 'Low Stock', variant: 'outline' as const };
    return { label: 'In Stock', variant: 'success' as const };
  };

  return (
    <Card className="border-2 border-[#2C3E50] bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-[#2C3E50]">In-House Dispensary Manager</CardTitle>
            <CardDescription>
              Manage wholesale pharmacy inventory, pill counts, expiration dates, and pricing
            </CardDescription>
          </div>
          <Button className="bg-[#8A9A8A] hover:bg-[#7A8A7A] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                categoryFilter === 'all'
                  ? 'bg-[#8A9A8A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({inventoryItems.length})
            </button>
            <button
              onClick={() => setCategoryFilter('medication')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                categoryFilter === 'medication'
                  ? 'bg-[#8A9A8A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Medications ({medications.length})
            </button>
            <button
              onClick={() => setCategoryFilter('lab')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                categoryFilter === 'lab'
                  ? 'bg-[#8A9A8A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Labs ({inventoryItems.length - medications.length})
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Wholesale Price</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No items found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item.stockLevel);
                  const expirationDate = getExpirationDate(item.id);
                  const isExpiringSoon = expirationDate.getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000; // 90 days

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant={item.category === 'medication' ? 'default' : 'outline'}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.dosage || '—'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{item.stockLevel}</span>
                          <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-[#8A9A8A]">
                        {formatCentsAsCurrency(item.wholesalePrice)}
                      </TableCell>
                      <TableCell>
                        <span className={isExpiringSoon ? 'text-red-600 font-medium' : ''}>
                          {expirationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {isExpiringSoon && (
                          <Badge variant="destructive" className="ml-2">Expiring Soon</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

