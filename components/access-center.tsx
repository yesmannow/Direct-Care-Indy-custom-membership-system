'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Video } from 'lucide-react';

export function AccessCenter() {
  const handleSecureText = () => {
    // In production, this would open a secure messaging interface
    window.location.href = 'sms:+1234567890';
  };

  const handleTelehealth = () => {
    // In production, this would open a telehealth scheduling interface
    window.location.href = '/portal/telehealth';
  };

  return (
    <Card className="border-2 border-[#8A9A8A] bg-white">
      <CardHeader>
        <CardTitle className="text-2xl text-[#2C3E50]">
          The "Mechanic" Access Center
        </CardTitle>
        <CardDescription>
          Direct access to your healthcare provider - no gatekeepers, no waiting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <Button
            className="h-24 bg-[#8A9A8A] hover:bg-[#7A8A7A] text-white text-lg"
            onClick={handleSecureText}
          >
            <MessageSquare className="mr-3 h-6 w-6" />
            Secure Text with Provider
          </Button>
          <Button
            variant="outline"
            className="h-24 border-2 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white text-lg"
            onClick={handleTelehealth}
          >
            <Video className="mr-3 h-6 w-6" />
            Request Telehealth
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Get same-day responses and appointments. No insurance pre-authorization needed.
        </p>
      </CardContent>
    </Card>
  );
}

