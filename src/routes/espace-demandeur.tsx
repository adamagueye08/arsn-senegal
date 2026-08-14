import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/PageHero";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  api,
  getToken,
  getStoredUser,
  clearSession,
  type TypeAutorisation,
  type Demande,
  type DemandeDetail,
} from "@/lib/api";
import { DynamicRequestForm } from "@/components/forms/DynamicRequestForm";

export const Route = createFileRoute("/espace-demandeur")({
  head: () => ({
    meta: [
      { title: "Espace demandeur — ARSN Sénégal" },
      {
        name: "description",
        content: "Déposez une demande d'autorisation en ligne et suivez son traitement.",
      },
    ],
  }),
  component: Page,
});

const FR = {
  hero: "ESPACE DEMANDEUR",
  title: "Espace demandeur",
  subtitle: "Déposez une demande d'autorisation et suivez son traitement en temps réel.",
  welcome: "Bonjour",
  logoutBtn: "Se déconnecter",
  newRequestTitle: "Déposer une nouvelle demande",
  chooseType: "Type d'autorisation",
  submitBtn: "Soumettre la demande",
  saveDraftBtn: "Créer et continuer →",
  newRequestHint: "Vous choisirez le type, puis renseignerez le formulaire officiel correspondant étape par étape.",
  myRequestsTitle: "Mes demandes",
  noRequests: "Vous n'avez pas encore déposé de demande.",
  loading: "Chargement…",
  draftNotesLabel: "Informations du dossier (modifiable tant que la demande n'est pas soumise)",
  draftNotesPlaceholder: "Renseignez ici les informations de votre dossier…",
  saveNotesBtn: "Enregistrer",
  submitFromDraftBtn: "Soumettre la demande",
  successDraft: "Brouillon enregistré",
  successDraftDesc: "Vous pourrez le compléter et le soumettre plus tard. Numéro",
  statusLabels: {
    BROUILLON: "Brouillon",
    SOUMISE: "Soumise",
    EN_COURS: "En cours d'instruction",
    COMPLEMENT_REQUIS: "Complément requis",
    APPROUVEE: "Approuvée",
    REJETEE: "Rejetée",
    EXPIREE: "Expirée",
  },
  successRequest: "Demande soumise",
  successRequestDesc: "Votre demande a été enregistrée sous le numéro",
  errorGeneric: "Une erreur est survenue",
};

const EN: typeof FR = {
  hero: "APPLICANT AREA",
  title: "Applicant area",
  subtitle: "Submit an authorisation request and track its progress in real time.",
  welcome: "Hello",
  logoutBtn: "Sign out",
  newRequestTitle: "Submit a new request",
  chooseType: "Authorisation type",
  submitBtn: "Submit request",
  saveDraftBtn: "Create and continue →",
  newRequestHint: "Choose the type, then fill in the corresponding official form step by step.",
  myRequestsTitle: "My requests",
  noRequests: "You haven't submitted any request yet.",
  loading: "Loading…",
  draftNotesLabel: "Request details (editable until the request is submitted)",
  draftNotesPlaceholder: "Enter your request details here…",
  saveNotesBtn: "Save",
  submitFromDraftBtn: "Submit request",
  successDraft: "Draft saved",
  successDraftDesc: "You can complete and submit it later. Number",
  statusLabels: {
    BROUILLON: "Draft",
    SOUMISE: "Submitted",
    EN_COURS: "Under review",
    COMPLEMENT_REQUIS: "Additional info requested",
    APPROUVEE: "Approved",
    REJETEE: "Rejected",
    EXPIREE: "Expired",
  },
  successRequest: "Request submitted",
  successRequestDesc: "Your request has been recorded under number",
  errorGeneric: "Something went wrong",
};

type Dict = typeof FR;

function Page() {
  const { lang } = useLang();
  const c = lang === "fr" ? FR : EN;
  const navigate = useNavigate();

  const [user, setUser] = useState<{ nom: string; prenom: string; role: string } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = getStoredUser<{ nom: string; prenom: string; role: string }>();
    if (!stored || !getToken()) {
      navigate({ to: "/connexion" });
      return;
    }
    if (stored.role !== "DEMANDEUR") {
      navigate({ to: "/admin" });
      return;
    }
    setUser(stored);
    setChecked(true);
  }, []);

  if (!checked || !user) return null;

  return (
    <>
      <PageHero eyebrow={c.hero} title={c.title} subtitle={c.subtitle} />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
        <Dashboard c={c} user={user} />
      </div>
    </>
  );
}

function Dashboard({ c, user }: { c: Dict; user: { nom: string; prenom: string } }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [types, setTypes] = useState<TypeAutorisation[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [echeances, setEcheances] = useState<Demande[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function loadAll() {
    setLoadingData(true);
    try {
      const [t, d, e] = await Promise.all([
        api.typesAutorisation.lister(),
        api.demandes.lister(),
        api.demandes.echeancesProches().catch(() => []),
      ]);
      setTypes(t);
      setSelectedType((prev) => prev || t[0]?.id || "");
      setDemandes(d);
      setEcheances(e);
    } catch (e: any) {
      toast.error(c.errorGeneric, { description: String(e.message || e) });
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleNewRequest() {
    if (!selectedType) return;
    setBusy(true);
    try {
      const demande = await api.demandes.creer({ typeAutorisationId: selectedType, donnees: {} });
      setDemandes((prev) => [demande, ...prev]);
      setExpandedId(demande.id);
      toast.success(c.successDraft, { description: `${c.successDraftDesc} ${demande.numero}` });
    } catch (err: any) {
      toast.error(c.errorGeneric, { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    clearSession();
    navigate({ to: "/connexion" });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm">
          {c.welcome} <strong>{user.prenom} {user.nom}</strong>
        </p>
        <button onClick={handleLogout} className="text-xs font-mono uppercase tracking-[0.15em] underline">
          {c.logoutBtn}
        </button>
      </div>

      {echeances.length > 0 && (
        <div className="p-4 bg-arsn-yellow/10 ring-1 ring-arsn-yellow/30 rounded-lg text-sm animate-reveal">
          <strong className="block mb-1">⏳ Échéances à venir</strong>
          {echeances.map((d) => (
            <div key={d.id} className="text-muted-foreground">
              {d.numero} — {d.typeAutorisation?.nom} : expire le{" "}
              {d.dateExpiration ? new Date(d.dateExpiration).toLocaleDateString("fr-FR") : "—"}
            </div>
          ))}
        </div>
      )}

      <div className="p-8 bg-white ring-1 ring-black/5 shadow-sm rounded-lg">
        <h2 className="text-xl font-serif mb-1">{c.newRequestTitle}</h2>
        <p className="text-sm text-muted-foreground mb-4">{c.newRequestHint}</p>
        <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end max-w-xl">
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">{c.chooseType}</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-border bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nom}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleNewRequest}
            disabled={busy || !selectedType}
            className="px-6 py-3 bg-arsn-blue text-white text-sm font-semibold hover:opacity-90 rounded-lg disabled:opacity-50 h-fit transition-all duration-200 hover:shadow-md active:scale-[0.98]"
          >
            {c.saveDraftBtn}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-mono uppercase tracking-[0.2em] mb-4">{c.myRequestsTitle}</h3>
        {loadingData ? (
          <p className="text-sm text-muted-foreground">{c.loading}</p>
        ) : demandes.length === 0 ? (
          <p className="text-sm text-muted-foreground">{c.noRequests}</p>
        ) : (
          <div className="space-y-2">
            {demandes.map((d, i) => (
              <DemandeRow
                key={d.id}
                demande={d}
                c={c}
                expanded={expandedId === d.id}
                delay={i * 60}
                onToggle={() => setExpandedId(expandedId === d.id ? null : d.id)}
                onChanged={loadAll}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DemandeRow({
  demande,
  c,
  expanded,
  delay,
  onToggle,
  onChanged,
}: {
  demande: Demande;
  c: Dict;
  expanded: boolean;
  delay: number;
  onToggle: () => void;
  onChanged: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Supprimer définitivement ce brouillon ? Cette action est irréversible.")) return;
    setDeleting(true);
    try {
      await api.demandes.supprimer(demande.id);
      toast.success("Brouillon supprimé");
      onChanged();
    } catch (err: any) {
      toast.error("Suppression impossible", { description: String(err.message || err) });
      setDeleting(false);
    }
  }

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="ring-1 ring-black/5 shadow-sm rounded-lg overflow-hidden animate-reveal"
    >
      <div className="w-full flex items-center gap-2 min-w-0">
        <button
          onClick={onToggle}
          className="flex-1 flex items-center justify-between gap-2 p-4 text-sm hover:bg-secondary/40 transition-colors duration-200 text-left min-w-0"
        >
          <span className="font-mono shrink-0">{demande.numero}</span>
          <span className="text-muted-foreground truncate min-w-0 flex-1 text-center">
            {demande.typeAutorisation?.nom}
          </span>
          <span className="font-semibold shrink-0 whitespace-nowrap">
            {c.statusLabels[demande.statut as keyof typeof c.statusLabels] ?? demande.statut}
          </span>
          <span className="text-xs shrink-0">{expanded ? "▲" : "▼"}</span>
        </button>
        {demande.statut === "BROUILLON" && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Supprimer ce brouillon"
            className="shrink-0 mr-3 w-8 h-8 rounded-lg flex items-center justify-center text-arsn-red hover:bg-arsn-red/10 transition-colors duration-200 disabled:opacity-50"
          >
            🗑
          </button>
        )}
      </div>
      {expanded && (
        <div className="min-w-0 overflow-hidden">
          <DemandeDetailPanel demandeId={demande.id} statut={demande.statut} onChanged={onChanged} />
        </div>
      )}
    </div>
  );
}

function DemandeDetailPanel({
  demandeId,
  statut,
  onChanged,
}: {
  demandeId: string;
  statut: string;
  onChanged: () => void;
}) {
  const [detail, setDetail] = useState<DemandeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      const d = await api.demandes.detail(demandeId);
      setDetail(d);
      setDraftNotes(typeof d.donnees?.notes === "string" ? d.donnees.notes : "");
    } catch (err: any) {
      toast.error("Erreur", { description: String(err.message || err) });
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [demandeId]);

  async function handleSaveStep(donneesCompletes: Record<string, unknown>) {
    setBusy(true);
    try {
      await api.demandes.modifier(demandeId, donneesCompletes);
      await load(true);
    } catch (err: any) {
      toast.error("Enregistrement impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmitDynamicForm(donneesCompletes: Record<string, unknown>) {
    setBusy(true);
    try {
      if (statut === "COMPLEMENT_REQUIS") {
        await api.demandes.repondreComplement(demandeId, donneesCompletes, "Complément fourni par le demandeur.");
        toast.success("Complément envoyé, votre dossier repart en instruction.");
      } else {
        await api.demandes.modifier(demandeId, donneesCompletes);
        await api.demandes.soumettre(demandeId);
        toast.success("Demande soumise");
      }
      await load(true);
      onChanged();
    } catch (err: any) {
      toast.error("Soumission impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveDraft() {
    setBusy(true);
    try {
      await api.demandes.modifier(demandeId, { ...(detail?.donnees ?? {}), notes: draftNotes });
      toast.success("Brouillon enregistré");
      await load(true);
    } catch (err: any) {
      toast.error("Enregistrement impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmitDraft() {
    setBusy(true);
    try {
      await api.demandes.modifier(demandeId, { ...(detail?.donnees ?? {}), notes: draftNotes });
      await api.demandes.soumettre(demandeId);
      toast.success("Demande soumise");
      await load(true);
      onChanged();
    } catch (err: any) {
      toast.error("Soumission impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      await api.demandes.ajouterPieces(demandeId, Array.from(files));
      toast.success("Pièce(s) jointe(s) ajoutée(s)");
      await load(true);
    } catch (err: any) {
      toast.error("Envoi impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
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

  async function handleRepondreComplement() {
    setBusy(true);
    try {
      await api.demandes.repondreComplement(
        demandeId,
        { ...(detail?.donnees ?? {}), notes: draftNotes },
        "Complément fourni par le demandeur."
      );
      toast.success("Complément envoyé, votre dossier repart en instruction.");
      await load(true);
      onChanged();
    } catch (err: any) {
      toast.error("Action impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleRenouveler() {
    setBusy(true);
    try {
      const nouvelle = await api.demandes.renouveler(demandeId);
      toast.success("Demande de renouvellement créée", { description: nouvelle.numero });
      onChanged();
    } catch (err: any) {
      toast.error("Action impossible", { description: String(err.message || err) });
    } finally {
      setBusy(false);
    }
  }

  if (loading || !detail) {
    return <div className="p-4 border-t border-border text-sm text-muted-foreground">Chargement…</div>;
  }

  return (
    <div className="p-4 border-t border-border bg-secondary/20 space-y-6 text-sm">
      {statut === "COMPLEMENT_REQUIS" && (
        <div className="p-3 bg-arsn-yellow/10 ring-1 ring-arsn-yellow/30 rounded-lg text-sm">
          L'ARSN a demandé un complément d'information sur ce dossier. Complétez les informations ci-dessous et vos
          pièces justificatives, puis envoyez votre complément.
        </div>
      )}

      {(statut === "BROUILLON" || statut === "COMPLEMENT_REQUIS") && (
        detail.typeAutorisation?.formulaireSchema?.sections?.length ? (
          <div className="p-6 bg-white ring-1 ring-black/5 rounded-lg min-w-0 overflow-hidden">
            <DynamicRequestForm
              schema={detail.typeAutorisation.formulaireSchema}
              initialValue={detail.donnees ?? {}}
              piecesRequises={detail.typeAutorisation.piecesRequises}
              pieces={detail.pieces}
              busy={busy}
              numeroDossier={detail.numero}
              onSaveStep={handleSaveStep}
              onSubmitFinal={handleSubmitDynamicForm}
            />
          </div>
        ) : (
        <div className="p-4 bg-white ring-1 ring-black/5 rounded-lg space-y-3">
          <h4 className="font-mono uppercase tracking-[0.15em] text-xs">Informations du dossier</h4>
          <label className="block text-xs text-muted-foreground">{
            "Renseignez les informations de votre dossier, enregistrez pour continuer plus tard, ou soumettez quand il est complet."
          }</label>
          <textarea
            value={draftNotes}
            onChange={(e) => setDraftNotes(e.target.value)}
            rows={4}
            placeholder="Renseignez ici les informations de votre dossier…"
            className="w-full border border-border bg-white px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
          />
          <div className="flex gap-2">
            <button
              disabled={busy}
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-white ring-1 ring-border text-foreground text-xs font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:bg-secondary/40 active:scale-[0.97]"
            >
              Enregistrer
            </button>
            <button
              disabled={busy}
              onClick={statut === "COMPLEMENT_REQUIS" ? handleRepondreComplement : handleSubmitDraft}
              className="px-4 py-2 bg-arsn-green text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              {statut === "COMPLEMENT_REQUIS" ? "Envoyer le complément" : "Soumettre la demande"}
            </button>
          </div>
        </div>
        )
      )}

      {statut === "APPROUVEE" && (
        <div className="p-3 bg-arsn-green/10 ring-1 ring-arsn-green/30 rounded-lg flex items-center justify-between gap-3">
          <span>Autorisation approuvée.</span>
          <button
            disabled={busy}
            onClick={handleRenouveler}
            className="px-4 py-2 bg-foreground text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:shadow-sm active:scale-[0.97] whitespace-nowrap"
          >
            Demander un renouvellement
          </button>
        </div>
      )}

      <div>
        <h4 className="font-mono uppercase tracking-[0.15em] text-xs mb-2">Pièces justificatives</h4>
        {detail.pieces.length === 0 ? (
          <p className="text-muted-foreground text-xs mb-2">Aucune pièce jointe pour l'instant.</p>
        ) : (
          <ul className="mb-2 space-y-1">
            {detail.pieces.map((p) => (
              <li key={p.id} className="text-xs text-muted-foreground">📎 {p.nomFichier}</li>
            ))}
          </ul>
        )}
        <input type="file" multiple disabled={busy} onChange={handleUpload} className="text-xs" />
      </div>

      <div>
        <h4 className="font-mono uppercase tracking-[0.15em] text-xs mb-2">Échanger avec l'instructeur</h4>
        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
          {detail.historique.filter((h) => h.action === "MESSAGE" || h.commentaire).map((h) => (
            <div key={h.id} className="p-2 bg-white rounded-lg ring-1 ring-black/5 text-xs">
              <div className="font-semibold">{h.parUser ? `${h.parUser.prenom} ${h.parUser.nom}` : "—"}</div>
              <div className="text-muted-foreground">{h.commentaire}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrire un message…"
            className="flex-1 border border-border bg-white px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
          />
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 bg-foreground text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-all duration-200 hover:shadow-sm active:scale-[0.97]"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}