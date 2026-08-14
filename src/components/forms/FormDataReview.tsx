import type { FormSchema, FormFieldDef } from "@/lib/api";

/**
 * Affiche l'intégralité d'un formulaire rempli, section par section, en
 * lecture seule — vue de relecture pour l'admin (par opposition au
 * DynamicRequestForm, multi-étapes et éditable, côté demandeur).
 */
export function FormDataReview({
  schema,
  donnees,
}: {
  schema: FormSchema;
  donnees: Record<string, unknown>;
}) {
  const sections = schema.sections ?? [];

  return (
    <div className="space-y-8">
      {schema.reference && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded ring-1 ring-arsn-blue/30 bg-arsn-blue/5 text-[11px] font-mono font-semibold tracking-wider text-arsn-blue">
          RÉF. {schema.reference}
        </span>
      )}
      {sections.map((section, i) => (
        <div key={section.titre}>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-arsn-blue mb-1">
            Section {String(i + 1).padStart(2, "0")}
          </p>
          <h4 className="text-lg font-serif mb-3">{section.titre}</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {section.champs.map((champ) => (
              <ValueDisplay key={champ.cle} champ={champ} value={donnees[champ.cle]} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ValueDisplay({ champ, value }: { champ: FormFieldDef; value: unknown }) {
  const vide = value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);

  return (
    <div className={champ.type === "zone" || champ.type === "tableau" ? "sm:col-span-2" : ""}>
      <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mb-1">{champ.label}</p>
      {vide ? (
        <p className="text-sm text-muted-foreground italic">— non renseigné —</p>
      ) : champ.type === "confirmation" ? (
        <p className="text-sm">{value === true ? "✓ Confirmé" : "Non confirmé"}</p>
      ) : champ.type === "cases" && Array.isArray(value) ? (
        <div className="flex flex-wrap gap-1.5">
          {(value as string[]).map((v) => (
            <span key={v} className="px-2 py-0.5 rounded-full bg-secondary text-xs">
              {v}
            </span>
          ))}
        </div>
      ) : champ.type === "tableau" && Array.isArray(value) ? (
        <div className="border border-border rounded-lg overflow-x-auto max-w-full">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-secondary/40">
                {champ.colonnes?.map((col) => (
                  <th key={col.cle} className="text-left font-mono uppercase tracking-wide p-2 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(value as Record<string, string>[]).map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {champ.colonnes?.map((col) => (
                    <td key={col.cle} className="p-2 whitespace-nowrap">
                      {row[col.cle] || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm break-words">{String(value)}</p>
      )}
    </div>
  );
}
