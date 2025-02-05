import { lazy } from "react";

const PresentationPage = lazy(() => import("@/pages/presentation/[leadId]/[pageId]"));
const Auth = lazy(() => import("@/pages/Auth"));
const Register = lazy(() => import("@/pages/Register"));
const PrivacyPolicy = lazy(() => import("@/pages/legal/PrivacyPolicy"));
const InstagramDataDeletion = lazy(() => import("@/pages/legal/InstagramDataDeletion"));

export const publicRoutes = [
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/auth/data-deletion/instagram",
    element: <InstagramDataDeletion />,
  },
  {
    path: "/presentation/:leadId/:pageId",
    element: <PresentationPage />,
  },
];