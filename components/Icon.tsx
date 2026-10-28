// Icônes fléchées en SVG, trait rond, taille et couleur héritées du texte.
const paths = {
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "arrow-up-right": "M7 17 17 7M8 7h9v9",
  "arrow-left": "M19 12H5M11 6l-6 6 6 6",
  "arrow-down": "M12 5v14M6 13l6 6 6-6",
  "chevron-down": "m6 9 6 6 6-6",
};

export default function Icon({
  name,
  size = "1em",
  strokeWidth = 1.75,
}: {
  name: keyof typeof paths;
  size?: number | string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="icon"
    >
      <path d={paths[name]} />
    </svg>
  );
}
