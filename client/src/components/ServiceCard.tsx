import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

export function ServiceCard({ title, description, icon: Icon, className, delay = 0 }: ServiceCardProps) {
  return (
    <div 
      className={cn(
        "group relative bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
      data-testid={`card-service-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -z-0 transition-transform group-hover:scale-150 duration-500 origin-top-right" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
          <Icon size={24} className="text-primary group-hover:text-white" />
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
