import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { TOrder } from "@/server/services/order.service";
import { useUserCurrency } from "@/hooks/useUserCurrency";

const getStatusBadge = (status: TOrder["status"]) => {
  switch (status) {
    case "completed":
      return (
        <Badge
          variant="default"
          className="bg-green-600 hover:bg-green-700 flex gap-1"
        >
          <CheckCircle className="w-3 h-3" />
          Completed
        </Badge>
      );
    case "paid":
      return (
        <Badge variant="secondary" className="flex gap-1">
          <Clock className="w-3 h-3" />
          Paid
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="destructive" className="flex gap-1">
          <AlertCircle className="w-3 h-3" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export function OrderCard({ order }: { order: TOrder }) {
  const { formatCurrency, secondaryCurrency } = useUserCurrency();
  return (
    <Card className="w-full max-w-md !gap-1 py-2 !px-2">
      <CardHeader className="!mb-0 !px-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              Date Placed:{" "}
              {new Date(order.createdAt.seconds * 1000).toDateString()}{" "}
            </CardTitle>
            <CardDescription className="text-sm text-black">
              Checkout Code: <span className="font-bold">{order.code}</span>
            </CardDescription>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 !px-2">
        {/* Order Items */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Items</h4>
          <ul className="space-y-1">
            {order.products.map((item, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span className="text-foreground">{item.name}</span>
                <span className="text-muted-foreground">
                  {item.quantity && `x${item.quantity}`}
                  {item.price &&
                    ` - ${formatCurrency({
                      number: item.price,
                      currency: secondaryCurrency,
                    })}`}
                </span>
              </li>
            ))}
          </ul>
          <Separator />
        </div>

        {/* Total Amount */}
        <div className="flex items-center justify-between ">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency({
              number: order.totalAmount,
              currency: secondaryCurrency,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
