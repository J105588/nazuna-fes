import React from 'react';
import { Search, Filter, Layers, X, ChevronDown } from 'lucide-react';

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
    { label: 'Nステ会場 (中庭・屋台エリア)', value: 'Nステ会場' },
    { label: '古賀記念アリーナ', value: '古賀記念アリーナ' },
    { label: '國枝記念国際ホール', value: '國枝記念国際ホール' },
    { label: '東館・書道室/文化部エリア', value: '東館2F' },
    { label: '理科棟3F 物理/科学', value: '理科棟3F' }
  ];

  const hasActiveFilters = searchQuery !== '' || selectedGenre !== 'all' || selectedFloor !== 'all';

  return (
    <div className="wafuu-panel p-6 sm:p-8 rounded-2xl mb-12 border border-wafuu-sumi/8 relative overflow-hidden shadow-sm">
      <div className="relative z-10 space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wafuu-sumi/6 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-wafuu-shu to-wafuu-shu-dark text-white shadow-sm">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-xl sm:text-2xl text-wafuu-sumi tracking-wider">
                出し物・展示 企画検索
              </h3>
              <span className="text-xs text-wafuu-text-muted block mt-0.5 font-sans">
                全クラス・部活動・有志企画を絞り込み
              </span>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                onSearchChange('');
                onGenreChange('all');
                onFloorChange('all');
              }}
              className="text-xs text-wafuu-shu hover:text-white flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl bg-wafuu-shu/8 hover:bg-wafuu-shu border border-wafuu-shu/20 transition-all group font-bold"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>条件をリセット</span>
            </button>
          )}
        </div>

        {/* 検索入力＆セレクト */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-wafuu-shu absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="クラス名、出し物名、場所、キーワードで検索..."
              className="w-full bg-wafuu-kinari text-wafuu-sumi placeholder-wafuu-text-muted/60 text-base pl-12 pr-11 py-4 rounded-xl border border-wafuu-sumi/10 focus:outline-none focus:border-wafuu-shu focus:ring-2 focus:ring-wafuu-shu/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-wafuu-text-muted hover:text-wafuu-sumi p-1 rounded-full hover:bg-wafuu-sumi/5 transition-colors"
                title="検索キーワードを消去"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-3 relative">
            <Filter className="w-4 h-4 text-wafuu-shu absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedGenre}
              onChange={(e) => onGenreChange(e.target.value)}
              className="w-full bg-wafuu-kinari text-wafuu-sumi text-base pl-11 pr-10 py-4 rounded-xl border border-wafuu-sumi/10 focus:outline-none focus:border-wafuu-shu focus:ring-2 focus:ring-wafuu-shu/10 transition-all appearance-none cursor-pointer font-semibold"
            >
              {genres.map((g) => (
                <option key={g.value} value={g.value} className="bg-white text-wafuu-sumi">
                  {g.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-wafuu-ekasumi absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="md:col-span-3 relative font-serif">
            <Layers className="w-4 h-4 text-wafuu-kincha absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedFloor}
              onChange={(e) => onFloorChange(e.target.value)}
              className="w-full bg-wafuu-kinari text-wafuu-sumi text-base pl-11 pr-10 py-4 rounded-xl border border-wafuu-sumi/10 focus:outline-none focus:border-wafuu-kincha focus:ring-2 focus:ring-wafuu-kincha/10 transition-all appearance-none cursor-pointer font-semibold"
            >
              {floors.map((f) => (
                <option key={f.value} value={f.value} className="bg-white text-wafuu-sumi">
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-wafuu-ekasumi absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isActive
                    ? 'bg-wafuu-shu text-white border border-wafuu-shu shadow-sm'
                    : 'bg-white text-wafuu-text-sub hover:text-wafuu-sumi border border-wafuu-sumi/8 hover:border-wafuu-ekasumi/60'
                  }`}
              >
                {isActive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                <span>{g.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
