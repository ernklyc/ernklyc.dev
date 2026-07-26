"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

export type FormStatus = "idle" | "loading" | "success" | "error";

export interface ContactFormData {
  name: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  subject?: string;
  message?: string;
}

interface ContactFormMessages {
  nameRequired: string;
  nameMin: string;
  nameMax: string;
  subjectRequired: string;
  subjectMin: string;
  subjectMax: string;
  messageRequired: string;
  messageMin: string;
  messageMax: string;
}

const EMPTY_FORM: ContactFormData = { name: "", subject: "", message: "" };

/**
 * İletişim formunun tüm iş mantığı: validasyon, form state ve gönderim.
 * Contact component'i yalnızca bu hook'un döndürdüğü değerleri render
 * eder — form mantığı ile görünüm birbirinden tamamen ayrıdır (MVVM).
 */
export function useContactForm(messages: ContactFormMessages) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const validate = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = messages.nameRequired;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = messages.nameMin;
    } else if (formData.name.trim().length > 50) {
      newErrors.name = messages.nameMax;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = messages.subjectRequired;
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = messages.subjectMin;
    } else if (formData.subject.trim().length > 100) {
      newErrors.subject = messages.subjectMax;
    }

    if (!formData.message.trim()) {
      newErrors.message = messages.messageRequired;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = messages.messageMin;
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = messages.messageMax;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    try {
      const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(`Ad: ${formData.name}\n\nMesaj: ${formData.message}`)}`;
      window.location.href = mailto;

      setStatus("success");
      setTimeout(() => {
        setFormData(EMPTY_FORM);
        setStatus("idle");
      }, 2000);
    } catch (error) {
      setStatus("error");
      console.error("Form submission error:", error);
    }
  };

  return { status, formData, errors, handleChange, handleSubmit };
}
