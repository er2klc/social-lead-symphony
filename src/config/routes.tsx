import { AppLayout } from "@/components/layout/AppLayout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Unity from "@/pages/Unity";
import Elevate from "@/pages/Elevate";
import TeamDetail from "@/pages/TeamDetail";
import PlatformDetail from "@/pages/PlatformDetail";
import Leads from "@/pages/Leads";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import Changelog from "@/pages/Changelog";
import Calendar from "@/pages/Calendar";
import TodoList from "@/pages/TodoList";
import Admin from "@/pages/Admin";
import LinkedInCallback from "@/pages/auth/callback/LinkedIn";
import InstagramCallback from "@/pages/auth/callback/Instagram";
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import InstagramDataDeletion from "@/pages/legal/InstagramDataDeletion";
import News from "@/pages/News";
import Support from "@/pages/Support";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const publicRoutes = [
  { path: "/", element: <Index /> },
  { path: "/auth", element: <Auth /> },
  { path: "/register", element: <Register /> },
  { path: "/news", element: <News /> },
  { path: "/support", element: <Support /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/auth/data-deletion/instagram", element: <InstagramDataDeletion /> },
  { path: "/auth/callback/linkedin", element: <LinkedInCallback /> },
  { path: "/auth/callback/instagram", element: <InstagramCallback /> },
];

export const protectedRoutes = [
  { 
    path: "/dashboard", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  { 
    path: "/admin", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Admin />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  { 
    path: "/calendar", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Calendar />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  { 
    path: "/todo", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <TodoList />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  { 
    path: "/unity", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Unity />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  { 
    path: "/unity/team/:teamSlug", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <TeamDetail />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  { 
    path: "/elevate", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Elevate />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  { 
    path: "/elevate/modul/:moduleSlug", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PlatformDetail />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  { 
    path: "/leads", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Leads />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  { 
    path: "/messages", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Messages />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  { 
    path: "/settings", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Settings />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  { 
    path: "/changelog", 
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Changelog />
        </AppLayout>
      </ProtectedRoute>
    )
  },
];