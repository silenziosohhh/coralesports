"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/money";

type Order = {
  id: string;
  totalCents: number;
  currency: string;
  status: string;
  createdAt: string;
  user: { name: string | null; discordTag: string | null } | null;
  items: {
    quantity: number;
    product: { name: string };
  }[];
};

export function ViewOrdersDialog({ orders }: { orders: Order[] }) {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-500/15 text-emerald-200";
      case "PENDING":
        return "bg-amber-500/15 text-amber-200";
      case "CANCELLED":
        return "bg-red-500/15 text-red-200";
      case "REFUNDED":
        return "bg-blue-500/15 text-blue-200";
      default:
        return "bg-white/10 text-white";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Visualizza Ordini ({orders.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Tutti gli Ordini</DialogTitle>
          <DialogDescription>Visualizza e gestisci tutti gli ordini dello shop.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {orders.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-white/30" />
              <p className="text-white/60">Nessun ordine trovato</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold text-white">
                        {formatPrice(order.totalCents, order.currency)}
                      </div>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-white/60">
                      {order.user?.discordTag || order.user?.name || "Guest"} •{" "}
                      {new Date(order.createdAt).toLocaleString("it-IT")}
                    </div>
                    <div className="mt-2 space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm text-white/70">
                          {item.quantity}× {item.product.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/admin/shop/orders/${order.id}`}>Dettagli</a>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
