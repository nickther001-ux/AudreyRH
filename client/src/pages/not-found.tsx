import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="p-8 text-center space-y-6 max-w-md mx-auto">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
          <AlertTriangle size={40} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900">404 Page Not Found</h1>
        <p className="text-gray-600 text-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link href="/">
          <Button size="lg" className="mt-4 bg-primary hover:bg-primary/90 text-white w-full">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
