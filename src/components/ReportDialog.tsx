import { useState } from "react";
import { Flag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea, Label } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REPORT_REASONS } from "@/utils/trustScore";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (reason: string, details: string) => void;
  isPending?: boolean;
}

export function ReportDialog({ open, onOpenChange, onSubmit, isPending }: Props) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  function close(v: boolean) {
    if (!v) {
      setReason("");
      setDetails("");
    }
    onOpenChange(v);
  }

  function submit() {
    if (!reason) return;
    onSubmit(reason, details);
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Flag className="w-5 h-5" /> Soo sheeg shaqadan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <p>
              Haddii shaqadan ay khayaano tahay ama macluumaad been ah, fadlan
              noo soo sheeg. Si dhakhso ah ayaanu u baari doonaa.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>
              Sababta <span className="text-destructive">*</span>
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Dooro sabab..." />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Faahfaahin dheeraad ah (ikhtiyaari)</Label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Ku sharax waxa dhacay..."
              className="min-h-[90px]"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => close(false)}
            >
              Jooji
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={!reason || isPending}
              onClick={submit}
              loading={isPending}
            >
              Soo sheeg
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
