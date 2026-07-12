import React from 'react';
import { Search, Filter, Layers, X, ChevronDown, Sparkles } from 'lucide-react';

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
    <div className="wamodern-panel p-6 sm:p-8 rounded-3xl mb-12 border border-[rgba(245,208,97,0.35)] relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
      {/* 繊細な和のアクセントグラデーション */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E51937]/15 via-[#F5D061]/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#00D2FF]/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(245,208,97,0.25)] pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#E51937] to-[#800010] border border-[#F5D061]/60 shadow-[0_0_15px_rgba(229,25,55,0.6)]">
              <Sparkles className="w-5 h-5 text-[#F5D061]" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-xl sm:text-2xl text-white tracking-wider">
                出し物・展示 リアルタイム索引
              </h3>
              <span className="text-xs text-[#94A1B2] block mt-0.5 font-sans">
                全クラス・部活動・有志企画を瞬時に絞り込み
              </span>
            </div>
            <span className="ml-2 px-3 py-1 rounded-full bg-[#131a3b] text-[#F5D061] border border-[#F5D061]/40 text-xs font-mono shadow-sm">
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
              className="text-xs text-[#E51937] hover:text-white flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl bg-[#E51937]/15 hover:bg-[#E51937] border border-[#E51937]/40 transition-all shadow-md group font-bold"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>絞り込み条件をリセット</span>
            </button>
          )}
        </div>

        {/* 検索入力＆セレクトバー */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-[#F5D061] absolute left-4.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="クラス名、出し物名、場所、キーワードで検索..."
              className="w-full bg-[#050711]/90 text-white placeholder-[#94A1B2]/60 text-sm sm:text-base pl-12 pr-11 py-4 rounded-2xl border border-[rgba(245,208,97,0.25)] focus:outline-none focus:border-[#F5D061] focus:ring-2 focus:ring-[#F5D061]/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                title="検索キーワードを消去"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-3 relative">
            <Filter className="w-4.5 h-4.5 text-[#E51937] absolute left-4.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedGenre}
              onChange={(e) => onGenreChange(e.target.value)}
              className="w-full bg-[#050711]/90 text-white text-sm sm:text-base pl-12 pr-10 py-4 rounded-2xl border border-[rgba(245,208,97,0.25)] focus:outline-none focus:border-[#E51937] focus:ring-2 focus:ring-[#E51937]/20 transition-all appearance-none cursor-pointer shadow-inner font-semibold"
            >
              {genres.map((g) => (
                <option key={g.value} value={g.value} className="bg-[#050711] text-white">
                  {g.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4.5 h-4.5 text-[#F5D061] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="md:col-span-3 relative">
            <Layers className="w-4.5 h-4.5 text-[#00D2FF] absolute left-4.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedFloor}
              onChange={(e) => onFloorChange(e.target.value)}
              className="w-full bg-[#050711]/90 text-white text-sm sm:text-base pl-12 pr-10 py-4 rounded-2xl border border-[rgba(245,208,97,0.25)] focus:outline-none focus:border-[#00D2FF] focus:ring-2 focus:ring-[#00D2FF]/20 transition-all appearance-none cursor-pointer shadow-inner font-semibold"
            >
              {floors.map((f) => (
                <option key={f.value} value={f.value} className="bg-[#050711] text-white">
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4.5 h-4.5 text-[#F5D061] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* クイックタグ */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {genres.map((g) => {
            const isActive = selectedGenre === g.value;
            return (
              <button
                key={g.value}
                onClick={() => onGenreChange(g.value)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E51937] via-[#A30E24] to-[#800010] text-white border border-[#F5D061]/80 shadow-[0_4px_18px_rgba(229,25,55,0.6)] scale-105'
                    : 'bg-[#0a0e22]/90 text-[#94A1B2] hover:text-white border border-white/10 hover:border-[#F5D061]/50'
                }`}
              >
                {isActive && <span className="w-2 h-2 rounded-full bg-[#F5D061] animate-pulse" />}
                <span>{g.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
