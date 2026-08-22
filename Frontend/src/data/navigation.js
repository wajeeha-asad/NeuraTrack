import {
  LayoutDashboard,
  GraduationCap,
  Timer,
  BarChart3,
  Trophy,
  User,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Learning Paths",
    icon: GraduationCap,
    path: "/learning-paths",
  },
  {
    title: "Focus Sessions",
    icon: Timer,
    path: "/focus",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Achievements",
    icon: Trophy,
    path: "/achievements",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];