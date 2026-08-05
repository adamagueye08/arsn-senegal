import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  api,
  getToken,
  getStoredUser,
  clearSession,
  type DemandeAdmin,
  type DashboardStats,
} from "@/lib/api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Espace agent — ARSN Sénégal" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

type StaffUser = { nom: string; prenom: string; role: string };

const STATUT_LABELS: Record<string, string> = {
  BROUILLON: "Brouillon",
  SOUMISE: "Soumise",
  EN_COURS: "En cours",
  COMPLEMENT_REQUIS: "Complément requis",
  APPROUVEE: "Approuvée",
  REJETEE: "Rejetée",
  EXPIREE: "Expirée",
};

function Page() {
  const navigate = useNavigate();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [checked, setChecked] = useState(false);

  // Garde d'accès : il faut être connecté ET NE PAS être un simple DEMANDEUR.
  // Un demandeur qui arrive ici est renvoyé vers son propre espace.
  useEffect(() => {
    const stored = getStoredUser<StaffUser>();
    if (!stored || !getToken()) {
      navigate({ to: "/connexion" });
      return;
    }
    if (stored.role === "DEMANDEUR") {
      navigate({ to: "/espace-demandeur" });
      return;
    }
    setUser(stored);
    setChecked(true);
  }, []);

  if (!checked || !user) return null;

  return (
    <div className="min-h-[70vh] bg-muted/30">
      <div className="bg-foreground text-white py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/60 mb-1 animate-reveal">Accès réservé</p>
          <h1 className="text-3xl font-serif animate-reveal">Espace agent ARSN</h1>
          <p className="text-sm text-white/50 mt-2 animate-reveal">
            Bonjour {user.prenom}, voici la synthèse en temps réel des demandes.
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <Dashboard user={user} onLogout={() => { clearSession(); navigate({ to: "/connexion" }); }} />
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }: { user: StaffUser; onLogout: () => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [demandes, setDemandes] = useState<DemandeAdmin[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load(query?: string) {
    setLoading(true);
    try {
      const [s, d] = await Promise.all([api.admin.dashboard(), api.admin.listerDemandes({ q: query })]);
      setStats(s);
      setDemandes(d);
    } catch (err: any) {
      toast.error("Erreur de chargement", { description: String(err.message || err) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAction(id: string, action: "valider" | "rejeter" | "retourner") {
    setBusyId(id);
    try {
      if (action === "valider") await api.admin.valider(id, { decisionFinale: true });
      if (action === "rejeter") await api.admin.rejeter(id);
      if (action === "retourner") await api.admin.retourner(id);
      toast.success("Dossier mis à jour");
      await load(q);
    } catch (err: any) {
      toast.error("Action impossible", { description: String(err.message || err) });
    } finally {
      setBusyId(null);
    }
  }

  const cards = stats
    ? [
        { label: "Reçues", value: stats.demandesRecues },
        { label: "En attente", value: stats.demandesEnAttente },
        { label: "Approuvées", value: stats.demandesApprouvees },
        { label: "Rejetées", value: stats.demandesRejetees },
        { label: "Expirées", value: stats.demandesExpirees },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm">
          Connecté en tant que <strong>{user.prenom} {user.nom}</strong>{" "}
          <span className="text-muted-foreground">({user.role})</span>
        </p>
        <button onClick={onLogout} className="text-xs font-mono uppercase tracking-[0.15em] underline">
          Se déconnecter
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {cards.map((c, i) => (
          <div
            key={c.label}
            style={{ animationDelay: `${i * 80}ms` }}
            className="p-4 bg-white ring-1 ring-black/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center rounded-lg animate-reveal"
          >
            <div className="text-2xl font-serif font-bold">{c.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Rechercher (numéro, nom, organisation)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(q)}
            className="flex-1 border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
          />
          <button
            onClick={() => load(q)}
            className="px-4 py-2 bg-foreground text-white text-sm font-semibold rounded-lg"
          >
            Rechercher
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : demandes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande trouvée.</p>
        ) : (
          <div className="bg-white ring-1 ring-black/5 shadow-sm hover:shadow-md transition-shadow duration-300 divide-y divide-border">
            {demandes.map((d) => (
              <div key={d.id} className="p-4 flex flex-wrap items-center gap-3 justify-between text-sm hover:bg-secondary/40 transition-colors duration-200">
                <div className="min-w-[140px]">
                  <div className="font-mono">{d.numero}</div>
                  <div className="text-xs text-muted-foreground">{d.typeAutorisation?.nom}</div>
                </div>
                <div className="min-w-[160px]">
                  <div>{d.demandeur?.prenom} {d.demandeur?.nom}</div>
                  <div className="text-xs text-muted-foreground">{d.demandeur?.organisation || d.demandeur?.email}</div>
                </div>
                <div className="font-semibold min-w-[140px]">{STATUT_LABELS[d.statut] ?? d.statut}</div>
                <div className="flex gap-2">
                  <button
                    disabled={busyId === d.id}
                    onClick={() => handleAction(d.id, "valider")}
                    className="px-3 py-1.5 bg-arsn-green text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:opacity-90 hover:shadow-sm active:scale-[0.97]"
                  >
                    Valider
                  </button>
                  <button
                    disabled={busyId === d.id}
                    onClick={() => handleAction(d.id, "retourner")}
                    className="px-3 py-1.5 bg-arsn-yellow text-foreground text-xs font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:opacity-90 hover:shadow-sm active:scale-[0.97]"
                  >
                    Complément
                  </button>
                  <button
                    disabled={busyId === d.id}
                    onClick={() => handleAction(d.id, "rejeter")}
                    className="px-3 py-1.5 bg-arsn-red text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:opacity-90 hover:shadow-sm active:scale-[0.97]"
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}