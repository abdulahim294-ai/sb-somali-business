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
import Pricing       from "@/pages/Pricing";
import Upgrade       from "@/pages/Upgrade";
import Dashboard     from "@/pages/Dashboard";
import ApplyJob      from "@/pages/ApplyJob";
import Applicants    from "@/pages/Applicants";
import Profile       from "@/pages/Profile";
import Settings      from "@/pages/Settings";
import CVPage        from "@/pages/CVPage";
import NotFound      from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/"                        component={Home}          />
      <Route path="/jobs"                    component={Jobs}          />
      <Route path="/jobs/:id/apply"          component={ApplyJob}      />
      <Route path="/jobs/:id/applicants"     component={Applicants}    />
      <Route path="/jobs/:id"               component={JobDetails}    />
      <Route path="/freelancers"             component={Freelancers}   />
      <Route path="/profile/:id"             component={Profile}       />
      <Route path="/cv/:id"                  component={CVPage}        />
      <Route path="/post-job"               component={PostJob}       />
      <Route path="/create-profile"          component={CreateProfile} />
      <Route path="/pricing"                 component={Pricing}       />
      <Route path="/upgrade/:planId"         component={Upgrade}       />
      <Route path="/dashboard"               component={Dashboard}     />
      <Route path="/settings"               component={Settings}      />
      <Route                                 component={NotFound}      />
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
