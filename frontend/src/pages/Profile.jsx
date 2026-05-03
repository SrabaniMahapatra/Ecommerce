import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Heart, LogOut, Mail, Package, Phone, User as UserIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import SectionContainer from "../components/SectionContainer";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return null;
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate({ to: "/" });
    }
  };

  return (
    <div className="pt-20 lg:pt-28 min-h-screen bg-background pb-16">
      <SectionContainer>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
              My Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your account information
            </p>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-8 shadow-card mb-8"
          >
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-1">
                  {user?.name || "User"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {user?.role === "admin" ? "Admin Account" : "Customer Account"}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-foreground text-lg mb-4">
                Contact Information
              </h3>
              
              <div className="flex items-center gap-3 text-foreground/80">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground mb-0.5">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              {user?.phone && (
                <div className="flex items-center gap-3 text-foreground/80">
                  <Phone size={18} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-0.5">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Account Statistics */}
            {user?.role !== "admin" && (
              <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-border">
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {user?.totalOrders || 0}
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                  <p className="font-display text-2xl font-semibold text-foreground">
                    ₹{(user?.totalSpent || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 font-semibold transition-smooth"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.div>

          {/* Quick Links */}
          {user?.role !== "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* My Orders Card */}
              <Link
                to="/my-orders"
                className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-smooth">
                    <Package size={24} />
                  </div>
                  <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-smooth" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  My Orders
                </h3>
                <p className="text-sm text-muted-foreground">
                  View your order history and track status
                </p>
              </Link>

              {/* Wishlist Card */}
              <Link
                to="/wishlist"
                className="group bg-card rounded-2xl border border-border p-6 hover:border-red-500/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600 group-hover:bg-red-500/20 transition-smooth">
                    <Heart size={24} />
                  </div>
                  <ArrowRight size={20} className="text-muted-foreground group-hover:text-red-600 transition-smooth" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  Wishlist
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your favorite products saved for later
                </p>
              </Link>
            </motion.div>
          )}

          {/* Admin Quick Links */}
          {user?.role === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <Link
                to="/admin/dashboard"
                className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-smooth">
                    <Package size={24} />
                  </div>
                  <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-smooth" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  Dashboard
                </h3>
                <p className="text-sm text-muted-foreground">
                  View analytics and manage your store
                </p>
              </Link>

              <Link
                to="/admin/orders"
                className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-smooth">
                    <Package size={24} />
                  </div>
                  <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-smooth" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  Manage Orders
                </h3>
                <p className="text-sm text-muted-foreground">
                  View and update customer orders
                </p>
              </Link>
            </motion.div>
          )}
        </div>
      </SectionContainer>
    </div>
  );
}
