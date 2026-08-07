"use client";

import { useState, type ReactNode } from "react";
import { PartyPopper } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { JoinRunForm } from "@/components/public/JoinRunForm";

interface Props {
  className?: string;
  children: ReactNode;
}

export function JoinRunButton({ className, children }: Props) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setTimeout(() => setSubmitted(false), 200);
      }}
    >
      <DialogTrigger render={<button className={className}>{children}</button>} />
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-md">
        {submitted ? (
          <div className="py-4 text-center">
            <PartyPopper className="mx-auto h-10 w-10 text-brand-primary" />
            <h2 className="mt-3 font-heading text-xl tracking-wide">You&apos;re in!</h2>
            <p className="mt-2 text-sm text-text-muted">
              We&apos;ll reach out on WhatsApp with more info.
            </p>
            <Button className="mt-5 w-full" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Join a run</DialogTitle>
            </DialogHeader>
            <JoinRunForm onSuccess={() => setSubmitted(true)} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
