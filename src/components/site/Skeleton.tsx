/** Bloc de base animé (effet shimmer). */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`arsn-skeleton rounded ${className}`} />;
}

/** Squelette d'une liste de lignes (dossiers, utilisateurs, types…). */
export function SkeletonRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 flex-1 max-w-[200px]" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

/** Squelette d'un panneau de détail (formulaire / dossier). */
export function SkeletonPanel() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
