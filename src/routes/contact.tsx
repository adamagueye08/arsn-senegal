import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ARSN Sénégal" },
      {
        name: "description",
        content: "Coordonnées, adresse et horaires de l'Autorité Sénégalaise de Radioprotection.",
      },
      { property: "og:title", content: "Contact — ARSN" },
      { property: "og:description", content: "Nous joindre — siège de l'ARSN à Dakar." },
    ],
  }),
  component: Page,
});

const FR = {
  hero: "CONTACT",
  title: "Nous contacter",
  subtitle:
    "Vous avez une question, une demande de renseignements ou besoin d'une assistance ? Notre équipe vous répondra dans les plus brefs délais.",
  address: {
    t: "Adresse",
    b: "L/14 Scat Urbam Mariste, Espace Résidence Hann\nDakar, Sénégal",
  },
  phone: { t: "Téléphone", b: "+221 33 832 55 50" },
  email: { t: "E-mail", b: "info@arsn.gouv.sn" },
  hours: { t: "Horaires", b: "Lundi — Vendredi : 08h00 — 17h00" },
  formTitle: "Formulaire de contact",
  formIntro:
    "Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.",
  fields: { name: "Nom", email: "E-mail", phone: "Téléphone", subject: "Sujet", msg: "Message" },
  send: "Envoyer",
};

const EN: typeof FR = {
  hero: "CONTACT",
  title: "Contact us",
  subtitle:
    "Have a question, information request or need assistance? Our team will get back to you as soon as possible.",
  address: {
    t: "Address",
    b: "L/14 Scat Urbam Mariste, Espace Résidence Hann\nDakar, Senegal",
  },
  phone: { t: "Phone", b: "+221 33 832 55 50" },
  email: { t: "Email", b: "info@arsn.gouv.sn" },
  hours: { t: "Hours", b: "Monday — Friday: 8:00 AM — 5:00 PM" },
  formTitle: "Contact form",
  formIntro: "Fill in the form below and our team will get back to you as soon as possible.",
  fields: { name: "Name", email: "Email", phone: "Phone", subject: "Subject", msg: "Message" },
  send: "Send",
};

function Page() {
  const { lang } = useLang();
  const c = lang === "fr" ? FR : EN;
  const CARDS = [
    { icon: MapPin, ...c.address },
    { icon: Phone, ...c.phone },
    { icon: Mail, ...c.email },
    { icon: Clock, ...c.hours },
  ];
  return (
    <>
      <PageHero eyebrow={c.hero} title={c.title} subtitle={c.subtitle} />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 content-start">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.t} className="p-6 bg-white ring-1 ring-black/5">
                <div className="w-10 h-10 bg-foreground text-white rounded-sm grid place-items-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] mb-2">{card.t}</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">{card.b}</p>
              </div>
            );
          })}
        </div>

        <form
          className="lg:col-span-3 p-8 bg-white ring-1 ring-black/5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            toast.success(
              lang === "en" ? "Message sent" : "Message envoyé",
              {
                description:
                  lang === "en"
                    ? "Thank you. The ARSN team will get back to you shortly."
                    : "Merci. L'équipe de l'ARSN vous répondra dans les meilleurs délais.",
              }
            );
            form.reset();
          }}
        >
          <div>
            <h2 className="text-2xl font-serif font-bold mb-2">{c.formTitle}</h2>
            <p className="text-sm text-muted-foreground">{c.formIntro}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={c.fields.name} type="text" />
            <Field label={c.fields.email} type="email" />
            <Field label={c.fields.phone} type="tel" />
            <Field label={c.fields.subject} type="text" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">
              {c.fields.msg}
            </label>
            <textarea
              rows={5}
              required
              className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 rounded-sm"
          >
            {c.send}
          </button>
        </form>
      </div>
    </>
  );
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">{label}</label>
      <input
        type={type}
        className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
      />
    </div>
  );
}
