import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { api, setSession } from "@/lib/api";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [{ title: "Connexion — ARSN Sénégal" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

/**
 * Une seule page de connexion pour tout le monde (demandeurs ET agents ARSN).
 * Après connexion, on redirige automatiquement selon le rôle renvoyé par l'API :
 * - DEMANDEUR              -> /espace-demandeur
 * - tout autre rôle (agent) -> /admin
 */
function redirectionSelonRole(role: string): string {
  return role === "DEMANDEUR" ? "/espace-demandeur" : "/admin";
}

function Page() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regNom, setRegNom] = useState("");
  const [regPrenom, setRegPrenom] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { token, user } = await api.auth.login({ email: loginEmail, motDePasse: loginPassword });
      setSession(token, user);
      navigate({ to: redirectionSelonRole(user.role) });
    } catch (err: any) {
      toast.error("Connexion impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { token, user } = await api.auth.register({
        email: regEmail,
        motDePasse: regPassword,
        nom: regNom,
        prenom: regPrenom,
      });
      setSession(token, user);
      // L'inscription publique ne crée que des comptes DEMANDEUR
      navigate({ to: "/espace-demandeur" });
    } catch (err: any) {
      toast.error("Inscription impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[70vh] bg-muted/30 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md p-8 bg-white ring-1 ring-black/5">
        <h1 className="text-2xl font-serif font-bold mb-1">Connexion</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Espace demandeurs et agents ARSN — un seul point de connexion.
        </p>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`px-4 py-2 text-sm font-semibold rounded-sm ${
              tab === "login" ? "bg-foreground text-white" : "bg-white ring-1 ring-black/10"
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`px-4 py-2 text-sm font-semibold rounded-sm ${
              tab === "register" ? "bg-foreground text-white" : "bg-white ring-1 ring-black/10"
            }`}
          >
            Créer un compte
          </button>
        </div>

        {tab === "login" ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <TextField label="E-mail" type="email" value={loginEmail} onChange={setLoginEmail} required />
            <TextField
              label="Mot de passe"
              type="password"
              value={loginPassword}
              onChange={setLoginPassword}
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full px-6 py-3 bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 rounded-sm disabled:opacity-50"
            >
              Se connecter
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Prénom" type="text" value={regPrenom} onChange={setRegPrenom} required />
              <TextField label="Nom" type="text" value={regNom} onChange={setRegNom} required />
            </div>
            <TextField label="E-mail" type="email" value={regEmail} onChange={setRegEmail} required />
            <TextField
              label="Mot de passe"
              type="password"
              value={regPassword}
              onChange={setRegPassword}
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full px-6 py-3 bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 rounded-sm disabled:opacity-50"
            >
              Créer mon compte
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  type,
  value,
  onChange,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
      />
    </div>
  );
}