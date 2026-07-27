import { Download } from "lucide-react";
import { toast } from "sonner";
import type { DocMeta } from "@/lib/documents";
import { formatSize } from "@/lib/documents";

type Props = {
  doc: DocMeta;
  children?: React.ReactNode;
  className?: string;
  variant?: "link" | "solid" | "ghost";
  showSize?: boolean;
};

export function DownloadButton({
  doc,
  children,
  className,
  variant = "link",
  showSize = false,
}: Props) {
  const base =
    "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors";
  const styles: Record<string, string> = {
    link: "text-arsn-blue hover:underline",
    solid:
      "px-5 py-3 bg-arsn-blue text-white hover:bg-arsn-blue/90 rounded-sm normal-case tracking-normal text-sm",
    ghost:
      "text-arsn-yellow hover:underline",
  };
  return (
    <a
      href={doc.url}
      download={doc.filename}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        toast.success("Téléchargement lancé", {
          description: `${doc.label} · ${formatSize(doc.size)}`,
        })
      }
      className={`${base} ${styles[variant]} ${className ?? ""}`.trim()}
    >
      <Download className="w-3.5 h-3.5" />
      {children ?? "Télécharger"}
      {showSize && (
        <span className="text-[10px] font-mono opacity-70">
          PDF · {formatSize(doc.size)}
        </span>
      )}
    </a>
  );
}
