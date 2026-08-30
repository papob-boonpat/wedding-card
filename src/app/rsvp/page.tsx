"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { submitRsvp, type RsvpErrorCode } from "@/lib/rsvp";
import { useI18n } from "@/components/LangProvider";
import type { MessageKey } from "@/lib/i18n";

type Status = "idle" | "submitting" | "success" | "error";

const ERROR_KEY: Record<RsvpErrorCode, MessageKey> = {
  name: "errName",
  party_size: "errPartySize",
  side: "errSide",
  network: "errNetwork",
};

export default function RsvpPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [errorCode, setErrorCode] = useState<RsvpErrorCode | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = formRef.current;
    if (!el) return;

    const elements = el.elements as unknown as {
      name: HTMLInputElement;
      party_size: HTMLInputElement;
      side: RadioNodeList;
    };
    const payload = {
      name: elements.name.value,
      party_size: Number(elements.party_size.value),
      side: elements.side.value,
    };

    setStatus("submitting");
    setErrorCode(null);
    const result = await submitRsvp(payload);

    if (result.ok) {
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } else {
      setStatus("error");
      setErrorCode(result.code);
    }
  }

  return (
    <main className="mx-auto flex min-h-[100svh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-serif text-4xl text-foreground">{t("rsvpTitle")}</h1>
      <p className="mt-2 text-base text-foreground/70">{t("rsvpIntro")}</p>

      {status === "success" ? (
        <motion.div
          ref={successRef}
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 rounded-xl bg-white/70 p-6 shadow-lg outline-none ring-1 ring-black/5"
        >
          <p className="font-serif text-2xl">{t("thankYou")}</p>
          <p className="mt-1 text-base text-foreground/70">{t("received")}</p>
          <Link
            href="/"
            className="mt-4 inline-block text-base text-accent underline underline-offset-4"
          >
            {t("back")}
          </Link>
        </motion.div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <Field label={t("name")}>
            <input
              name="name"
              type="text"
              required
              maxLength={120}
              autoComplete="name"
              className={inputClass}
            />
          </Field>

          <Field label={t("partySize")}>
            <input
              name="party_size"
              type="number"
              required
              min={1}
              max={20}
              defaultValue={1}
              className={inputClass}
            />
          </Field>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-base font-medium text-foreground/80">
              {t("side")}
            </legend>
            <div className="flex gap-3">
              {(["groom", "bride"] as const).map((s) => (
                <label
                  key={s}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white/60 py-3 text-base ring-1 ring-black/10 has-[:checked]:bg-accent has-[:checked]:text-white"
                >
                  <input
                    type="radio"
                    name="side"
                    value={s}
                    required
                    className="sr-only"
                  />
                  {t(s)}
                </label>
              ))}
            </div>
          </fieldset>

          <div aria-live="polite" className="min-h-[1.5rem] text-base text-red-700">
            {status === "error" && errorCode ? t(ERROR_KEY[errorCode]) : null}
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-medium tracking-wide text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
          >
            {status === "submitting" && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {status === "submitting" ? t("sending") : t("send")}
          </button>

          <Link
            href="/"
            className="text-center text-base text-foreground/60 underline underline-offset-4"
          >
            {t("back")}
          </Link>
        </form>
      )}
    </main>
  );
}

const inputClass =
  "w-full rounded-lg bg-white/60 px-3 py-3 text-base outline-none ring-1 ring-black/15 focus:ring-2 focus:ring-accent";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-base font-medium text-foreground/80">{label}</span>
      {children}
    </label>
  );
}
