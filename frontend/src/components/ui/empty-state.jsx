import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Package, ShoppingCart, Users, FileText } from "lucide-react";

const icons = {
  package: Package,
  cart: ShoppingCart,
  users: Users,
  file: FileText,
  default: Package,
};

export function EmptyState({ 
  icon = "default", 
  title, 
  description, 
  action, 
  actionLabel,
  className, 
  ...props 
}) {
  const Icon = icons[icon] || icons.default;

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)} {...props}>
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-md">{description}</p>
      )}
      {action && actionLabel && (
        <Button onClick={action} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
