import { useState } from "react";
import type { FormSchema, FormFieldDef } from "@/lib/api";

type FormData = Record<string, unknown>;

/**
 * Formulaire dynamique multi-étapes : chaque section du schéma devient une
 * étape. Le rail numéroté à gauche reprend la numérotation réelle des
 * formulaires papier ARSN (1. Le déclarant, 2. Établissement, etc.) — ce
 * n'est pas un décor, c'est la structure même du document officiel rendue
 * interactive.
 */
export function DynamicRequestForm({
  schema,
  initialValue,
  piecesRequises,
  pieces,
  busy,
  readOnly,
  numeroDossier,
  onSaveStep,
  onSubmitFinal,
}: {
  schema: FormSchema;
  initialValue: FormData;
  piecesRequises?: string[];
  pieces?: { id: string; nomFichier: string }[];
  busy?: boolean;
  readOnly?: boolean;
  numeroDossier?: string;
  onSaveStep: (data: FormData) => void | Promise<void>;
  onSubmitFinal: (data: FormData) => void | Promise<void>;
}) {
  const sections = schema.sections ?? [];
  const totalSteps = sections.length + 1; // + étape finale "Pièces & envoi"
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(() => {
    const seeded = { ...initialValue };
    sections.forEach((s) =>
      s.champs.forEach((champ) => {
        if (champ.valeurParDefaut !== undefined && seeded[champ.cle] === undefined) {
          seeded[champ.cle] = champ.valeurParDefaut;
        }
      })
    );
    return seeded;
  });

  function updateField(cle: string, valeur: unknown) {
    setData((prev) => ({ ...prev, [cle]: valeur }));
  }

  async function goTo(next: number) {
    await onSaveStep(data);
    setStep(Math.max(0, Math.min(totalSteps - 1, next)));
  }

  const isFinalStep = step === totalSteps - 1;
  const progressPct = totalSteps > 1 ? (step / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* En-tête façon document officiel : référence + numéro de dossier */}
      {(schema.reference || numeroDossier) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-4 border-b border-border">
          {schema.reference && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded ring-1 ring-arsn-blue/30 bg-arsn-blue/5 text-[11px] font-mono font-semibold tracking-wider text-arsn-blue">
              RÉF. {schema.reference}
            </span>
          )}
          {numeroDossier && (
            <span className="text-[11px] font-mono tracking-wider text-muted-foreground">
              DOSSIER {numeroDossier}
            </span>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
      {/* Rail d'étapes numérotées — desktop */}
      <nav className="hidden md:block relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" aria-hidden />
        <div
          className="absolute left-[15px] top-2 w-px bg-arsn-green transition-all duration-500 ease-out"
          style={{ height: `calc((100% - 1rem) * ${progressPct / 100})` }}
          aria-hidden
        />
        <ol className="space-y-1">
          {[...sections.map((s) => s.titre), "Pièces & envoi"].map((titre, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <li key={titre}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className="relative z-10 flex items-start gap-3 w-full text-left py-2 group"
                >
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold ring-1 transition-all duration-300 ${
                      done
                        ? "bg-arsn-green text-white ring-arsn-green"
                        : active
                        ? "bg-arsn-blue text-white ring-arsn-blue scale-110 shadow-md shadow-arsn-blue/20"
                        : "bg-white text-muted-foreground ring-border group-hover:ring-arsn-blue-light"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span
                    className={`text-sm pt-1.5 leading-tight transition-colors duration-200 ${
                      active ? "font-semibold text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {titre}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Barre de progression compacte — mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">
          <span>
            Étape {step + 1} / {totalSteps}
          </span>
          <span>{isFinalStep ? "Pièces & envoi" : sections[step]?.titre}</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-arsn-green transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {!isFinalStep ? (
          <div key={step} className="animate-reveal">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-arsn-blue mb-1">
              Section {String(step + 1).padStart(2, "0")}
            </p>
            <h4 className="text-xl font-serif mb-1">{sections[step].titre}</h4>
            <div className="h-px bg-border mb-6" />
            <div className="grid sm:grid-cols-2 gap-5">
              {sections[step].champs.map((champ) => (
                <FieldRenderer
                  key={champ.cle}
                  champ={champ}
                  value={data[champ.cle]}
                  onChange={(v) => updateField(champ.cle, v)}
                  disabled={readOnly}
                />
              ))}
            </div>
          </div>
        ) : (
          <div key="final" className="animate-reveal space-y-6">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-arsn-blue mb-1">
                Section {String(totalSteps).padStart(2, "0")}
              </p>
              <h4 className="text-xl font-serif mb-1">Pièces & envoi</h4>
              <div className="h-px bg-border mb-6" />
              {piecesRequises && piecesRequises.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mb-3">
                    Documents à fournir pour ce type de demande
                  </p>
                  <ul className="space-y-2">
                    {piecesRequises.map((p) => {
                      const fourni = pieces?.some((pc) =>
                        pc.nomFichier.toLowerCase().includes(p.split(" ")[0]?.toLowerCase() ?? "")
                      );
                      return (
                        <li key={p} className="flex items-start gap-2 text-sm">
                          <span
                            className={`mt-0.5 shrink-0 w-4 h-4 rounded-full ring-1 flex items-center justify-center text-[9px] ${
                              fourni ? "bg-arsn-green text-white ring-arsn-green" : "ring-border text-transparent"
                            }`}
                          >
                            ✓
                          </span>
                          <span className={fourni ? "text-foreground" : "text-muted-foreground"}>{p}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Joignez ces documents via la section « Pièces justificatives » ci-dessous, puis soumettez votre
                    demande.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            disabled={step === 0 || busy}
            onClick={() => goTo(step - 1)}
            className="px-4 py-2 text-xs font-semibold rounded-lg ring-1 ring-border disabled:opacity-40 hover:bg-secondary/40 transition-all duration-200"
          >
            ← Précédent
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => onSaveStep(data)}
              className="px-4 py-2 text-xs font-semibold rounded-lg ring-1 ring-border disabled:opacity-50 hover:bg-secondary/40 transition-all duration-200"
            >
              Enregistrer le brouillon
            </button>
            {!isFinalStep ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => goTo(step + 1)}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-arsn-blue text-white disabled:opacity-50 hover:opacity-90 transition-all duration-200 active:scale-[0.97]"
              >
                Suivant →
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => onSubmitFinal(data)}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-arsn-green text-white disabled:opacity-50 hover:opacity-90 transition-all duration-200 active:scale-[0.97]"
              >
                Soumettre la demande
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function FieldRenderer({
  champ,
  value,
  onChange,
  disabled,
}: {
  champ: FormFieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  disabled?: boolean;
}) {
  const label = (
    <label className="block text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">
      {champ.label}
      {champ.requis && <span className="text-arsn-red"> *</span>}
    </label>
  );

  const inputClass =
    "w-full border border-border bg-white px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-arsn-blue/40 disabled:opacity-60 disabled:bg-secondary/40";

  switch (champ.type) {
    case "zone":
      return (
        <div className="sm:col-span-2">
          {label}
          <textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            rows={3}
            className={inputClass}
          />
        </div>
      );

    case "choix":
      return (
        <div className="sm:col-span-2">
          {label}
          <div className="flex flex-wrap gap-2">
            {champ.options?.map((opt) => {
              const selected = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(opt)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full ring-1 transition-all duration-150 disabled:opacity-60 ${
                    selected
                      ? "bg-arsn-blue text-white ring-arsn-blue"
                      : "bg-white text-foreground ring-border hover:ring-arsn-blue-light"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );

    case "cases": {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="sm:col-span-2">
          {label}
          <div className="flex flex-wrap gap-2">
            {champ.options?.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    onChange(checked ? selected.filter((o) => o !== opt) : [...selected, opt])
                  }
                  className={`px-3 py-1.5 text-xs font-medium rounded-full ring-1 transition-all duration-150 disabled:opacity-60 ${
                    checked
                      ? "bg-arsn-green text-white ring-arsn-green"
                      : "bg-white text-foreground ring-border hover:ring-arsn-blue-light"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    case "confirmation":
      return (
        <label className="sm:col-span-2 flex items-start gap-3 p-4 bg-secondary/30 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={value === true}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-sm">
            {champ.label}
            {champ.requis && <span className="text-arsn-red"> *</span>}
          </span>
        </label>
      );

    case "tableau": {
      const rows = Array.isArray(value) ? (value as Record<string, string>[]) : [];
      const colonnes = champ.colonnes ?? [];
      return (
        <div className="sm:col-span-2">
          {label}
          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary/40">
                  {colonnes.map((col) => (
                    <th key={col.cle} className="text-left font-mono uppercase tracking-wide p-2 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  {!disabled && <th className="p-2 w-8" />}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={colonnes.length + 1} className="p-3 text-center text-muted-foreground">
                      Aucune ligne — ajoutez-en une ci-dessous.
                    </td>
                  </tr>
                )}
                {rows.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    {colonnes.map((col) => (
                      <td key={col.cle} className="p-1.5">
                        <input
                          value={row[col.cle] ?? ""}
                          disabled={disabled}
                          onChange={(e) => {
                            const next = [...rows];
                            next[i] = { ...next[i], [col.cle]: e.target.value };
                            onChange(next);
                          }}
                          className="w-full border border-border bg-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-arsn-blue/40 disabled:opacity-60"
                        />
                      </td>
                    ))}
                    {!disabled && (
                      <td className="p-1.5">
                        <button
                          type="button"
                          onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
                          className="text-arsn-red text-xs font-bold px-1"
                          aria-label="Supprimer la ligne"
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange([...rows, {}])}
              className="mt-2 text-xs font-semibold text-arsn-blue hover:underline"
            >
              + Ajouter une ligne
            </button>
          )}
        </div>
      );
    }

    case "nombre":
      return (
        <div>
          {label}
          <input
            type="number"
            value={(value as string | number) ?? ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        </div>
      );

    case "email":
      return (
        <div>
          {label}
          <input
            type="email"
            value={(value as string) ?? ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        </div>
      );

    case "date":
      return (
        <div>
          {label}
          <input
            type="date"
            value={(value as string) ?? ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        </div>
      );

    default:
      return (
        <div>
          {label}
          <input
            type="text"
            value={(value as string) ?? ""}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        </div>
      );
  }
}
