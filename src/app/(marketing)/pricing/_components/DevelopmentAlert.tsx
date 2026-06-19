'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ALERT_SHOWN_KEY = 'development-alert-shown';

export default function DevelopmentAlert() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenAlert = localStorage.getItem(ALERT_SHOWN_KEY);
    if (!hasSeenAlert) {
      setOpen(true);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <DialogTitle>Development Project Notice</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            This is a development project and not a fully operational application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-foreground text-sm">
            Please note that <strong>no actual payments are processed</strong> on this platform. The pricing page and payment features are for demonstration purposes only.
          </p>
          <p className="text-foreground text-sm">
            This is a proof-of-concept application showcasing route optimization and trip planning capabilities.
          </p>
          <Button
            onClick={() => {
              localStorage.setItem(ALERT_SHOWN_KEY, 'true');
              setOpen(false);
            }}
            className="w-full"
          >
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
