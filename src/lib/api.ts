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

export interface TypeAutorisation {
  id: string;
  nom: string;
  description: string | null;
  dureeValiditeMois: number;
}

export interface Demande {
  id: string;
  numero: string;
  statut: string;
  createdAt: string;
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
    creer: (data: { typeAutorisationId: string; donnees: Record<string, unknown> }) =>
      request<Demande>("/demandes", { method: "POST", body: JSON.stringify(data) }),
    soumettre: (id: string) => request<Demande>(`/demandes/${id}/submit`, { method: "POST" }),
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
    valider: (id: string, opts?: { decisionFinale?: boolean; commentaire?: string }) =>
      request<Demande>(`/admin/demandes/${id}/valider`, { method: "POST", body: JSON.stringify(opts ?? {}) }),
    rejeter: (id: string, motif?: string) =>
      request<Demande>(`/admin/demandes/${id}/rejeter`, { method: "POST", body: JSON.stringify({ motif }) }),
    retourner: (id: string, commentaire?: string) =>
      request<Demande>(`/admin/demandes/${id}/retourner`, {
        method: "POST",
        body: JSON.stringify({ commentaire }),
      }),
  },
};