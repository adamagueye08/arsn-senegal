import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  api,
  getToken,
  getStoredUser,
  clearSession,
  type DemandeAdmin,
  type DashboardStats,
  type User,
  type AuditLog,
  type TypeAutorisationFull,
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
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [types, setTypes] = useState<TypeAutorisationFull[]>([]);
  const [section, setSection] = useState<"demandes" | "utilisateurs" | "audit" | "types">("demandes");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", motDePasse: "", nom: "", prenom: "", role: "INSTRUCTEUR" });
  const [newType, setNewType] = useState({ nom: "", description: "", dureeValiditeMois: 12, frais: "", actif: true });

  async function load(query?: string) {
    setLoading(true);
    try {
      if (section === "demandes") {
        const [s, d] = await Promise.all([api.admin.dashboard(), api.admin.listerDemandes({ q: query })]);
        setStats(s);
        setDemandes(d);
      } else if (section === "utilisateurs") {
        setUsers(await api.admin.utilisateurs.lister());
      } else if (section === "audit") {
        setAuditLogs(await api.admin.audit.lister());
      } else if (section === "types") {
        setTypes(await api.admin.typesAutorisation.lister());
      }
    } catch (err: any) {
      toast.error("Erreur de chargement", { description: String(err.message || err) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(section === "demandes" ? q : undefined);
  }, [section, q]);

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

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    setCreatingUser(true);
    try {
      const created = await api.admin.utilisateurs.creer(newUser);
      setUsers((prev) => [created, ...prev]);
      setNewUser({ email: "", motDePasse: "", nom: "", prenom: "", role: "INSTRUCTEUR" });
      toast.success("Utilisateur créé");
    } catch (err: any) {
      toast.error("Impossible de créer l'utilisateur", { description: String(err.message || err) });
    } finally {
      setCreatingUser(false);
    }
  }

  async function handleToggleUserActive(id: string, actif: boolean) {
    try {
      const updated = await api.admin.utilisateurs.modifier(id, { actif });
      setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
      toast.success("Utilisateur mis à jour");
    } catch (err: any) {
      toast.error("Impossible de modifier l'utilisateur", { description: String(err.message || err) });
    }
  }

  async function handleResetPassword(id: string) {
    const nouveauMotDePasse = window.prompt("Nouveau mot de passe temporaire :", "ChangeMoi123!");
    if (!nouveauMotDePasse) return;
    try {
      await api.admin.utilisateurs.reinitialiserMotDePasse(id, nouveauMotDePasse);
      toast.success("Mot de passe réinitialisé");
    } catch (err: any) {
      toast.error("Impossible de réinitialiser le mot de passe", { description: String(err.message || err) });
    }
  }

  async function handleDeleteUser(id: string) {
    if (!window.confirm("Supprimer définitivement ce compte ?")) return;
    try {
      await api.admin.utilisateurs.supprimer(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success("Utilisateur supprimé");
    } catch (err: any) {
      toast.error("Impossible de supprimer l'utilisateur", { description: String(err.message || err) });
    }
  }

  async function handleCreateType(e: React.FormEvent) {
    e.preventDefault();
    try {
      const created = await api.admin.typesAutorisation.creer({
        nom: newType.nom,
        description: newType.description,
        dureeValiditeMois: Number(newType.dureeValiditeMois),
        frais: newType.frais ? Number(newType.frais) : undefined,
        actif: newType.actif,
        formulaireSchema: { champs: [] },
        piecesRequises: [],
      });
      setTypes((prev) => [created, ...prev]);
      setNewType({ nom: "", description: "", dureeValiditeMois: 12, frais: "", actif: true });
      toast.success("Type d'autorisation créé");
    } catch (err: any) {
      toast.error("Impossible de créer le type", { description: String(err.message || err) });
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

      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "demandes", label: "Demandes" },
            { id: "utilisateurs", label: "Utilisateurs" },
            { id: "audit", label: "Audit" },
            { id: "types", label: "Types" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id as typeof section)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${section === tab.id ? "bg-foreground text-white" : "bg-white/80 text-foreground ring-1 ring-border hover:bg-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {section === "demandes" && (
          <div className="space-y-4">
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
                type="button"
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
        )}

        {section === "utilisateurs" && (
          <div className="space-y-6">
            <div className="bg-white ring-1 ring-black/5 shadow-sm p-5 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Créer un utilisateur</h2>
              <form onSubmit={handleCreateUser} className="grid gap-3 sm:grid-cols-2">
                <input
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  type="email"
                  required
                  placeholder="Email"
                  className="border border-border px-3 py-2 rounded-lg"
                />
                <input
                  value={newUser.motDePasse}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, motDePasse: e.target.value }))}
                  type="password"
                  required
                  placeholder="Mot de passe"
                  className="border border-border px-3 py-2 rounded-lg"
                />
                <input
                  value={newUser.nom}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, nom: e.target.value }))}
                  placeholder="Nom"
                  className="border border-border px-3 py-2 rounded-lg"
                />
                <input
                  value={newUser.prenom}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, prenom: e.target.value }))}
                  placeholder="Prénom"
                  className="border border-border px-3 py-2 rounded-lg"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
                  className="border border-border px-3 py-2 rounded-lg"
                >
                  <option value="INSTRUCTEUR">Instructeur</option>
                  <option value="ADMIN">Admin</option>
                  <option value="DEMANDEUR">Demandeur</option>
                </select>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-4 py-2 bg-foreground text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {creatingUser ? "Création…" : "Créer"}
                </button>
              </form>
            </div>

            <div className="bg-white ring-1 ring-black/5 shadow-sm overflow-x-auto rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Nom</th>
                    <th className="px-4 py-3 text-left">Rôle</th>
                    <th className="px-4 py-3 text-left">Actif</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Chargement…</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Aucun utilisateur.</td></tr>
                  ) : users.map((u) => (
                    <tr key={u.id} className="border-t border-border">
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.prenom} {u.nom}</td>
                      <td className="px-4 py-3">{u.role}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleToggleUserActive(u.id, !u.actif)}
                          className={`px-3 py-1 rounded-full text-xs ${u.actif ? "bg-arsn-green text-white" : "bg-slate-200 text-slate-700"}`}
                        >
                          {u.actif ? "Actif" : "Inactif"}
                        </button>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleResetPassword(u.id)}
                          className="px-3 py-1 rounded-lg bg-arsn-yellow text-foreground text-xs"
                        >
                          Réinit. mot de passe
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-3 py-1 rounded-lg bg-arsn-red text-white text-xs"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === "audit" && (
          <div className="bg-white ring-1 ring-black/5 shadow-sm overflow-x-auto rounded-lg">
            {loading ? (
              <p className="p-6 text-sm text-muted-foreground">Chargement…</p>
            ) : auditLogs.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">Aucun journal d'audit.</p>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Action</th>
                    <th className="px-4 py-3 text-left">Entité</th>
                    <th className="px-4 py-3 text-left">Utilisateur</th>
                    <th className="px-4 py-3 text-left">Détail</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-t border-border">
                      <td className="px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3">{log.action}</td>
                      <td className="px-4 py-3">{log.entite} {log.entiteId ?? ""}</td>
                      <td className="px-4 py-3">{log.user?.prenom} {log.user?.nom} ({log.user?.email})</td>
                      <td className="px-4 py-3"><pre className="whitespace-pre-wrap break-words text-xs text-muted-foreground">{JSON.stringify(log.detail ?? {}, null, 2)}</pre></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {section === "types" && (
          <div className="space-y-6">
            <div className="bg-white ring-1 ring-black/5 shadow-sm p-5 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Créer un type d'autorisation</h2>
              <form onSubmit={handleCreateType} className="grid gap-3 sm:grid-cols-2">
                <input
                  value={newType.nom}
                  onChange={(e) => setNewType((prev) => ({ ...prev, nom: e.target.value }))}
                  required
                  placeholder="Nom"
                  className="border border-border px-3 py-2 rounded-lg"
                />
                <input
                  value={newType.description}
                  onChange={(e) => setNewType((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                  className="border border-border px-3 py-2 rounded-lg"
                />
                <input
                  value={newType.dureeValiditeMois}
                  onChange={(e) => setNewType((prev) => ({ ...prev, dureeValiditeMois: Number(e.target.value) }))}
                  type="number"
                  min={1}
                  placeholder="Durée (mois)"
                  className="border border-border px-3 py-2 rounded-lg"
                />
                <input
                  value={newType.frais}
                  onChange={(e) => setNewType((prev) => ({ ...prev, frais: e.target.value }))}
                  type="number"
                  step="0.01"
                  placeholder="Frais"
                  className="border border-border px-3 py-2 rounded-lg"
                />
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={newType.actif}
                    onChange={(e) => setNewType((prev) => ({ ...prev, actif: e.target.checked }))}
                    className="h-4 w-4 rounded border-border"
                  />
                  Actif
                </label>
                <button type="submit" className="px-4 py-2 bg-foreground text-white rounded-lg font-semibold">
                  Créer
                </button>
              </form>
            </div>

            <div className="bg-white ring-1 ring-black/5 shadow-sm overflow-x-auto rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Nom</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Durée</th>
                    <th className="px-4 py-3 text-left">Frais</th>
                    <th className="px-4 py-3 text-left">Actif</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Chargement…</td></tr>
                  ) : types.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Aucun type disponible.</td></tr>
                  ) : types.map((type) => (
                    <tr key={type.id} className="border-t border-border">
                      <td className="px-4 py-3">{type.nom}</td>
                      <td className="px-4 py-3">{type.description}</td>
                      <td className="px-4 py-3">{type.dureeValiditeMois} mois</td>
                      <td className="px-4 py-3">{type.frais ?? "-"}</td>
                      <td className="px-4 py-3">{type.actif ? "Oui" : "Non"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}