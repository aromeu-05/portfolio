// Blocs utilisables dans les fichiers MDX des études de cas (déclarés dans mdx-components.tsx).

export function Chapter({
  id,
  title,
  label,
  decision,
  children,
}: {
  id: string;
  title: string;
  label?: string; // petit label mono au-dessus du titre
  decision?: string; // étiquette pastel « Décision 01 »
  children: React.ReactNode;
}) {
  return (
    <div className="ch" id={`ch-${id}`}>
      {decision ? (
        <span className="eyebrow-num">
          <span className="chip pc">{decision}</span>
        </span>
      ) : (
        label && <span className="mono">{label}</span>
      )}
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// La question de design, mise en avant avec un filet pastel à gauche.
export const Question = ({ children }: { children: React.ReactNode }) => <p className="qd">{children}</p>;

// « Ce que je retiens », en grande phrase.
export function Learn({ label = "Ce que je retiens", children }: { label?: string; children: React.ReactNode }) {
  return (
    <>
      <span className="mono">{label}</span>
      <p className="learn">{children}</p>
    </>
  );
}

// Trois chiffres en grand.
export function Stats({ items }: { items: [value: string, label: string][] }) {
  return (
    <div className="stats">
      {items.map(([v, l]) => (
        <div key={l}>
          <strong>{v}</strong>
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}

// Liste à pastilles de couleur (statuts IA).
export function StatusList({ items }: { items: [status: "ok" | "warn" | "ko", label: string, text: string][] }) {
  return (
    <ul className="dotl">
      {items.map(([s, label, text]) => (
        <li key={label}>
          <i style={{ background: `var(--${s})` }} />
          <span>
            <b>{label}</b> {text}
          </span>
        </li>
      ))}
    </ul>
  );
}

// Tableau chronologique (Date · Étape · Ce qui a changé).
export function Timeline({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="tl-wrap">
      <table className="tl">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.join("|")}>
              {r.map((c, i) => (
                <td key={i}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Deux images côte à côte (avant / après).
export const BeforeAfter = ({ children }: { children: React.ReactNode }) => <div className="ba">{children}</div>;

// Deux écrans mobiles côte à côte, chacun à 320 px maximum.
export const Phones = ({ children }: { children: React.ReactNode }) => <div className="phones">{children}</div>;

// Frise de versions (4 images).
export const Frise = ({ children }: { children: React.ReactNode }) => <div className="frise">{children}</div>;

// Cadre en pointillés quand une capture manque : dit quel écran mettre.
export function Todo({ label = "Visuel à venir", children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="todo">
      <span className="mono">{label}</span>
      <p>{children}</p>
    </div>
  );
}
