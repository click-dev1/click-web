/**
 * The intelligence loop, drawn: three data sources converge into one trunk,
 * pass through the Audience Mapping capability, and feed a six-step cycle
 * around the Audience Intelligence hub — with performance flowing back in.
 *
 * Geometry lives in the SVG; every word lives in HTML positioned over it,
 * so labels set in the brand faces at readable sizes and stay real,
 * selectable text. Both layers read from the same constants below so a
 * dot and its label can never drift apart.
 *
 * Progressive enhancement, same contract as the rest of the page: this
 * markup IS the finished diagram. On desktop with motion allowed, Fx.tsx
 * hides the pieces (via the data-diag* hooks) and draws them back in, in
 * step with the four scroll beats beside it. Everywhere else — mobile,
 * reduced motion, no JS — it renders complete.
 *
 * Only ever one instance on the page: the SVG gradient carries a fixed id.
 */

/* viewBox */
const W = 440;
const H = 600;

/* hub + ring */
const CX = 220;
const CY = 410;
const R = 132; // ring
const HUB_R = 56;

/* trunk */
const SRC_Y = 52; // where the source curves leave their labels
const JOIN_Y = 122; // where the three curves meet
const PILL_Y = 178; // Audience Mapping pill centre
const PILL_H = 32;

const SOURCES = [
  { x: 70, category: "Creators", name: "Sideqik" },
  { x: 220, category: "Livestream", name: "Stream Hatchet" },
  { x: 370, category: "YouTube", name: "TubeBuddy" },
];

/* Six steps, clockwise from the top. `side` is where the label hangs. */
const NODES = [
  { n: "01", title: "Understand", angle: 0, side: "top" },
  { n: "02", title: "Discover", angle: 60, side: "right" },
  { n: "03", title: "Create", angle: 120, side: "right" },
  { n: "04", title: "Activate", angle: 180, side: "bottom" },
  { n: "05", title: "Measure", angle: 240, side: "left" },
  { n: "06", title: "Optimize", angle: 300, side: "left" },
] as const;

const rad = (deg: number) => (deg * Math.PI) / 180;
const nodeXY = (angle: number) => ({
  x: CX + R * Math.sin(rad(angle)),
  y: CY - R * Math.cos(rad(angle)),
});
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const fmt = (v: number) => v.toFixed(1);

/* arc from node i to node i+1, clockwise */
const arcPath = (i: number) => {
  const a = nodeXY(NODES[i].angle);
  const b = nodeXY(NODES[(i + 1) % NODES.length].angle);
  return `M${fmt(a.x)} ${fmt(a.y)} A${R} ${R} 0 0 1 ${fmt(b.x)} ${fmt(b.y)}`;
};

/* dashed return: from Measure back to the hub's edge */
const RETURN_PATH = (() => {
  const from = nodeXY(240);
  const dx = from.x - CX;
  const dy = from.y - CY;
  const len = Math.hypot(dx, dy);
  const to = { x: CX + (dx / len) * HUB_R, y: CY + (dy / len) * HUB_R };
  const ctrl = { x: (from.x + to.x) / 2 - 10, y: (from.y + to.y) / 2 + 12 };
  return `M${fmt(from.x)} ${fmt(from.y)} Q${fmt(ctrl.x)} ${fmt(ctrl.y)} ${fmt(to.x)} ${fmt(to.y)}`;
})();

/* label anchoring per side: offset from the dot + transform */
const LABEL_GAP = 14;
function labelStyle(
  side: (typeof NODES)[number]["side"],
  x: number,
  y: number,
) {
  switch (side) {
    case "top":
      return {
        left: pct(x, W),
        top: pct(y - LABEL_GAP, H),
        transform: "translate(-50%, -100%)",
        textAlign: "center" as const,
      };
    case "bottom":
      return {
        left: pct(x, W),
        top: pct(y + LABEL_GAP, H),
        transform: "translate(-50%, 0)",
        textAlign: "center" as const,
      };
    case "right":
      return {
        left: pct(x + LABEL_GAP, W),
        top: pct(y, H),
        transform: "translate(0, -50%)",
        textAlign: "left" as const,
      };
    case "left":
      return {
        right: pct(W - (x - LABEL_GAP), W),
        top: pct(y, H),
        transform: "translate(0, -50%)",
        textAlign: "right" as const,
      };
  }
}

export default function IntelligenceDiagram() {
  return (
    <div
      data-diagram
      className="intel-diagram relative"
      style={{ aspectRatio: `${W} / ${H}` }}
      role="img"
      aria-label="Diagram: Sideqik, Stream Hatchet and TubeBuddy signals converge into CLICK's Audience Mapping capability, which feeds a six-step cycle around Audience Intelligence — Understand, Discover, Create, Activate, Measure, Optimize — with performance flowing back into the intelligence."
    >
      {/* ---------- geometry ---------- */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id="intel-hub-glow">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="0.6" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          {/* DrawSVG rewrites stroke-dasharray, which would erase the
              return line's dashes — so the drawing happens on this solid
              mask stroke and the dashed path underneath just shows through. */}
          <mask id="intel-return-mask" maskUnits="userSpaceOnUse">
            <path
              data-diag="return-mask"
              d={RETURN_PATH}
              stroke="#fff"
              strokeWidth="8"
            />
          </mask>
        </defs>

        {/* sources → one trunk */}
        <g data-diag="src" strokeWidth="1.25" opacity="0.7">
          <path
            d={`M${SOURCES[0].x} ${SRC_Y} C${SOURCES[0].x} ${SRC_Y + 62}, ${CX} ${JOIN_Y - 40}, ${CX} ${JOIN_Y}`}
          />
          <path d={`M${CX} ${SRC_Y} V${JOIN_Y}`} />
          <path
            d={`M${SOURCES[2].x} ${SRC_Y} C${SOURCES[2].x} ${SRC_Y + 62}, ${CX} ${JOIN_Y - 40}, ${CX} ${JOIN_Y}`}
          />
        </g>
        <path
          data-diag="trunk"
          d={`M${CX} ${JOIN_Y} V${PILL_Y - PILL_H / 2}`}
          strokeWidth="1.25"
          opacity="0.7"
        />
        <path
          data-diag="trunk2"
          d={`M${CX} ${PILL_Y + PILL_H / 2} V${CY - R - 46}`}
          strokeWidth="1.25"
          opacity="0.7"
        />

        {/* hub */}
        <g data-diag="hub">
          <circle
            cx={CX}
            cy={CY}
            r={HUB_R * 1.75}
            fill="url(#intel-hub-glow)"
            stroke="none"
          />
          <circle
            cx={CX}
            cy={CY}
            r={HUB_R}
            fill="var(--card)"
            stroke="var(--hairline)"
            strokeWidth="1"
          />
        </g>

        {/* the ring: a faint track, then six arcs that draw in */}
        <circle
          data-diag="track"
          cx={CX}
          cy={CY}
          r={R}
          strokeWidth="1"
          opacity="0.18"
        />
        {NODES.map((_, i) => (
          <path
            key={i}
            data-diag-arc={i + 1}
            d={arcPath(i)}
            strokeWidth="1.5"
            opacity="0.85"
          />
        ))}

        {/* performance returns */}
        <path
          data-diag="return"
          d={RETURN_PATH}
          strokeWidth="1.25"
          strokeDasharray="4 6"
          opacity="0.75"
          mask="url(#intel-return-mask)"
        />

        {/* nodes */}
        {NODES.map((node, i) => {
          const { x, y } = nodeXY(node.angle);
          return (
            <g key={node.n} data-diag-node={i + 1}>
              <circle cx={x} cy={y} r="9" fill="var(--bg)" stroke="none" />
              <circle cx={x} cy={y} r="4.5" fill="currentColor" stroke="none" />
            </g>
          );
        })}
      </svg>

      {/* ---------- words ---------- */}

      {SOURCES.map((s, i) => (
        <div
          key={s.name}
          data-diag-src-label={i + 1}
          className="diag-source"
          style={{ left: pct(s.x, W), top: 0 }}
        >
          <span className="diag-eyebrow">{s.category}</span>
          <span className="font-display diag-name">{s.name}</span>
        </div>
      ))}

      <span
        data-diag="converge"
        className="diag-eyebrow diag-converge"
        style={{
          left: pct(CX + 12, W),
          top: pct((JOIN_Y + PILL_Y - PILL_H / 2) / 2, H),
        }}
      >
        Signals converge
      </span>

      <span
        data-diag="pill"
        className="pill diag-pill"
        style={{ left: pct(CX, W), top: pct(PILL_Y, H) }}
      >
        <span className="tick" aria-hidden="true">
          ●
        </span>
        Audience Mapping
        <span className="diag-pill-sub">CLICK capability</span>
      </span>

      <div
        data-diag="hub-label"
        className="diag-hub"
        style={{ left: pct(CX, W), top: pct(CY, H) }}
      >
        <span className="diag-eyebrow">Click</span>
        <span className="font-display diag-hub-title">
          Audience
          <br />
          Intelligence
        </span>
        <span className="diag-eyebrow">Every decision draws on it</span>
      </div>

      {NODES.map((node, i) => {
        const { x, y } = nodeXY(node.angle);
        return (
          <div
            key={node.n}
            data-diag-label={i + 1}
            className="diag-node"
            style={labelStyle(node.side, x, y)}
          >
            <span className="diag-num">{node.n}</span>
            <span className="font-display diag-title">{node.title}</span>
          </div>
        );
      })}

      <span
        data-diag="return-label"
        className="diag-eyebrow diag-return"
        style={{ left: pct(CX, W), top: pct(CY + HUB_R + 38, H) }}
      >
        Performance returns
      </span>
    </div>
  );
}
