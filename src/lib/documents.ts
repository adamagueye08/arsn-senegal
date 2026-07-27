// Official ARSN documents served from Lovable CDN.
// Replace the underlying .asset.json pointers when definitive versions are supplied.
import rapportAnnuel from "@/assets/docs/rapport-annuel-arsn-2024.pdf.asset.json";
import rapportInspection from "@/assets/docs/rapport-inspection-medicale-2024.pdf.asset.json";
import formImport from "@/assets/docs/formulaire-autorisation-importation.pdf.asset.json";
import formExport from "@/assets/docs/formulaire-autorisation-exportation.pdf.asset.json";
import formTransport from "@/assets/docs/formulaire-autorisation-transport.pdf.asset.json";
import guideDosi from "@/assets/docs/guide-dosimetrie-professionnelle.pdf.asset.json";

export type DocMeta = {
  url: string;
  filename: string;
  size: number;
  label: string;
};

const mk = (p: { url: string; original_filename: string; size: number }, label: string): DocMeta => ({
  url: p.url,
  filename: p.original_filename,
  size: p.size,
  label,
});

export const DOCS = {
  rapportAnnuel: mk(rapportAnnuel, "Rapport annuel ARSN 2024"),
  rapportInspection: mk(rapportInspection, "Rapport d'inspection — Secteur médical 2024"),
  formImport: mk(formImport, "Formulaire — Autorisation d'importation"),
  formExport: mk(formExport, "Formulaire — Autorisation d'exportation"),
  formDetention: mk(formImport, "Formulaire — Détention et utilisation"),
  formTransport: mk(formTransport, "Formulaire — Autorisation de transport"),
  guideDosimetrie: mk(guideDosi, "Guide de la dosimétrie professionnelle"),
  formDosimetrie: mk(guideDosi, "Formulaire — Abonnement au service national de dosimétrie"),
} as const;

export type DocKey = keyof typeof DOCS;

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
