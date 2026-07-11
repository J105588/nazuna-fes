import React from 'react';
import { Search, Filter, Layers, X } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedFloor: string;
  onFloorChange: (floor: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedFloor,
  onFloorChange
}) => {
  const genres = [
    { label: 'すべてのジャンル', value: 'all' },
    { label: '食品・カフェ屋台', value: 'food' },
    { label: 'アトラクション・遊技', value: 'attraction' },
    { label: '展示・学術・アート', value: 'exhibition' },
    { label: 'ステージ・パフォーマンス', value: 'stage' }
  ];

  const floors = [
    { label: 'すべての場所・フロア', value: 'all' },
    { label: '本館3F (クラス企画)', value: '本館3F' },
    { label: '中庭 屋台スペース', value: '中庭' },
    { label: '第一体育館 メインステージ', value: '第一体育館' },
    { label: '東館・書道室/文化部エリア', value: '東館2F' },
    { label: '理科棟3F 物理/科学', value: '理科棟3F' }
  ];

  const hasActiveFilters = searchQuery !== '' || selectedGenre !== 'all' || selectedFloor !== 'all';

  return (
    <div className="wamodern-panel p-6 sm:p-8 rounded-2xl mb-12 border border-[rgba(245,208,97,0.25)] relative overflow-hidden">
      {/* 繊細な和のアクセントグラデーション */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#E51937]/10 via-[#F5D061]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
          <div className="flex items-center gap-2.5">
            <Filter className="w-5 h-5 text-[#F5D061]" />
            <h3 className="font-bold text-lg text-white tracking-wider">
              出し物・展示リアルタイム検索
            </h3>
            <span className="px-2.5 py-0.5 rounded bg-[#131a3b] text-[#00D2FF] border border-[#00D2FF]/30 text-[11px] font-mono">
              0ms Filtering
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                onSearchChange('');
                onGenreChange('all');
                onFloorChange('all');
              }}
              className="text-xs text-[#E51937] hover:text-white flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-[#E51937]/10 border border-[#E51937]/30 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>条件をクリア</span>
            </button>
          )}
        </div>

        {/* 検索入力＆セレクトバー */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#94A1B2] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="クラス名、出し物名、またはキーワードで検索..."
              className="w-full bg-[#050711]/90 text-white placeholder-[#94A1B2]/50 text-sm pl-11 pr-10 py-3.5 rounded-xl border border-[rgba(255,255,255,0.12)] focus:outline-none focus:border-[#F5D061] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-3 relative">
            <Filter className="w-4 h-4 text-[#94A1B2] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedGenre}
              onChange={(e) => onGenreChange(e.target.value)}
              className="w-full bg-[#050711]/90 text-white text-sm pl-11 pr-8 py-3.5 rounded-xl border border-[rgba(255,255,255,0.12)] focus:outline-none focus:border-[#E51937] transition-all appearance-none cursor-pointer"
            >
              {genres.map((g) => (
                <option key={g.value} value={g.value} className="bg-[#050711] text-white">
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 relative">
            <Layers className="w-4 h-4 text-[#94A1B2] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedFloor}
              onChange={(e) => onFloorChange(e.target.value)}
              className="w-full bg-[#050711]/90 text-white text-sm pl-11 pr-8 py-3.5 rounded-xl border border-[rgba(255,255,255,0.12)] focus:outline-none focus:border-[#00D2FF] transition-all appearance-none cursor-pointer"
            >
              {floors.map((f) => (
                <option key={f.value} value={f.value} className="bg-[#050711] text-white">
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* クイックタグ */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {genres.map((g) => {
            const isActive = selectedGenre === g.value;
            return (
              <button
                key={g.value}
                onClick={() => onGenreChange(g.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E51937] to-[#800010] text-white border border-[#E51937] shadow-[0_4px_15px_rgba(229,25,55,0.4)]'
                    : 'bg-[#0a0e22] text-[#94A1B2] hover:text-white border border-[rgba(255,255,255,0.08)]'
                }`}
              >
                <span>{g.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
