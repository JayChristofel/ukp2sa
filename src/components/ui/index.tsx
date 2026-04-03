"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  icon?: React.ReactNode;
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  loading,
  icon,
  asChild,
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";

  const variants = {
    primary:
      "bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/30",
    secondary:
      "bg-accent text-white hover:brightness-110 shadow-lg shadow-accent/30",
    outline:
      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm",
    ghost:
      "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-12 px-6 text-sm",
    lg: "h-14 px-8 text-base",
    icon: "size-10 p-0 flex items-center justify-center",
  };

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...((!asChild ? { disabled: loading || props.disabled } : {}) as any)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? (
            <span className="animate-spin size-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            icon
          )}
          {children}
        </>
      )}
    </Comp>
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  glass,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm",
        glass
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl"
          : "bg-white dark:bg-slate-900",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "outline" | "emerald" | "rose" | "amber";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "primary",
  ...props
}) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    outline:
      "bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
};

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  className,
  ...props
}) => {
  return (
    <label
      className={cn(
        "text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 mb-2 block",
        className,
      )}
      {...props}
    />
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
        className,
      )}
      {...props}
    />
  );
};
