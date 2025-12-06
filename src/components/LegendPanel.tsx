import type { FC } from 'react';
import type { SelectedViewpoint } from '../types/map';

interface LegendPanelProps {
    theme?: 'dark' | 'light';
    selectedViewpoints: SelectedViewpoint[];
}

const GRADIENTS: Record<string, string> = {
    // colormap_1.txt（オレンジ）
    tokyoTower: `
    linear-gradient(
      to top,
      rgb(255,245,235) 0%,
      rgb(254,231,207) 8%,
      rgb(253,210,165) 18%,
      rgb(253,178,113) 30%,
      rgb(253,146,67) 40%,
      rgb(243,112,27) 55%,
      rgb(223,80,5)   75%,
      rgb(177,58,3)   100%
    )
  `.trim(),

    // colormap_2.txt（赤）
    skytree: `
    linear-gradient(
      to top,
      rgb(255,245,240) 0%,
      rgb(252,190,165) 20%,
      rgb(251,112,80)  40%,
      rgb(211,32,32)   70%,
      rgb(103,0,13)    100%
    )
  `.trim(),

    // colormap_3.txt（紫）
    docomo: `
    linear-gradient(
      to top,
      rgb(252,251,253) 0%,
      rgb(220,219,236) 20%,
      rgb(163,159,203) 40%,
      rgb(106,81,163)  70%,
      rgb(63,0,125)    100%
    )
  `.trim(),

    // colormap_4.txt（青）
    tocho: `
    linear-gradient(
      to top,
      rgb(247,251,255) 0%,
      rgb(200,220,240) 20%,
      rgb(115,178,216) 40%,
      rgb(41,121,185)  70%,
      rgb(8,48,107)    100%
    )
  `.trim(),

    // colormap_5.txt（緑）
    park: `
    linear-gradient(
      to top,
      rgb(247,252,245) 0%,
      rgb(201,234,194) 20%,
      rgb(123,199,124) 40%,
      rgb(42,146,75)   70%,
      rgb(0,68,27)     100%
    )
  `.trim(),
};

// Default gradient if nothing is selected or unknown
const DEFAULT_GRADIENT = 'linear-gradient(to top, #eee, #333)';

const LegendPanel: FC<LegendPanelProps> = ({ theme = 'dark', selectedViewpoints }) => {
    const isDark = theme === 'dark';

    // Use the first selected viewpoint to determine the gradient
    // If multiple are selected, priority is based on the array order (which usually matches selection order)
    const activeViewpoint = selectedViewpoints.length > 0 ? selectedViewpoints[0] : null;
    const gradient = activeViewpoint ? GRADIENTS[activeViewpoint] || DEFAULT_GRADIENT : DEFAULT_GRADIENT;

    // Don't show if nothing is selected? Or show default? 
    // Requirement implies it should always be visible or at least when a layer is active.
    // Let's show it always, using default if empty, or maybe hide it?
    // "各地点の viewshed（可視領域）はこれらの色で区別されて表示されます" implies it's tied to the layer.
    // If no layer is selected, maybe hide it?
    // Let's keep it visible but maybe neutral if nothing selected, or just hide.
    // For now, if nothing selected, we can hide it or show a placeholder.
    // Let's hide it if no viewpoint is selected to avoid confusion.
    if (selectedViewpoints.length === 0) return null;

    return (
        <div
            className={`absolute top-1/2 -translate-y-1/2 right-3 z-10 
                flex flex-col items-center justify-center gap-1
                w-8 h-auto py-2 px-1 rounded-full overflow-visible shadow-sm
                backdrop-blur-[2px] border
                ${isDark
                    ? 'bg-black/10 border-white/5 text-white'
                    : 'bg-white/15 border-black/5 text-gray-900'
                }
            `}
        >
            {/* Score Label */}
            <div className="text-[7px] font-medium opacity-60 mb-0.5">Score</div>

            {/* Max Label */}
            <div className="text-[7px] font-medium opacity-50">1</div>

            {/* Gradient Bar with reduced opacity */}
            <div
                className="w-2 h-64 rounded-full opacity-60"
                style={{ background: gradient }}
            />

            {/* Min Label */}
            <div className="text-[7px] font-medium opacity-50">0</div>
        </div>
    );
};

export default LegendPanel;
