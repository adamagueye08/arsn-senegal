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
} from "@/lib/api";

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
  myRequestsTitle: "Mes demandes",
  noRequests: "Vous n'avez pas encore déposé de demande.",
  loading: "Chargement…",
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
  myRequestsTitle: "My requests",
  noRequests: "You haven't submitted any request yet.",
  loading: "Loading…",
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

  // Garde d'accès : il faut être connecté ET être un DEMANDEUR.
  // Un agent ARSN qui arrive ici est renvoyé vers /admin.
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
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    setLoadingData(true);
    Promise.all([api.typesAutorisation.lister(), api.demandes.lister()])
      .then(([t, d]) => {
        setTypes(t);
        setSelectedType((prev) => prev || t[0]?.id || "");
        setDemandes(d);
      })
      .catch((e: any) => toast.error(c.errorGeneric, { description: String(e.message || e) }))
      .finally(() => setLoadingData(false));
  }, []);

  async function handleNewRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType) return;
    setBusy(true);
    try {
      const demande = await api.demandes.creer({ typeAutorisationId: selectedType, donnees: {} });
      const soumise = await api.demandes.soumettre(demande.id);
      setDemandes((prev) => [soumise, ...prev]);
      toast.success(c.successRequest, { description: `${c.successRequestDesc} ${soumise.numero}` });
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
    <div className="p-8 bg-white ring-1 ring-black/5 space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm">
          {c.welcome} <strong>{user.prenom} {user.nom}</strong>
        </p>
        <button onClick={handleLogout} className="text-xs font-mono uppercase tracking-[0.15em] underline">
          {c.logoutBtn}
        </button>
      </div>

      <div>
        <h2 className="text-xl font-serif font-bold mb-4">{c.newRequestTitle}</h2>
        <form onSubmit={handleNewRequest} className="grid sm:grid-cols-[1fr_auto] gap-4 items-end max-w-2xl">
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] mb-2">{c.chooseType}</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-arsn-green/40"
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nom}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={busy || !selectedType}
            className="px-6 py-3 bg-arsn-green text-white text-sm font-semibold hover:opacity-90 rounded-sm disabled:opacity-50 h-fit"
          >
            {c.submitBtn}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-sm font-mono uppercase tracking-[0.2em] mb-4">{c.myRequestsTitle}</h3>
        {loadingData ? (
          <p className="text-sm text-muted-foreground">{c.loading}</p>
        ) : demandes.length === 0 ? (
          <p className="text-sm text-muted-foreground">{c.noRequests}</p>
        ) : (
          <ul className="space-y-2">
            {demandes.map((d) => (
              <li key={d.id} className="flex items-center justify-between p-4 ring-1 ring-black/5 text-sm">
                <span className="font-mono">{d.numero}</span>
                <span className="text-muted-foreground">{d.typeAutorisation?.nom}</span>
                <span className="font-semibold">
                  {c.statusLabels[d.statut as keyof typeof c.statusLabels] ?? d.statut}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}