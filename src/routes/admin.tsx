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
  type StaffUser,
  type TypeAutorisation,
  type DemandeDetail,
} from "@/lib/api";
import { FormDataReview } from "@/components/forms/FormDataReview";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Espace agent — ARSN Sénégal" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

type ConnectedUser = { nom: string; prenom: string; role: string };

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
  const [user, setUser] = useState<ConnectedUser | null>(null);
  const [checked, setChecked] = useState(false);

  // Garde d'accès : il faut être connecté ET NE PAS être un simple DEMANDEUR.
  // Un demandeur qui arrive ici est renvoyé vers son propre espace.
  useEffect(() => {
    const stored = getStoredUser<ConnectedUser>();
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

function Dashboard({ user, onLogout }: { user: ConnectedUser; onLogout: () => void }) {
  const [tab, setTab] = useState<"demandes" | "utilisateurs" | "types">("demandes");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [demandes, setDemandes] = useState<DemandeAdmin[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setTab("demandes")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors duration-200 ${
            tab === "demandes" ? "border-arsn-green text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Demandes
        </button>
        {user.role === "SUPER_ADMIN" && (
          <button
            onClick={() => setTab("utilisateurs")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors duration-200 ${
              tab === "utilisateurs" ? "border-arsn-green text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Utilisateurs
          </button>
        )}
        {user.role === "SUPER_ADMIN" && (
          <button
            onClick={() => setTab("types")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors duration-200 ${
              tab === "types" ? "border-arsn-green text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Types d'autorisation
          </button>
        )}
      </div>

      {tab === "demandes" && (
      <div className="space-y-8 animate-reveal">
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

      {stats && (stats.parType.length > 0 || stats.parMois.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          <ChartCard title="Demandes par type d'autorisation">
            <BarChart data={stats.parType.map((t) => ({ label: t.nom, value: t.total }))} />
          </ChartCard>
          <ChartCard title="Évolution sur 6 mois">
            <TrendChart data={stats.parMois.map((m) => ({ label: m.mois, value: m.total }))} />
          </ChartCard>
        </div>
      )}

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
            {demandes.map((d) => {
              const expanded = expandedId === d.id;
              return (
                <div key={d.id}>
                  <button
                    onClick={() => setExpandedId(expanded ? null : d.id)}
                    className="w-full p-4 flex flex-wrap items-center gap-3 justify-between text-sm hover:bg-secondary/40 transition-colors duration-200 text-left"
                  >
                    <div className="min-w-[140px]">
                      <div className="font-mono">{d.numero}</div>
                      <div className="text-xs text-muted-foreground">{d.typeAutorisation?.nom}</div>
                    </div>
                    <div className="min-w-[160px]">
                      <div>{d.demandeur?.prenom} {d.demandeur?.nom}</div>
                      <div className="text-xs text-muted-foreground">{d.demandeur?.organisation || d.demandeur?.email}</div>
                    </div>
                    <div className="font-semibold min-w-[140px]">{STATUT_LABELS[d.statut] ?? d.statut}</div>
                    <span className="text-xs shrink-0">{expanded ? "▲" : "▼"}</span>
                  </button>
                  {expanded && (
                    <div className="min-w-0 overflow-hidden">
                      <DemandeAdminPanel
                        demandeId={d.id}
                        statut={d.statut}
                        busy={busyId === d.id}
                        setBusy={(v) => setBusyId(v ? d.id : null)}
                        onChanged={() => load(q)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
      )}

      {tab === "utilisateurs" && <UsersPanel />}
      {tab === "types" && <TypesPanel />}
    </div>
  );
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Administrateur",
  INSTRUCTEUR: "Instructeur",
  SIGNATAIRE: "Signataire",
  DEMANDEUR: "Demandeur",
};

function DemandeAdminPanel({
  demandeId,
  statut,
  busy,
  setBusy,
  onChanged,
}: {
  demandeId: string;
  statut: string;
  busy: boolean;
  setBusy: (v: boolean) => void;
  onChanged: () => void;
}) {
  const [detail, setDetail] = useState<(DemandeDetail & { demandeur?: StaffUser & { organisation?: string | null; telephone?: string | null } }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [modeComplement, setModeComplement] = useState(false);
  const [piecesManquantes, setPiecesManquantes] = useState<string[]>([]);
  const [noteComplement, setNoteComplement] = useState("");
  const [attestationFile, setAttestationFile] = useState<File | null>(null);

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      const d = await api.admin.detailDemande(demandeId);
      setDetail(d as any);
    } catch (err: any) {
      toast.error("Erreur", { description: String(err.message || err) });
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [demandeId]);

  async function handleValider() {
    setBusy(true);
    try {
      await api.admin.valider(demandeId);
      toast.success("Dossier approuvé");
      await load(true);
      onChanged();
    } catch (err: any) {
      toast.error("Action impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleRejeter() {
    const motif = window.prompt("Motif du rejet (visible par le demandeur) :");
    if (motif === null) return;
    setBusy(true);
    try {
      await api.admin.rejeter(demandeId, motif);
      toast.success("Dossier rejeté");
      await load(true);
      onChanged();
    } catch (err: any) {
      toast.error("Action impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  function togglePieceManquante(p: string) {
    setPiecesManquantes((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  async function handleEnvoyerComplement() {
    if (piecesManquantes.length === 0 && !noteComplement.trim()) {
      toast.error("Précisez au moins un document manquant ou une note.");
      return;
    }
    const commentaire = [
      piecesManquantes.length > 0 ? `Documents à compléter :\n- ${piecesManquantes.join("\n- ")}` : null,
      noteComplement.trim() || null,
    ]
      .filter(Boolean)
      .join("\n\n");

    setBusy(true);
    try {
      await api.admin.retourner(demandeId, commentaire);
      toast.success("Demande de complément envoyée au demandeur");
      setModeComplement(false);
      setPiecesManquantes([]);
      setNoteComplement("");
      await load(true);
      onChanged();
    } catch (err: any) {
      toast.error("Action impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleEnvoyerMessage() {
    if (!message.trim()) return;
    setBusy(true);
    try {
      await api.demandes.envoyerMessage(demandeId, message.trim());
      setMessage("");
      await load(true);
    } catch (err: any) {
      toast.error("Envoi impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleTelechargerPiece(pieceId: string, nomFichier: string) {
    try {
      await api.demandes.telechargerPiece(demandeId, pieceId, nomFichier);
    } catch (err: any) {
      toast.error("Téléchargement impossible", { description: String(err.message || err) });
    }
  }

  async function handleUploadAttestation() {
    if (!attestationFile) return;
    setBusy(true);
    try {
      await api.admin.uploaderAttestation(demandeId, attestationFile);
      toast.success("Attestation envoyée au demandeur");
      setAttestationFile(null);
      await load(true);
    } catch (err: any) {
      toast.error("Envoi impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  if (loading || !detail) {
    return <div className="p-6 text-sm text-muted-foreground">Chargement du dossier…</div>;
  }

  const estFinal = ["APPROUVEE", "REJETEE"].includes(statut);

  return (
    <div className="p-6 bg-secondary/20 space-y-8 min-w-0 overflow-hidden">
      {/* Demandeur */}
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mb-1">Demandeur</p>
          <p>{detail.demandeur?.prenom} {detail.demandeur?.nom}</p>
          <p className="text-muted-foreground">{detail.demandeur?.email}</p>
        </div>
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mb-1">Dossier</p>
          <p className="font-mono">{detail.numero}</p>
        </div>
      </div>

      {/* Formulaire rempli */}
      <div className="p-6 bg-white ring-1 ring-black/5 rounded-lg min-w-0 overflow-hidden">
        {detail.typeAutorisation?.formulaireSchema?.sections?.length ? (
          <FormDataReview schema={detail.typeAutorisation.formulaireSchema} donnees={detail.donnees ?? {}} />
        ) : (
          <p className="text-sm text-muted-foreground">Aucune donnée de formulaire pour ce dossier.</p>
        )}
      </div>

      {/* Pièces justificatives */}
      <div className="p-4 bg-white ring-1 ring-black/5 rounded-lg">
        <h4 className="font-mono uppercase tracking-[0.15em] text-xs mb-3">Pièces justificatives</h4>
        {detail.pieces.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune pièce jointe pour l'instant.</p>
        ) : (
          <ul className="space-y-2">
            {detail.pieces.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate min-w-0">{p.nomFichier}</span>
                <button
                  onClick={() => handleTelechargerPiece(p.id, p.nomFichier)}
                  className="shrink-0 text-xs font-semibold text-arsn-blue hover:underline"
                >
                  Télécharger
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Attestation d'autorisation (dossier approuvé) */}
      {statut === "APPROUVEE" && (
        <div className="p-4 bg-white ring-1 ring-black/5 rounded-lg">
          <h4 className="font-mono uppercase tracking-[0.15em] text-xs mb-3">Attestation d'autorisation</h4>
          {detail.autorisation ? (
            <div className="flex items-center justify-between gap-3 text-sm">
              <span>
                {detail.autorisation.pdfNomFichier || "attestation.pdf"} — envoyée le{" "}
                {new Date(detail.autorisation.dateSignature).toLocaleDateString("fr-FR")}
              </span>
              <button
                onClick={() => api.demandes.telechargerAttestation(demandeId, detail.autorisation?.pdfNomFichier || undefined)}
                className="shrink-0 text-xs font-semibold text-arsn-blue hover:underline"
              >
                Télécharger
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-3">
              Aucune attestation envoyée pour l'instant. Le demandeur ne pourra la voir dans son compte qu'une fois
              déposée ici.
            </p>
          )}
          <div className="flex items-center gap-3 mt-3">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setAttestationFile(e.target.files?.[0] ?? null)}
              className="text-xs"
            />
            <button
              disabled={!attestationFile || busy}
              onClick={handleUploadAttestation}
              className="px-4 py-2 bg-arsn-green text-white text-xs font-semibold rounded-lg disabled:opacity-50 hover:opacity-90 transition-all duration-200"
            >
              {detail.autorisation ? "Remplacer" : "Envoyer au demandeur"}
            </button>
          </div>
        </div>
      )}

      {/* Messagerie */}
      <div className="p-4 bg-white ring-1 ring-black/5 rounded-lg">
        <h4 className="font-mono uppercase tracking-[0.15em] text-xs mb-3">Échanger avec le demandeur</h4>
        <div className="space-y-2 mb-3 max-h-56 overflow-y-auto">
          {detail.historique.filter((h) => h.action === "MESSAGE").length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun message pour l'instant.</p>
          ) : (
            detail.historique
              .filter((h) => h.action === "MESSAGE")
              .map((h) => (
                <div key={h.id} className="text-sm p-2 rounded-lg bg-secondary/40">
                  <span className="font-semibold">{h.parUser?.prenom} :</span> {h.commentaire}
                </div>
              ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrire un message…"
            className="flex-1 border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-blue/40"
          />
          <button
            disabled={busy || !message.trim()}
            onClick={handleEnvoyerMessage}
            className="px-4 py-2 bg-foreground text-white text-xs font-semibold rounded-lg disabled:opacity-50"
          >
            Envoyer
          </button>
        </div>
      </div>

      {/* Actions de traitement */}
      {!estFinal && (
        <div className="p-4 bg-white ring-1 ring-black/5 rounded-lg">
          {!modeComplement ? (
            <div className="flex gap-2">
              <button
                disabled={busy}
                onClick={handleValider}
                className="px-4 py-2 bg-arsn-green text-white text-xs font-semibold rounded-lg disabled:opacity-50 hover:opacity-90 transition-all duration-200"
              >
                Valider
              </button>
              <button
                disabled={busy}
                onClick={() => setModeComplement(true)}
                className="px-4 py-2 bg-arsn-yellow text-foreground text-xs font-semibold rounded-lg disabled:opacity-50 hover:opacity-90 transition-all duration-200"
              >
                Demander un complément
              </button>
              <button
                disabled={busy}
                onClick={handleRejeter}
                className="px-4 py-2 bg-arsn-red text-white text-xs font-semibold rounded-lg disabled:opacity-50 hover:opacity-90 transition-all duration-200"
              >
                Rejeter
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-reveal">
              <h4 className="font-mono uppercase tracking-[0.15em] text-xs">
                Documents à compléter
              </h4>
              {detail.typeAutorisation?.piecesRequises && detail.typeAutorisation.piecesRequises.length > 0 ? (
                <ul className="space-y-2">
                  {detail.typeAutorisation.piecesRequises.map((p) => (
                    <li key={p}>
                      <label className="flex items-start gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={piecesManquantes.includes(p)}
                          onChange={() => togglePieceManquante(p)}
                          className="mt-0.5"
                        />
                        {p}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune liste de pièces définie pour ce type — précisez directement dans la note ci-dessous.
                </p>
              )}
              <div>
                <label className="block text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  Note complémentaire pour le demandeur
                </label>
                <textarea
                  value={noteComplement}
                  onChange={(e) => setNoteComplement(e.target.value)}
                  rows={3}
                  placeholder="Précisez ce qui manque ou doit être corrigé…"
                  className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-blue/40"
                />
              </div>
              <div className="flex gap-2">
                <button
                  disabled={busy}
                  onClick={() => setModeComplement(false)}
                  className="px-4 py-2 ring-1 ring-border text-xs font-semibold rounded-lg hover:bg-secondary/40 transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  disabled={busy}
                  onClick={handleEnvoyerComplement}
                  className="px-4 py-2 bg-arsn-yellow text-foreground text-xs font-semibold rounded-lg disabled:opacity-50 hover:opacity-90 transition-all duration-200"
                >
                  Envoyer la demande de complément
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState<"INSTRUCTEUR" | "SIGNATAIRE" | "SUPER_ADMIN">("INSTRUCTEUR");
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const list = await api.admin.users.lister();
      setUsers(list);
    } catch (err: any) {
      toast.error("Erreur de chargement", { description: String(err.message || err) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await api.admin.users.creer({ email, motDePasse, nom, prenom, role });
      toast.success("Compte créé", { description: `${prenom} ${nom} (${ROLE_LABELS[role]})` });
      setNom(""); setPrenom(""); setEmail(""); setMotDePasse("");
      setShowForm(false);
      await load();
    } catch (err: any) {
      toast.error("Création impossible", { description: String(err.message || err) });
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActif(u: StaffUser) {
    setBusyId(u.id);
    try {
      await api.admin.users.modifier(u.id, { actif: !u.actif });
      await load();
    } catch (err: any) {
      toast.error("Action impossible", { description: String(err.message || err) });
    } finally {
      setBusyId(null);
    }
  }

  async function handleChangeRole(u: StaffUser, nouveauRole: string) {
    setBusyId(u.id);
    try {
      await api.admin.users.modifier(u.id, { role: nouveauRole });
      await load();
    } catch (err: any) {
      toast.error("Action impossible", { description: String(err.message || err) });
    } finally {
      setBusyId(null);
    }
  }

  async function handleResetPassword(u: StaffUser) {
    const nouveau = window.prompt(`Nouveau mot de passe pour ${u.prenom} ${u.nom} (8 caractères min.) :`);
    if (!nouveau) return;
    setBusyId(u.id);
    try {
      await api.admin.users.reinitialiserMotDePasse(u.id, nouveau);
      toast.success("Mot de passe réinitialisé", { description: `Communique-le à ${u.prenom} ${u.nom}.` });
    } catch (err: any) {
      toast.error("Action impossible", { description: String(err.message || err) });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(u: StaffUser) {
    if (!window.confirm(`Supprimer définitivement le compte de ${u.prenom} ${u.nom} ?`)) return;
    setBusyId(u.id);
    try {
      await api.admin.users.supprimer(u.id);
      toast.success("Compte supprimé");
      await load();
    } catch (err: any) {
      toast.error("Suppression impossible", { description: String(err.message || err) });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6 animate-reveal">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif">Gestion des utilisateurs</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 bg-arsn-green text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-sm active:scale-[0.98]"
        >
          {showForm ? "Annuler" : "+ Nouveau compte"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 bg-white ring-1 ring-black/5 shadow-sm rounded-lg grid sm:grid-cols-2 gap-4 animate-reveal"
        >
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">Prénom</label>
            <input
              type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)}
              className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">Nom</label>
            <input
              type="text" required value={nom} onChange={(e) => setNom(e.target.value)}
              className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">E-mail</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">Mot de passe initial</label>
            <input
              type="text" required minLength={8} value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">Rôle</label>
            <select
              value={role} onChange={(e) => setRole(e.target.value as typeof role)}
              className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
            >
              <option value="INSTRUCTEUR">Instructeur</option>
              <option value="SIGNATAIRE">Signataire</option>
              <option value="SUPER_ADMIN">Super Administrateur</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit" disabled={creating}
              className="px-6 py-3 bg-foreground text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            >
              Créer le compte
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="bg-white ring-1 ring-black/5 shadow-sm rounded-lg divide-y divide-border">
          {users.map((u) => (
            <div key={u.id} className="p-4 flex flex-wrap items-center gap-3 justify-between text-sm hover:bg-secondary/40 transition-colors duration-200">
              <div className="min-w-[160px]">
                <div className="font-semibold">{u.prenom} {u.nom}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
              </div>
              <select
                value={u.role}
                disabled={busyId === u.id}
                onChange={(e) => handleChangeRole(u, e.target.value)}
                className="border border-border bg-white px-2 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
              >
                <option value="DEMANDEUR">Demandeur</option>
                <option value="INSTRUCTEUR">Instructeur</option>
                <option value="SIGNATAIRE">Signataire</option>
                <option value="SUPER_ADMIN">Super Administrateur</option>
              </select>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                  u.actif ? "bg-arsn-green/10 text-arsn-green" : "bg-arsn-red/10 text-arsn-red"
                }`}
              >
                {u.actif ? "Actif" : "Désactivé"}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={busyId === u.id}
                  onClick={() => handleToggleActif(u)}
                  className="px-3 py-1.5 bg-white ring-1 ring-black/10 text-xs font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:bg-secondary active:scale-[0.97]"
                >
                  {u.actif ? "Désactiver" : "Activer"}
                </button>
                <button
                  disabled={busyId === u.id}
                  onClick={() => handleResetPassword(u)}
                  className="px-3 py-1.5 bg-white ring-1 ring-black/10 text-xs font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:bg-secondary active:scale-[0.97]"
                >
                  Réinitialiser mdp
                </button>
                <button
                  disabled={busyId === u.id}
                  onClick={() => handleDelete(u)}
                  className="px-3 py-1.5 bg-arsn-red text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 bg-white ring-1 ring-black/5 shadow-sm rounded-lg animate-reveal">
      <h3 className="text-sm font-mono uppercase tracking-[0.15em] mb-4 text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <p className="text-xs text-muted-foreground">Pas encore de données.</p>
      ) : (
        data.map((d, i) => (
          <div key={d.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{d.label}</span>
              <span className="font-semibold">{d.value}</span>
            </div>
            <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-arsn-green rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(d.value / max) * 100}%`,
                  transitionDelay: `${i * 100}ms`,
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function TrendChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const width = 320;
  const height = 140;
  const padding = 24;
  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1]?.x ?? 0} ${height - padding} L ${points[0]?.x ?? 0} ${height - padding} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border)" strokeWidth="1" />
        {points.length > 1 && (
          <>
            <path d={areaD} fill="var(--arsn-green)" fillOpacity="0.08" className="animate-reveal" />
            <path
              d={pathD}
              fill="none"
              stroke="var(--arsn-green)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-reveal"
            />
          </>
        )}
        {points.map((p, i) => (
          <g key={p.label} style={{ animationDelay: `${i * 80}ms` }} className="animate-reveal">
            <circle cx={p.x} cy={p.y} r="3.5" fill="var(--arsn-green)" />
            <text x={p.x} y={height - padding + 16} fontSize="9" textAnchor="middle" fill="var(--muted-foreground)">
              {p.label}
            </text>
            <text x={p.x} y={p.y - 8} fontSize="9" textAnchor="middle" fill="var(--foreground)" fontWeight="600">
              {p.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function TypesPanel() {
  const [types, setTypes] = useState<TypeAutorisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [duree, setDuree] = useState(12);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setTypes(await api.admin.typesAutorisation.lister());
    } catch (err: any) {
      toast.error("Erreur de chargement", { description: String(err.message || err) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await api.admin.typesAutorisation.creer({ nom, description, dureeValiditeMois: duree });
      toast.success("Type créé");
      setNom(""); setDescription(""); setDuree(12);
      setShowForm(false);
      await load();
    } catch (err: any) {
      toast.error("Création impossible", { description: String(err.message || err) });
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActif(t: TypeAutorisation & { actif?: boolean }) {
    setBusyId(t.id);
    try {
      await api.admin.typesAutorisation.modifier(t.id, { actif: !(t as any).actif });
      await load();
    } catch (err: any) {
      toast.error("Action impossible", { description: String(err.message || err) });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6 animate-reveal">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif">Types d'autorisation</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 bg-arsn-green text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-sm active:scale-[0.98]"
        >
          {showForm ? "Annuler" : "+ Nouveau type"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="p-6 bg-white ring-1 ring-black/5 shadow-sm rounded-lg grid sm:grid-cols-2 gap-4 animate-reveal">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">Nom</label>
            <input
              type="text" required value={nom} onChange={(e) => setNom(e.target.value)}
              className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">Durée de validité (mois)</label>
            <input
              type="number" min={1} required value={duree} onChange={(e) => setDuree(Number(e.target.value))}
              className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit" disabled={creating}
              className="px-6 py-3 bg-foreground text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            >
              Créer le type
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="bg-white ring-1 ring-black/5 shadow-sm rounded-lg divide-y divide-border">
          {types.map((t: any) => (
            <div key={t.id} className="p-4 flex flex-wrap items-center gap-3 justify-between text-sm hover:bg-secondary/40 transition-colors duration-200">
              <div className="min-w-[180px]">
                <div className="font-semibold">{t.nom}</div>
                <div className="text-xs text-muted-foreground">{t.description}</div>
              </div>
              <span className="text-xs text-muted-foreground">{t.dureeValiditeMois} mois de validité</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${t.actif ? "bg-arsn-green/10 text-arsn-green" : "bg-arsn-red/10 text-arsn-red"}`}>
                {t.actif ? "Actif" : "Désactivé"}
              </span>
              <button
                disabled={busyId === t.id}
                onClick={() => handleToggleActif(t)}
                className="px-3 py-1.5 bg-white ring-1 ring-black/10 text-xs font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:bg-secondary active:scale-[0.97]"
              >
                {t.actif ? "Désactiver" : "Activer"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}