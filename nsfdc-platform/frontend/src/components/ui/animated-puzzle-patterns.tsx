'use client';

import React, { useEffect, useRef, useCallback } from 'react';

/**
 * AnimatedPuzzlePatterns — v4 (Swap Engine)
 *
 * JS-driven animation where tiles GENUINELY exchange grid positions.
 * CSS transitions handle the smooth movement.
 *
 * Animation logic:
 * 1. Define "chains" through each cluster (rows, columns)
 * 2. Walk through each chain, swapping adjacent tile pairs one at a time
 * 3. Each swap is staggered by ~500ms → creates cascading domino effect
 * 4. After forward pass, reverse pass returns tiles → seamless loop
 * 5. Different clusters animate at different times
 */

const CELL = 56;

// ── Interlocking SVG patterns (lines extend to edges → connected look) ──
const PATHS = [
  // Cross-hatch lattice
  `M0 28H56M28 0V56M4 4L52 52M52 4L4 52`,
  // Angular brackets connecting edges
  `M0 14H20V0M36 56V42H56M0 42H16V56M40 0V14H56M20 28H36`,
  // Frame with edge bridges
  `M10 10H46V46H10ZM0 28H10M46 28H56M28 0V10M28 46V56`,
  // Diamond tessellation
  `M28 0L56 28L28 56L0 28ZM14 14H42M14 42H42`,
  // Maze fragment
  `M0 0H28V22H56M0 56V32H24V56M32 0V56M56 32H32`,
  // Woven cross
  `M0 18H18V0M38 56V38H56M0 38H18V56M38 0V18H56M18 18L38 38M38 18L18 38`,
];

// ── Cluster definitions ──
interface ClusterDef {
  id: string;
  corner: 'tl' | 'bl' | 'br';
  cols: number;
  rows: number;
}

const CLUSTERS: ClusterDef[] = [
  { id: 'tl', corner: 'tl', cols: 5, rows: 5 },
  { id: 'bl', corner: 'bl', cols: 4, rows: 4 },
  { id: 'br', corner: 'br', cols: 6, rows: 5 },
];

// Corner CSS
function cornerStyle(corner: string, cols: number, rows: number): React.CSSProperties {
  const w = cols * CELL;
  const h = rows * CELL;
  const base: React.CSSProperties = { position: 'absolute', width: w, height: h };

  switch (corner) {
    case 'tl':
      return { ...base, top: 0, left: 0,
        maskImage: 'radial-gradient(ellipse at 0% 0%, black 25%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 0% 0%, black 25%, transparent 75%)' };
    case 'bl':
      return { ...base, bottom: 0, left: 0,
        maskImage: 'radial-gradient(ellipse at 0% 100%, black 20%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 0% 100%, black 20%, transparent 70%)' };
    case 'br':
      return { ...base, bottom: 0, right: 0,
        maskImage: 'radial-gradient(ellipse at 100% 100%, black 22%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 100% 100%, black 22%, transparent 72%)' };
    default:
      return base;
  }
}

// Seeded PRNG
function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ── Build the swap schedule ──
// Each entry is a pair of tile IDs to swap, or null for a pause.
type SwapOp = { a: string; b: string } | null;

function buildSchedule(): SwapOp[] {
  const schedule: SwapOp[] = [];

  for (const cluster of CLUSTERS) {
    // Horizontal chains (each row)
    for (let r = 0; r < cluster.rows; r++) {
      // Forward: swap (0,r)↔(1,r), then (1,r)↔(2,r), etc.
      for (let c = 0; c < cluster.cols - 1; c++) {
        schedule.push({
          a: `${cluster.id}-${c}-${r}`,
          b: `${cluster.id}-${c + 1}-${r}`,
        });
      }
      schedule.push(null); // brief pause after chain

      // Reverse: swap back in reverse order
      for (let c = cluster.cols - 2; c >= 0; c--) {
        schedule.push({
          a: `${cluster.id}-${c}-${r}`,
          b: `${cluster.id}-${c + 1}-${r}`,
        });
      }
      schedule.push(null, null); // pause between chains
    }

    // Vertical chains (every other column)
    for (let c = 0; c < cluster.cols; c += 2) {
      for (let r = 0; r < cluster.rows - 1; r++) {
        schedule.push({
          a: `${cluster.id}-${c}-${r}`,
          b: `${cluster.id}-${c}-${r + 1}`,
        });
      }
      schedule.push(null);
      for (let r = cluster.rows - 2; r >= 0; r--) {
        schedule.push({
          a: `${cluster.id}-${c}-${r}`,
          b: `${cluster.id}-${c}-${r + 1}`,
        });
      }
      schedule.push(null, null, null); // longer pause between clusters
    }
  }

  return schedule;
}

export function AnimatedPuzzlePatterns() {
  // Track each tile's CURRENT grid position
  const positions = useRef<Map<string, { col: number; row: number }>>(new Map());
  // Track each tile's DOM element
  const elements = useRef<Map<string, HTMLDivElement>>(new Map());
  // Pre-built swap schedule
  const schedule = useRef<SwapOp[]>(buildSchedule());

  // Ref callback to register tile elements
  const registerTile = useCallback((id: string, col: number, row: number) => {
    return (el: HTMLDivElement | null) => {
      if (el) {
        elements.current.set(id, el);
        if (!positions.current.has(id)) {
          positions.current.set(id, { col, row });
        }
      }
    };
  }, []);

  // ── Swap engine ──
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let step = 0;
    const ops = schedule.current;

    const interval = setInterval(() => {
      const op = ops[step % ops.length];
      step++;

      if (!op) return; // pause step

      const posA = positions.current.get(op.a);
      const posB = positions.current.get(op.b);
      const elA = elements.current.get(op.a);
      const elB = elements.current.get(op.b);

      if (!posA || !posB || !elA || !elB) return;

      // Swap their tracked positions
      const tmpCol = posA.col;
      const tmpRow = posA.row;
      posA.col = posB.col;
      posA.row = posB.row;
      posB.col = tmpCol;
      posB.row = tmpRow;

      // Move DOM elements (CSS transition handles the smooth animation)
      elA.style.transform = `translate(${posA.col * CELL}px, ${posA.row * CELL}px)`;
      elB.style.transform = `translate(${posB.col * CELL}px, ${posB.row * CELL}px)`;
    }, 450); // One swap every 450ms → cascading domino effect

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {CLUSTERS.map((cluster) => {
        const rand = rng(cluster.id.charCodeAt(0) * 997 + cluster.id.charCodeAt(1));
        const tiles: React.ReactNode[] = [];

        for (let r = 0; r < cluster.rows; r++) {
          for (let c = 0; c < cluster.cols; c++) {
            const id = `${cluster.id}-${c}-${r}`;
            const pathIdx = Math.floor(rand() * PATHS.length);
            const opacity = 0.4 + rand() * 0.3;

            tiles.push(
              <div
                key={id}
                ref={registerTile(id, c, r)}
                style={{
                  position: 'absolute',
                  width: CELL,
                  height: CELL,
                  transform: `translate(${c * CELL}px, ${r * CELL}px)`,
                  transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity,
                  willChange: 'transform',
                }}
              >
                <svg
                  viewBox={`0 0 ${CELL} ${CELL}`}
                  width={CELL}
                  height={CELL}
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d={PATHS[pathIdx]}
                    stroke="rgba(120, 210, 200, 0.22)"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            );
          }
        }

        return (
          <div key={cluster.id} style={cornerStyle(cluster.corner, cluster.cols, cluster.rows)}>
            {tiles}
          </div>
        );
      })}
    </div>
  );
}
