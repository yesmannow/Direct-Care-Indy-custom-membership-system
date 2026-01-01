'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { calculateAge, getAgeTier, getMonthlyRate, formatCurrency } from '@/lib/pricing';
import type { Member, Household } from '@/db/schema';

interface PatientDirectoryProps {
  members: Member[];
  households: Household[];
}

export function PatientDirectory({ members, households }: PatientDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_payment' | 'inactive'>('all');

  // Mock data for high deductible plan and high-frequency flags
  // In production, this would come from the database
  const getHighDeductibleFlag = (memberId: number) => {
    // Mock: every 3rd member has high deductible
    return memberId % 3 === 0;
  };

  const getHighFrequencyFlag = (memberId: number) => {
    // Mock: every 5th member is high frequency
    return memberId % 5 === 0;
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="border-2 border-[#2C3E50] bg-white">
      <CardHeader>
        <CardTitle className="text-2xl text-[#2C3E50]">Patient Directory</CardTitle>
        <CardDescription>
          Searchable directory with server-side filtering. Flags for high deductible plans and high-frequency patients.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                statusFilter === 'all'
                  ? 'bg-[#8A9A8A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({members.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                statusFilter === 'active'
                  ? 'bg-[#8A9A8A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({members.filter(m => m.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('pending_payment')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                statusFilter === 'pending_payment'
                  ? 'bg-[#8A9A8A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({members.filter(m => m.status === 'pending_payment').length})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                statusFilter === 'inactive'
                  ? 'bg-[#8A9A8A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactive ({members.filter(m => m.status === 'inactive').length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Monthly Rate</TableHead>
                <TableHead>Household</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Flags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    No members found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => {
                  const household = households.find(h => h.id === member.householdId);
                  const age = calculateAge(member.dateOfBirth);
                  const tier = getAgeTier(age);
                  const monthlyRate = getMonthlyRate(tier);
                  const hasHighDeductible = getHighDeductibleFlag(member.id);
                  const isHighFrequency = getHighFrequencyFlag(member.id);

                  return (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.firstName} {member.lastName}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{age}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {tier.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(monthlyRate)}</TableCell>
                      <TableCell>{household?.name || '—'}</TableCell>
                      <TableCell>
                        {member.status === 'active' ? (
                          <Badge variant="success">Active</Badge>
                        ) : member.status === 'pending_payment' ? (
                          <Badge variant="secondary">Pending</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {hasHighDeductible && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                              High Deductible
                            </Badge>
                          )}
                          {isHighFrequency && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
                              High Frequency
                            </Badge>
                          )}
                        </div>
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

