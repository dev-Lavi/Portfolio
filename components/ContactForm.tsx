"use client";

import React, { useState, useEffect, useRef } from "react";
import { FlowButton } from "./FlowButton";

interface FormValues {
  name: string;
  email: string;
  message: string;
  botcheck: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

// Ensure inputs use standard sans font so lowercase letters display naturally
const inputFontStyle: React.CSSProperties = {
  fontFamily: "var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    message: "",
    botcheck: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key in keyof FormValues]?: boolean }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 10-second client-side throttle countdown
  useEffect(() => {
    if (cooldown > 0) {
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, [cooldown]);

  const validateField = (field: keyof FormValues, val: string): string | undefined => {
    const trimmed = val.trim();
    if (field === "name") {
      if (!trimmed) return "Name is required.";
      if (trimmed.length < 2) return "Name must be at least 2 characters.";
    }
    if (field === "email") {
      if (!trimmed) return "Email address is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
    }
    if (field === "message") {
      if (!trimmed) return "Message is required.";
      if (trimmed.length < 10) return "Message must be at least 10 characters long.";
    }
    return undefined;
  };

  const validateAll = (): boolean => {
    const nameErr = validateField("name", values.name);
    const emailErr = validateField("email", values.email);
    const messageErr = validateField("message", values.message);

    const newErrors: FormErrors = {};
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (messageErr) newErrors.message = messageErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;

    setValues((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));

    // Re-validate field on change if already touched
    if (touched[name as keyof FormValues]) {
      const err = validateField(name as keyof FormValues, value);
      setErrors((prev) => ({
        ...prev,
        [name]: err,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name as keyof FormValues, value);
    setErrors((prev) => ({
      ...prev,
      [name]: err,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields touched
    setTouched({ name: true, email: true, message: true });

    // Block if cooldown active
    if (cooldown > 0) {
      return;
    }

    if (!validateAll()) {
      setStatus("error");
      setStatusMessage("Please correct the errors in the form before submitting.");
      return;
    }

    // Bot detection check
    if (values.botcheck) {
      setStatus("success");
      setStatusMessage("Thank you! Your message has been sent.");
      setValues({ name: "", email: "", message: "", botcheck: false });
      return;
    }

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

    if (!accessKey) {
      setStatus("error");
      setStatusMessage(
        "Form submission unavailable: Missing NEXT_PUBLIC_WEB3FORMS_KEY. Please configure your environment variable."
      );
      return;
    }

    setStatus("sending");
    setStatusMessage("");

    try {
      const trimmedName = values.name.trim();
      const trimmedEmail = values.email.trim();
      const trimmedMessage = values.message.trim();

      const formData = new FormData();
      formData.append("access_key", accessKey);
      formData.append("name", trimmedName);
      formData.append("email", trimmedEmail);
      formData.append("message", trimmedMessage);
      formData.append("subject", `New portfolio message from ${trimmedName}`);
      formData.append("from_name", "Portfolio Contact Form");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      let data: { success?: boolean; message?: string } = {};
      try {
        data = await response.json();
      } catch {
        // Handle non-JSON responses gracefully
      }

      if (response.ok && data.success) {
        setStatus("success");
        setStatusMessage(
          data.message || "Thank you! Your message has been transmitted successfully. I will get back to you shortly."
        );
        // Reset form fields
        setValues({ name: "", email: "", message: "", botcheck: false });
        setTouched({});
        setErrors({});
        // Trigger 10-second throttle
        setCooldown(10);
      } else {
        setStatus("error");
        setStatusMessage(
          data.message ||
            (response.status === 403
              ? "Access denied by spam filter or invalid domain restriction. Please check your Web3Forms settings."
              : "Failed to submit message to Web3Forms. Please try again later.")
        );
      }
    } catch (err) {
      console.error("Web3Forms submission error:", err);
      setStatus("error");
      setStatusMessage("Network error occurred. Please check your internet connection and try again.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
      {/* Responsive Layout: Side-by-side on desktop (lg+), stacked on mobile */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
        {/* Left Column: Heading, Context & Channel Metadata */}
        <div className="lg:col-span-5 text-left mb-8 lg:mb-0">
          <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
            <span className="font-bank text-sm sm:text-base md:text-[17px] font-bold text-[#354921]">
              05
            </span>
            <span className="w-7 h-[1.5px] bg-black/20" />
            <span className="font-mono text-xs sm:text-sm md:text-[14px] font-bold tracking-[0.18em] text-neutral-600 uppercase">
              GET IN TOUCH // TRANSMISSION
            </span>
          </div>

          <h2 className="font-bank text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] text-[#111111] leading-tight m-0">
            Let&apos;s <span className="text-[#354921] underline decoration-[#9ab73d] decoration-4 underline-offset-8">connect.</span>
          </h2>

          <p className="mt-4 sm:mt-5 font-sans text-base sm:text-lg md:text-[19px] text-neutral-700 leading-[1.65]">
            Have an architectural challenge, full-stack project, or opportunity in mind? Send a message directly to my primary inbox.
          </p>

          {/* Quick Contact Info Chips (Desktop Context) */}
          <div className="mt-6 sm:mt-8 space-y-3 pt-6 border-t border-black/10">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#354921] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#354921]" />
              </span>
              <span className="font-mono text-xs sm:text-sm text-neutral-700 font-medium">
                DIRECT INBOX · RESPONSE TIME &lt; 24H
              </span>
            </div>
            <div className="flex items-center gap-3 text-neutral-600 font-mono text-xs sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D6003C]" />
              <span>LOCATION: DELHI, INDIA (UTC+5:30)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Form Container Card with Clean, Non-Highlighted Border */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl border border-black/15 bg-white p-6 sm:p-8 md:p-10 shadow-[0_16px_45px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Top decorative accent row */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/10">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#354921]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#D6003C]" />
                <span className="font-bank text-xs font-bold uppercase tracking-[0.2em] text-[#111111]/70 ml-1">
                  Secure Dispatch
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#354921] font-semibold tracking-wider uppercase">
                ENCRYPTED TRANSIT
              </span>
            </div>

            <form onSubmit={handleSubmit} noValidate className="relative z-10 space-y-5 sm:space-y-6">
              {/* Honeypot field (hidden from humans and screen readers) */}
              <input
                type="checkbox"
                name="botcheck"
                id="contact-botcheck"
                className="hidden"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
                checked={values.botcheck}
                onChange={handleChange}
                aria-hidden="true"
              />

              {/* Row: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-bank text-sm sm:text-base font-bold uppercase tracking-[0.14em] text-[#111111] mb-2"
                  >
                    Full Name <span className="text-[#D6003C] font-bold text-base sm:text-lg">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Lavi Sharma"
                    style={inputFontStyle}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    disabled={status === "sending"}
                    className={`w-full rounded-xl border bg-white px-4 py-3.5 text-base sm:text-lg font-sans font-normal normal-case text-[#111111] placeholder:text-neutral-400 placeholder:normal-case transition-all duration-200 outline-none hover:border-neutral-400 ${
                      errors.name
                        ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                        : "border-neutral-300 focus:border-[#354921] focus:ring-2 focus:ring-[#354921]/15"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-1.5 text-xs font-mono font-medium text-rose-600 flex items-center gap-1.5">
                      <span className="text-sm">⚠</span> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-bank text-sm sm:text-base font-bold uppercase tracking-[0.14em] text-[#111111] mb-2"
                  >
                    Email Address <span className="text-[#D6003C] font-bold text-base sm:text-lg">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="name@company.com"
                    style={inputFontStyle}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    disabled={status === "sending"}
                    className={`w-full rounded-xl border bg-white px-4 py-3.5 text-base sm:text-lg font-sans font-normal normal-case text-[#111111] placeholder:text-neutral-400 placeholder:normal-case transition-all duration-200 outline-none hover:border-neutral-400 ${
                      errors.email
                        ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                        : "border-neutral-300 focus:border-[#354921] focus:ring-2 focus:ring-[#354921]/15"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {errors.email && (
                    <p id="email-error" role="alert" className="mt-1.5 text-xs font-mono font-medium text-rose-600 flex items-center gap-1.5">
                      <span className="text-sm">⚠</span> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-bank text-sm sm:text-base font-bold uppercase tracking-[0.14em] text-[#111111] mb-2"
                >
                  Message <span className="text-[#D6003C] font-bold text-base sm:text-lg">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe your project, timeline, or architecture inquiry (minimum 10 characters)..."
                  style={inputFontStyle}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  disabled={status === "sending"}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-base sm:text-lg font-sans font-normal normal-case text-[#111111] placeholder:text-neutral-400 placeholder:normal-case transition-all duration-200 outline-none hover:border-neutral-400 resize-y min-h-[110px] ${
                    errors.message
                      ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                      : "border-neutral-300 focus:border-[#354921] focus:ring-2 focus:ring-[#354921]/15"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  {errors.message ? (
                    <p id="message-error" role="alert" className="text-xs font-mono font-medium text-rose-600 flex items-center gap-1.5">
                      <span className="text-sm">⚠</span> {errors.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs font-mono text-neutral-500 font-semibold">
                    {values.message.trim().length} chars
                  </span>
                </div>
              </div>

              {/* Status Alert Banner with aria-live="polite" */}
              <div aria-live="polite" className="min-h-[20px]">
                {status === "success" && (
                  <div className="rounded-xl border border-emerald-600/30 bg-emerald-50 px-4 py-3 text-emerald-900 text-sm font-mono flex items-start gap-2.5 shadow-sm">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-bold text-emerald-950 font-bank tracking-wider uppercase text-xs sm:text-sm">Message Delivered</p>
                      <p className="mt-0.5 text-emerald-800 text-xs sm:text-sm leading-relaxed">{statusMessage}</p>
                      {cooldown > 0 && (
                        <p className="mt-1 text-xs text-emerald-700 font-mono font-bold">
                          Throttle active: wait {cooldown}s before submitting again.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-50 px-4 py-3 text-rose-950 text-sm font-mono flex items-start gap-2.5 shadow-sm">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-bold text-rose-950 font-bank tracking-wider uppercase text-xs sm:text-sm">Transmission Error</p>
                      <p className="mt-0.5 text-rose-800 text-xs sm:text-sm leading-relaxed">{statusMessage}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Row */}
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <FlowButton
                  type="submit"
                  disabled={status === "sending" || cooldown > 0}
                  text={
                    status === "sending"
                      ? "Sending..."
                      : cooldown > 0
                      ? `Wait (${cooldown}s)`
                      : "Send Message"
                  }
                />

                <span className="font-mono text-xs text-neutral-600 font-medium flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#354921]" />
                  Secured &amp; delivered via Web3Forms
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
