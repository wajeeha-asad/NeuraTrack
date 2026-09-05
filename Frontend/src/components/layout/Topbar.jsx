import { useEffect, useState } from "react";
import { Bell, CheckCheck, Menu, Search } from "lucide-react";

import { Input } from "../ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import { NavLink } from "react-router-dom";
import { navigation } from "../../data/navigation";
import Logo from "../common/Logo";

export default function Topbar() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load unread notification count when Topbar loads
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const data = await getUnreadNotificationCount();
        setUnreadCount(data.count);
      } catch (error) {
        console.error(
          "Failed to load notification count:",
          error
        );
      }
    };

    loadUnreadCount();
  }, []);

  // Load notifications when the notification dropdown opens
  const handleNotificationMenuOpen = async (open) => {
    if (!open) return;

    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );
    }
  };

  // Mark one notification as read
  const handleNotificationClick = async (notification) => {
    if (notification.is_read) return;

    try {
      const updatedNotification =
        await markNotificationAsRead(notification.id);

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === updatedNotification.id
            ? updatedNotification
            : item
        )
      );

      setUnreadCount((currentCount) =>
        Math.max(currentCount - 1, 0)
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#090B1F]/90 px-4 backdrop-blur-md sm:px-6">

      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 hover:bg-white/5 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[280px] border-r border-white/10 bg-[#070B1D] p-0 text-white"
        >
          <SheetHeader className="border-b border-white/10 px-5 py-6">
            <SheetTitle className="text-white">
              <Logo />
            </SheetTitle>
          </SheetHeader>

          <nav className="space-y-2 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                      isActive
                        ? "bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] text-white"
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="relative min-w-0 flex-1 sm:max-w-md lg:max-w-xl">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <Input
          placeholder="Search..."
          className="h-10 w-full pl-10"
        />
      </div>

      {/* Notifications */}
      <DropdownMenu
        onOpenChange={handleNotificationMenuOpen}
      >
        <DropdownMenuTrigger asChild>
          <button
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 hover:bg-white/5"
            aria-label="Notifications"
          >
            <Bell size={19} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-80 border-white/10 bg-[#11152F] text-white"
        >
          {/* Notification header */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-white">
              Notifications
            </span>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
              >
                <CheckCheck size={14} />
                Mark all as read
              </button>
            )}
          </div>

          <DropdownMenuSeparator />

          {/* Empty state */}
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              No notifications yet.
            </div>
          ) : (
            /* Notification list */
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() =>
                  handleNotificationClick(notification)
                }
                className={`mb-1 cursor-pointer rounded-lg px-3 py-3 ${
                  notification.is_read
                    ? "bg-transparent"
                    : "bg-white/5"
                }`}
              >
                <div className="flex w-full items-start gap-3">
                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-400" />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">
                      {notification.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {notification.message}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      {new Date(
                        notification.created_at
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}