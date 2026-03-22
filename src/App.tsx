import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toast";
import Home          from "@/pages/Home";
import Jobs          from "@/pages/Jobs";
import JobDetails    from "@/pages/JobDetails";
import Freelancers   from "@/pages/Freelancers";
import PostJob       from "@/pages/PostJob";
import CreateProfile from "@/pages/CreateProfile";
import NotFound      from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/"               component={Home}          />
      <Route path="/jobs"           component={Jobs}          />
      <Route path="/jobs/:id"       component={JobDetails}    />
      <Route path="/freelancers"    component={Freelancers}   />
      <Route path="/post-job"       component={PostJob}       />
      <Route path="/create-profile" component={CreateProfile} />
      <Route                        component={NotFound}      />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
