/**
 * Client API pour parler au backend ARSN.
 * Utilise la variable d'environnement VITE_API_URL (définie dans .env,
 * ou dans les réglages Vercel pour la production).
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const TOKEN_KEY = "arsn_token";
const USER_KEY = "arsn_user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: unknown) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser<T = any>(): T | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const erreur = await res.json().catch(() => ({ erreur: res.statusText }));
    throw new Error(
      typeof erreur.erreur === "string" ? erreur.erreur : JSON.stringify(erreur.erreur ?? "Erreur inconnue")
    );
  }
  return res.json();
}

export interface FormFieldDef {
  cle: string;
  label: string;
  type: "texte" | "email" | "nombre" | "zone" | "choix" | "cases" | "tableau" | "confirmation" | "date";
  requis?: boolean;
  options?: string[];
  valeurParDefaut?: unknown;
  colonnes?: { cle: string; label: string }[];
}

export interface FormSectionDef {
  titre: string;
  champs: FormFieldDef[];
}

export interface FormSchema {
  reference?: string;
  sections: FormSectionDef[];
}

export interface TypeAutorisation {
  id: string;
  nom: string;
  description: string | null;
  dureeValiditeMois: number;
  formulaireSchema?: FormSchema;
  piecesRequises?: string[];
}

export interface Demande {
  id: string;
  numero: string;
  statut: string;
  createdAt: string;
  dateExpiration?: string | null;
  typeAutorisation?: TypeAutorisation;
}

export interface DemandeAdmin extends Demande {
  demandeur?: { nom: string; prenom: string; email: string; organisation?: string | null };
  instructeur?: { nom: string; prenom: string } | null;
}

export interface DashboardStats {
  demandesRecues: number;
  demandesEnAttente: number;
  demandesApprouvees: number;
  demandesRejetees: number;
  demandesExpirees: number;
  parType: { typeAutorisationId: string; nom: string; total: number }[];
  parMois: { mois: string; total: number }[];
}

export interface StaffUser {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  actif: boolean;
  createdAt: string;
}

export interface HistoriqueEntry {
  id: string;
  action: string;
  commentaire: string | null;
  createdAt: string;
  parUser?: { nom: string; prenom: string; role: string };
}

export interface DemandeDetail extends Demande {
  donnees: Record<string, unknown>;
  pieces: { id: string; nomFichier: string; uploadedAt: string }[];
  historique: HistoriqueEntry[];
  autorisation?: { pdfCheminStockage: string; qrCodeValeur: string; dateSignature: string } | null;
}

export const api = {
  auth: {
    register: (data: { email: string; motDePasse: string; nom: string; prenom: string }) =>
      request<{ token: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; motDePasse: string }) =>
      request<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () => request("/auth/me"),
  },
  typesAutorisation: {
    lister: () => request<TypeAutorisation[]>("/types-autorisation"),
  },
  demandes: {
    lister: () => request<Demande[]>("/demandes"),
    detail: (id: string) => request<DemandeDetail>(`/demandes/${id}`),
    creer: (data: { typeAutorisationId: string; donnees: Record<string, unknown> }) =>
      request<Demande>("/demandes", { method: "POST", body: JSON.stringify(data) }),
    modifier: (id: string, donnees: Record<string, unknown>) =>
      request<Demande>(`/demandes/${id}`, { method: "PUT", body: JSON.stringify({ donnees }) }),
    soumettre: (id: string) => request<Demande>(`/demandes/${id}/submit`, { method: "POST" }),
    repondreComplement: (id: string, donnees: Record<string, unknown>, commentaire?: string) =>
      request<Demande>(`/demandes/${id}/complement`, {
        method: "POST",
        body: JSON.stringify({ donnees, commentaire }),
      }),
    renouveler: (id: string) => request<Demande>(`/demandes/${id}/renouveler`, { method: "POST" }),
    envoyerMessage: (id: string, commentaire: string) =>
      request<HistoriqueEntry>(`/demandes/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ commentaire }),
      }),
    echeancesProches: () => request<Demande[]>("/demandes/echeances/proches"),
    ajouterPieces: async (id: string, fichiers: File[]) => {
      const token = getToken();
      const formData = new FormData();
      fichiers.forEach((f) => formData.append("fichiers", f));
      const res = await fetch(`${API_URL}/demandes/${id}/pieces`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      if (!res.ok) {
        const erreur = await res.json().catch(() => ({ erreur: res.statusText }));
        throw new Error(typeof erreur.erreur === "string" ? erreur.erreur : "Erreur d'envoi");
      }
      return res.json();
    },
  },
  admin: {
    dashboard: () => request<DashboardStats>("/admin/dashboard"),
    listerDemandes: (params?: { q?: string; statut?: string }) => {
      const query = new URLSearchParams();
      if (params?.q) query.set("q", params.q);
      if (params?.statut) query.set("statut", params.statut);
      const qs = query.toString();
      return request<DemandeAdmin[]>(`/admin/demandes${qs ? `?${qs}` : ""}`);
    },
    valider: (id: string, opts?: { commentaire?: string }) =>
      request<Demande>(`/admin/demandes/${id}/valider`, { method: "POST", body: JSON.stringify(opts ?? {}) }),
    rejeter: (id: string, motif?: string) =>
      request<Demande>(`/admin/demandes/${id}/rejeter`, { method: "POST", body: JSON.stringify({ motif }) }),
    retourner: (id: string, commentaire?: string) =>
      request<Demande>(`/admin/demandes/${id}/retourner`, {
        method: "POST",
        body: JSON.stringify({ commentaire }),
      }),
    users: {
      lister: () => request<StaffUser[]>("/admin/users"),
      creer: (data: { email: string; motDePasse: string; nom: string; prenom: string; role: string }) =>
        request<StaffUser>("/admin/users", { method: "POST", body: JSON.stringify(data) }),
      modifier: (id: string, data: { role?: string; actif?: boolean }) =>
        request<StaffUser>(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
      reinitialiserMotDePasse: (id: string, nouveauMotDePasse: string) =>
        request<{ statut: string }>(`/admin/users/${id}/reinitialiser-mot-de-passe`, {
          method: "POST",
          body: JSON.stringify({ nouveauMotDePasse }),
        }),
      supprimer: (id: string) => request<{ statut: string }>(`/admin/users/${id}`, { method: "DELETE" }),
    },
    typesAutorisation: {
      lister: () => request<TypeAutorisation[]>("/admin/types-autorisation"),
      creer: (data: { nom: string; description?: string; dureeValiditeMois: number; frais?: number }) =>
        request<TypeAutorisation>("/admin/types-autorisation", { method: "POST", body: JSON.stringify(data) }),
      modifier: (id: string, data: Partial<{ nom: string; description: string; dureeValiditeMois: number; frais: number; actif: boolean }>) =>
        request<TypeAutorisation>(`/admin/types-autorisation/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    },
  },
};