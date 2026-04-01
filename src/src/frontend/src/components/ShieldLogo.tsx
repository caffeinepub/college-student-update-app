export default function ShieldLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Academia shield logo"
    >
      <title>Academia shield logo</title>
      <path
        d="M18 2L4 8v12c0 8.837 6.268 17.084 14 19.5C25.732 37.084 32 28.837 32 20V8L18 2z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M18 2L4 8v12c0 8.837 6.268 17.084 14 19.5C25.732 37.084 32 28.837 32 20V8L18 2z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <text
        x="18"
        y="24"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="currentColor"
        fontFamily="sans-serif"
      >
        A
      </text>
    </svg>
  );
}
