import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReceiptProvider } from "@/contexts/receipt-context";
import NotFound from "@/pages/not-found";
import ReceiptGenerator from "@/pages/receipt-generator";
import ReceiptHistory from "@/pages/receipt-history";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ReceiptGenerator} />
      <Route path="/history" component={ReceiptHistory} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReceiptProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ReceiptProvider>
    </QueryClientProvider>
  );
}

export default App;
