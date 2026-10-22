import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminVideos from "./pages/AdminVideos";
import Home from "./pages/Home";

const appBase = typeof window !== "undefined" && window.location.pathname.startsWith("/phandinhluong") ? "/phandinhluong" : "/";

function Router() {
  return (
    <WouterRouter base={appBase}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin/videos" component={AdminVideos} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
