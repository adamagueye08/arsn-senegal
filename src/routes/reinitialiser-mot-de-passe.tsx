import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/reinitialiser-mot-de-passe")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  head: () => ({
    meta: [{ title: "Réinitialiser le mot de passe — ARSN Sénégal" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

function Page() {
  const { token } = useSearch({ from: "/reinitialiser-mot-de-passe" });
  const navigate = useNavigate();
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (motDePasse !== confirmation) {
      toast.error("Les deux mots de passe ne correspondent pas.");
      return;
    }
    if (motDePasse.length < 8) {
      toast.error("8 caractères minimum.");
      return;
    }
    setBusy(true);
    try {
      await api.auth.reinitialiserMotDePasse(token, motDePasse);
      setDone(true);
      toast.success("Mot de passe réinitialisé");
      setTimeout(() => navigate({ to: "/connexion" }), 2000);
    } catch (err: any) {
      toast.error("Lien invalide ou expiré", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          Lien invalide. Utilisez le lien reçu par e-mail pour accéder à cette page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm p-8 bg-white ring-1 ring-black/5 shadow-sm rounded-xl animate-reveal">
        <h1 className="text-2xl font-serif mb-1">Nouveau mot de passe</h1>
        <p className="text-sm text-muted-foreground mb-6">Choisissez un nouveau mot de passe pour votre compte.</p>
        {done ? (
          <p className="text-sm p-3 bg-arsn-green/10 ring-1 ring-arsn-green/30 rounded-lg">
            Mot de passe mis à jour. Redirection vers la connexion…
          </p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-blue/40"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">Confirmer</label>
              <input
                type="password"
                required
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-blue/40"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full px-6 py-3 bg-arsn-blue text-white text-sm font-semibold hover:opacity-90 rounded-lg disabled:opacity-50 transition-all duration-200"
            >
              Réinitialiser mon mot de passe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
