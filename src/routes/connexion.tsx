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

type Mode = "login" | "register";

function Page() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [turning, setTurning] = useState<"turning-left" | "turning-right" | "">("");
  const [busy, setBusy] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regNom, setRegNom] = useState("");
  const [regPrenom, setRegPrenom] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  function switchTo(next: Mode) {
    if (next === mode || turning) return;
    setTurning(next === "register" ? "turning-left" : "turning-right");
    setMode(next);
  }

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
    <div className="min-h-[75vh] bg-gradient-to-b from-secondary/40 to-background flex items-center justify-center py-16 px-4">
      <div className="arsn-auth-perspective w-full max-w-3xl animate-reveal" style={{ perspective: "1600px" }}>
        {/* Repli mobile : glissement + fondu simple (le flip 3D était peu fiable
            sur Safari iOS réel — rendu et interception de clics imprévisibles) */}
        <div className="sm:hidden relative overflow-hidden">
          <div
            className={`absolute inset-0 p-6 bg-white ring-1 ring-black/5 shadow-lg rounded-xl flex flex-col justify-center transition-all duration-300 ease-out ${
              mode === "login"
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0 pointer-events-none invisible"
            }`}
          >
            <LoginForm
              email={loginEmail}
              setEmail={setLoginEmail}
              password={loginPassword}
              setPassword={setLoginPassword}
              busy={busy}
              onSubmit={handleLogin}
              interactive={mode === "login"}
            />
            <button
              type="button"
              onClick={() => switchTo("register")}
              className="mt-5 text-xs font-semibold text-arsn-blue hover:underline text-center"
            >
              Pas encore de compte ? Créer un compte →
            </button>
          </div>
          <div
            className={`absolute inset-0 p-6 bg-white ring-1 ring-black/5 shadow-lg rounded-xl flex flex-col justify-center transition-all duration-300 ease-out ${
              mode === "register"
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0 pointer-events-none invisible"
            }`}
          >
            <RegisterForm
              prenom={regPrenom}
              setPrenom={setRegPrenom}
              nom={regNom}
              setNom={setRegNom}
              email={regEmail}
              setEmail={setRegEmail}
              password={regPassword}
              setPassword={setRegPassword}
              busy={busy}
              onSubmit={handleRegister}
              interactive={mode === "register"}
            />
            <button
              type="button"
              onClick={() => switchTo("login")}
              className="mt-5 text-xs font-semibold text-arsn-blue hover:underline text-center"
            >
              ← Déjà un compte ? Se connecter
            </button>
          </div>
          {/* Élément fantôme pour donner sa hauteur naturelle au conteneur (les
              deux panneaux sont en position absolute) */}
          <div className="invisible p-6">
            <RegisterForm
              prenom=""
              setPrenom={() => {}}
              nom=""
              setNom={() => {}}
              email=""
              setEmail={() => {}}
              password=""
              setPassword={() => {}}
              busy={false}
              onSubmit={(e) => e.preventDefault()}
              interactive={false}
            />
          </div>
        </div>

        <div className="hidden sm:block relative w-full aspect-[16/9] rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden bg-white">
          {/* Panneau formulaire — les deux formulaires occupent chacun une moitié fixe */}
          <div className="absolute inset-0 grid grid-cols-2">
            <div className="p-6 sm:p-10 flex flex-col justify-center overflow-y-auto">
              <LoginForm
                email={loginEmail}
                setEmail={setLoginEmail}
                password={loginPassword}
                setPassword={setLoginPassword}
                busy={busy}
                onSubmit={handleLogin}
                interactive={mode === "login"}
              />
            </div>
            <div className="p-6 sm:p-10 flex flex-col justify-center overflow-y-auto">
              <RegisterForm
                prenom={regPrenom}
                setPrenom={setRegPrenom}
                nom={regNom}
                setNom={setRegNom}
                email={regEmail}
                setEmail={setRegEmail}
                password={regPassword}
                setPassword={setRegPassword}
                busy={busy}
                onSubmit={handleRegister}
                interactive={mode === "register"}
              />
            </div>
          </div>

          {/* Panneau coloré qui pivote d'un côté à l'autre */}
          <div
            key={turning || "rest"}
            onAnimationEnd={() => setTurning("")}
            className={`arsn-auth-overlay absolute top-0 bottom-0 w-1/2 bg-gradient-to-br from-arsn-blue to-arsn-blue-light text-white flex flex-col items-center justify-center text-center p-6 sm:p-10 ${turning}`}
            style={!turning ? { transform: `translate3d(${mode === "login" ? "100%" : "0%"},0,0)` } : undefined}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] opacity-80 mb-4">ARSN Sénégal</span>
            {mode === "login" ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-serif mb-3">Nouveau sur la plateforme ?</h2>
                <p className="text-sm opacity-90 mb-6 max-w-xs">
                  Créez votre compte pour déposer vos demandes d'autorisation et suivre vos dossiers en ligne.
                </p>
                <button
                  type="button"
                  onClick={() => switchTo("register")}
                  className="px-6 py-2.5 rounded-lg ring-1 ring-white/60 text-sm font-semibold hover:bg-white hover:text-arsn-blue transition-all duration-200 active:scale-[0.97]"
                >
                  Créer un compte →
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-serif mb-3">Déjà un compte ?</h2>
                <p className="text-sm opacity-90 mb-6 max-w-xs">
                  Connectez-vous pour retrouver vos dossiers et poursuivre vos démarches.
                </p>
                <button
                  type="button"
                  onClick={() => switchTo("login")}
                  className="px-6 py-2.5 rounded-lg ring-1 ring-white/60 text-sm font-semibold hover:bg-white hover:text-arsn-blue transition-all duration-200 active:scale-[0.97]"
                >
                  ← Se connecter
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  busy,
  onSubmit,
  interactive,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  busy: boolean;
  onSubmit: (e: React.FormEvent) => void;
  interactive: boolean;
}) {
  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotBusy, setForgotBusy] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setForgotBusy(true);
    try {
      await api.auth.motDePasseOublie(forgotEmail);
      setForgotSent(true);
    } catch (err: any) {
      toast.error("Erreur", { description: String(err.message || err) });
    } finally {
      setForgotBusy(false);
    }
  }

  if (forgot) {
    return (
      <div
        className={`space-y-4 transition-opacity duration-300 ${interactive ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!interactive}
      >
        <div>
          <h1 className="text-2xl font-serif mb-1">Mot de passe oublié</h1>
          <p className="text-sm text-muted-foreground">
            Indiquez votre e-mail, nous vous envoyons un lien de réinitialisation.
          </p>
        </div>
        {forgotSent ? (
          <p className="text-sm p-3 bg-arsn-green/10 ring-1 ring-arsn-green/30 rounded-lg">
            Si un compte existe avec cet e-mail, un lien de réinitialisation vient d'être envoyé. Vérifiez votre
            boîte de réception.
          </p>
        ) : (
          <form className="space-y-4" onSubmit={handleForgotSubmit}>
            <TextField
              label="E-mail"
              type="email"
              value={forgotEmail}
              onChange={setForgotEmail}
              required
              tabIndex={interactive ? 0 : -1}
            />
            <button
              type="submit"
              disabled={forgotBusy || !interactive}
              className="w-full px-6 py-3 bg-arsn-blue text-white text-sm font-semibold hover:opacity-90 rounded-lg disabled:opacity-50 transition-all duration-200"
            >
              Envoyer le lien
            </button>
          </form>
        )}
        <button
          type="button"
          onClick={() => {
            setForgot(false);
            setForgotSent(false);
          }}
          className="text-xs font-semibold text-arsn-blue hover:underline"
        >
          ← Retour à la connexion
        </button>
      </div>
    );
  }

  return (
    <form
      className={`space-y-4 transition-opacity duration-300 ${interactive ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onSubmit={onSubmit}
      aria-hidden={!interactive}
    >
      <div>
        <h1 className="text-2xl font-serif mb-1">Connexion</h1>
        <p className="text-sm text-muted-foreground">Espace demandeurs et agents ARSN.</p>
      </div>
      <TextField label="E-mail" type="email" value={email} onChange={setEmail} required tabIndex={interactive ? 0 : -1} />
      <TextField
        label="Mot de passe"
        type="password"
        value={password}
        onChange={setPassword}
        required
        tabIndex={interactive ? 0 : -1}
      />
      <div className="text-right">
        <button
          type="button"
          onClick={() => setForgot(true)}
          tabIndex={interactive ? 0 : -1}
          className="text-xs font-semibold text-arsn-blue hover:underline"
        >
          Mot de passe oublié ?
        </button>
      </div>
      <button
        type="submit"
        disabled={busy || !interactive}
        className="w-full px-6 py-3 bg-arsn-blue text-white text-sm font-semibold hover:opacity-90 rounded-lg disabled:opacity-50 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
      >
        Se connecter
      </button>
    </form>
  );
}

function RegisterForm({
  prenom,
  setPrenom,
  nom,
  setNom,
  email,
  setEmail,
  password,
  setPassword,
  busy,
  onSubmit,
  interactive,
}: {
  prenom: string;
  setPrenom: (v: string) => void;
  nom: string;
  setNom: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  busy: boolean;
  onSubmit: (e: React.FormEvent) => void;
  interactive: boolean;
}) {
  return (
    <form
      className={`space-y-4 transition-opacity duration-300 ${interactive ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onSubmit={onSubmit}
      aria-hidden={!interactive}
    >
      <div>
        <h1 className="text-2xl font-serif mb-1">Créer un compte</h1>
        <p className="text-sm text-muted-foreground">Espace demandeurs ARSN.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Prénom" type="text" value={prenom} onChange={setPrenom} required tabIndex={interactive ? 0 : -1} />
        <TextField label="Nom" type="text" value={nom} onChange={setNom} required tabIndex={interactive ? 0 : -1} />
      </div>
      <TextField label="E-mail" type="email" value={email} onChange={setEmail} required tabIndex={interactive ? 0 : -1} />
      <TextField
        label="Mot de passe"
        type="password"
        value={password}
        onChange={setPassword}
        required
        tabIndex={interactive ? 0 : -1}
      />
      <button
        type="submit"
        disabled={busy || !interactive}
        className="w-full px-6 py-3 bg-arsn-blue text-white text-sm font-semibold hover:opacity-90 rounded-lg disabled:opacity-50 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
      >
        Créer mon compte
      </button>
    </form>
  );
}

function TextField({
  label,
  type,
  value,
  onChange,
  required,
  tabIndex,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  tabIndex?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        tabIndex={tabIndex}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-blue/40"
      />
    </div>
  );
}
