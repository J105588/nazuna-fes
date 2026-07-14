import React from 'react';
import { Lock } from 'lucide-react';
import type { PyramidTierLevel } from '../../types/database';

interface OfficialPyramidGraphicProps {
  tier: PyramidTierLevel;
  tierLabel?: string;
  releaseTitle?: string;
  isEmbargoed?: boolean;
  embargoMessage?: string;
  showDetails?: boolean;
}

export const OfficialPyramidGraphic: React.FC<OfficialPyramidGraphicProps> = ({
  tier,
  releaseTitle = '最新開示データ',
  isEmbargoed = false,
  embargoMessage
}) => {
  const isHigh = tier === 'high';
  const isUpper = tier === 'upper';
  const isMiddle = tier === 'middle';
  const isLocked = isEmbargoed || tier === 'embargoed';

  if (isLocked) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-wafuu-kinari border-2 border-wafuu-shu shadow-sm text-center space-y-4 font-serif">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wafuu-shu/10 border border-wafuu-shu text-wafuu-shu text-xs font-bold tracking-widest uppercase">
          <Lock className="w-4 h-4 text-wafuu-shu" />
          <span>集計ロック中</span>
        </div>

        {/* 封印されたシンプルピラミッド */}
        <div className="relative w-full max-w-[260px] mx-auto py-2 opacity-80">
          <svg viewBox="0 0 300 220" className="w-full h-auto">
            <defs>
              <linearGradient id="sealedGradSimple" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D14B41" />
                <stop offset="100%" stopColor="#1E1E1E" />
              </linearGradient>
            </defs>
            <polygon points="150,15 280,210 20,210" fill="url(#sealedGradSimple)" stroke="#D14B41" strokeWidth="2.5" strokeDasharray="6,6" />
            <text x="150" y="125" textAnchor="middle" fill="#FFFFFF" fontSize="26" fontWeight="bold" fontFamily="serif">封 印</text>
            <text x="150" y="155" textAnchor="middle" fill="#EDE8DF" fontSize="13" fontFamily="sans-serif">最終結果開示まで非公開</text>
          </svg>
        </div>

        <p className="text-xs sm:text-sm text-wafuu-sumi font-bold leading-relaxed bg-white p-3.5 rounded-2xl border border-wafuu-shu/30 shadow-inner">
          {embargoMessage || '現在、最終審査および結果開示前の集計ロック期間中です。閉会式での公式発表をお待ちください。'}
        </p>
      </div>
    );
  }

  return (
    <div className="wafuu-panel p-5 sm:p-6 rounded-3xl border border-wafuu-sumi/10 shadow-sm font-serif relative overflow-hidden bg-white">
      {/* ヘッダー */}
      <div className="flex items-center justify-between border-b border-wafuu-sumi/10 pb-3 mb-4">
        <span className="text-sm font-bold text-wafuu-sumi tracking-wider">
          なずな大賞 ピラミッド評価 【{releaseTitle}】
        </span>
        <span className="text-xs text-wafuu-kincha font-mono font-bold px-3 py-1 rounded-full bg-wafuu-kincha/10 border border-wafuu-kincha/30">
          1日2回 自動更新
        </span>
      </div>

      {/* 幾何学ピラミッド SVG */}
      <div className="relative w-full max-w-[420px] mx-auto py-2 select-none">
        <svg viewBox="0 0 380 240" className="w-full h-auto overflow-visible">
          <defs>
            {/* 色塗り用：高（頂点層）金茶グラデーション */}
            <linearGradient id="fillHigh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6CF8B" />
              <stop offset="50%" stopColor="#C9A83E" />
              <stop offset="100%" stopColor="#967926" />
            </linearGradient>

            {/* 色塗り用：上（上層）朱赤・緋色グラデーション */}
            <linearGradient id="fillUpper" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E86E65" />
              <stop offset="50%" stopColor="#D14B41" />
              <stop offset="100%" stopColor="#9A332C" />
            </linearGradient>

            {/* 色塗り用：中（中核層）藍鉄紺グラデーション */}
            <linearGradient id="fillMiddle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#415582" />
              <stop offset="50%" stopColor="#2B3A5C" />
              <stop offset="100%" stopColor="#1B253D" />
            </linearGradient>

            {/* 未選択階層用シルエット */}
            <linearGradient id="fillInactive" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EDE8DF" />
              <stop offset="100%" stopColor="#E2DCD2" />
            </linearGradient>

            {/* シャドウ */}
            <filter id="glowHigh" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#C9A83E" floodOpacity="0.6" />
            </filter>
            <filter id="glowUpper" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#D14B41" floodOpacity="0.6" />
            </filter>
            <filter id="glowMiddle" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#2B3A5C" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* ピラミッド背後シャドウ */}
          <polygon points="130,15 240,225 20,225" fill="rgba(30,30,30,0.08)" transform="translate(0, 4)" />

          {/* 第1層：【 高 】 */}
          <polygon
            points="130,15 165.1,82 94.9,82"
            fill={isHigh ? "url(#fillHigh)" : "url(#fillInactive)"}
            stroke={isHigh ? "#FFFFFF" : "#C4A265"}
            strokeWidth={isHigh ? "3" : "1"}
            strokeOpacity={isHigh ? 1 : 0.5}
            filter={isHigh ? "url(#glowHigh)" : undefined}
            className="transition-all duration-500"
          />

          {isHigh && (
            <g className="animate-fade-in">
              <line x1="172" y1="48.5" x2="215" y2="48.5" stroke="#C9A83E" strokeWidth="3" strokeDasharray="4,2" />
              <polygon points="172,48.5 186,40 186,57" fill="#C9A83E" filter="url(#glowHigh)" />
              <text x="200" y="55" fill="#1E1E1E" fontSize="18" fontWeight="900" fontFamily="serif">◀</text>
            </g>
          )}

          {/* 第2層：【 上 】 */}
          <polygon
            points="92.8,86 167.2,86 202.3,153 57.7,153"
            fill={isUpper ? "url(#fillUpper)" : "url(#fillInactive)"}
            stroke={isUpper ? "#FFFFFF" : "#C4A265"}
            strokeWidth={isUpper ? "3" : "1"}
            strokeOpacity={isUpper ? 1 : 0.5}
            filter={isUpper ? "url(#glowUpper)" : undefined}
            className="transition-all duration-500"
          />


          {isUpper && (
            <g className="animate-fade-in">
              <polygon points="208,119.5 222,111 222,128" fill="#D14B41" filter="url(#glowUpper)" />
              <text x="236" y="126" fill="#1E1E1E" fontSize="19" fontWeight="900" fontFamily="serif">◀</text>
            </g>
          )}

          {/* 第3層：【 中 】 */}
          <polygon
            points="55.6,157 204.4,157 240,225 20,225"
            fill={isMiddle ? "url(#fillMiddle)" : "url(#fillInactive)"}
            stroke={isMiddle ? "#FFFFFF" : "#C4A265"}
            strokeWidth={isMiddle ? "3" : "1"}
            strokeOpacity={isMiddle ? 1 : 0.5}
            filter={isMiddle ? "url(#glowMiddle)" : undefined}
            className="transition-all duration-500"
          />

          {isMiddle && (
            <g className="animate-fade-in">
              <polygon points="245,191 259,182.5 259,199.5" fill="#2B3A5C" filter="url(#glowMiddle)" />
              <text x="272" y="198" fill="#1E1E1E" fontSize="20" fontWeight="900" fontFamily="serif">◀</text>
            </g>
          )}
        </svg>
      </div>

      <p className="text-[11px] text-wafuu-text-muted text-center font-sans mt-2 pt-2 border-t border-wafuu-sumi/10">
        ※ なずな祭の投票情報は個別の得票数を秘匿し、該当階層の色塗りと矢印でのみ開示されます。
      </p>
    </div>
  );
};
