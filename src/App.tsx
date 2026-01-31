import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DevAuthProvider } from "@/contexts/DevAuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dev from "./pages/Dev";
import DevDashboard from "./pages/DevDashboard";
import DevProjects from "./pages/DevProjects";
import DevSkills from "./pages/DevSkills";
import DevProfile from "./pages/DevProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DevAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dev" element={<Dev />} />
            <Route path="/dev/dashboard" element={<DevDashboard />} />
            <Route path="/dev/projects" element={<DevProjects />} />
            <Route path="/dev/skills" element={<DevSkills />} />
            <Route path="/dev/profile" element={<DevProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DevAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
