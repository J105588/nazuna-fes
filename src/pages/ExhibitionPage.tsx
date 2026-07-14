import React, { useState, useMemo, useEffect } from 'react';
import type { Organization } from '../types/database';
import { SearchFilter } from '../components/exhibition/SearchFilter';
import { OrganizationCard } from '../components/exhibition/OrganizationCard';
import { ClassDetailModal } from '../components/exhibition/ClassDetailModal';

/*
  ========================================================================
  ExhibitionPage - 出し物・展示 企画一覧 ＆ 検索独立ページ
  ========================================================================
*/

interface ExhibitionPageProps {
  organizations: Organization[];
  initialQuery?: string;
  initialGenre?: string;
  initialFloor?: string;
  onNavigateTab?: (tab: 'home' | 'exhibitions' | 'timetable' | 'map' | 'news' | 'info' | 'lostfound' | 'admin' | 'guidance' | 'policy') => void;
}

export const ExhibitionPage: React.FC<ExhibitionPageProps> = ({
  organizations,
  initialQuery = '',
  initialGenre = 'all',
  initialFloor = 'all',
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedFloor, setSelectedFloor] = useState(initialFloor);
  const [selectedCard, setSelectedCard] = useState<Organization | null>(null);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setSelectedGenre(initialGenre);
  }, [initialGenre]);

  useEffect(() => {
    setSelectedFloor(initialFloor);
  }, [initialFloor]);

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      if (!org.is_published) return false;
      if (searchQuery !== '') {
        const q = searchQuery.toLowerCase();
        if (
          !org.name.toLowerCase().includes(q) &&
          !org.description.toLowerCase().includes(q) &&
          !org.room_code.toLowerCase().includes(q)
        )
          return false;
      }
      if (selectedGenre !== 'all' && org.genre !== selectedGenre) return false;
      if (selectedFloor !== 'all' && !org.floor_info.includes(selectedFloor)) return false;
      return true;
    });
  }, [organizations, searchQuery, selectedGenre, selectedFloor]);

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] py-16 sm:py-24 font-serif relative overflow-hidden">

      {/* 背景の市松模様あしらい */}
      <div className="absolute top-0 right-0 w-48 h-48 pattern-ichimatsu pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 w-48 h-48 pattern-ichimatsu pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12 relative z-10">

        {/* ヘッダー */}
        <div className="text-center space-y-4 border-b border-wafuu-sumi/15 pb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-wafuu-sumi tracking-wider font-serif">
            出し物・展示 企画一覧 ＆ 検索
          </h1>
          <p className="text-sm sm:text-base text-wafuu-sumi/75 max-w-2xl mx-auto leading-relaxed font-sans">
            全クラス・部活動・有志団体が手掛ける出展企画一覧です。キーワード検索、またはジャンル・校舎階層フィルターで絞り込み、クリックで詳細や混雑度・在庫状況を確認できます。
          </p>
        </div>

        {/* 検索バー ＆ フィルター（トップページ検索と直結・同等機能） */}
        <div className="space-y-8 bg-white/90 p-6 sm:p-10 rounded-3xl border border-wafuu-ekasumi/60 shadow-sm font-sans">

          {/* モダンキーワード検索バー (`[ Q ] + キーワードを入力`) */}
          <div className="max-w-3xl mx-auto shadow-[0_10px_30px_rgba(44,62,85,0.12)] rounded-xl overflow-hidden flex border-2 border-[#2C3E55] bg-white">
            <div className="w-14 sm:w-16 bg-[#2C3E55] text-white flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワードを入力 （例：焼きそば、お化け屋敷、ダンス、茶道、書道）..."
              className="w-full px-5 py-4 sm:py-5 bg-transparent text-wafuu-sumi placeholder-wafuu-sumi/50 text-base sm:text-lg font-sans outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 flex items-center text-wafuu-sumi/40 hover:text-wafuu-sumi transition-colors"
                title="検索キーワードをクリア"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* ジャンル・階層フィルター連携 */}
          <div className="pt-2">
            <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              selectedFloor={selectedFloor}
              onFloorChange={setSelectedFloor}
            />
          </div>

        </div>

        {/* 企画カード一覧グリッド表示エリア */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-wafuu-sumi/15 pb-4">
            <h2 className="text-2xl sm:text-3xl font-black text-wafuu-sumi">
              検索結果 ({filteredOrganizations.length}件)
            </h2>
            {(searchQuery || selectedGenre !== 'all' || selectedFloor !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('all');
                  setSelectedFloor('all');
                }}
                className="text-xs font-mono font-bold text-wafuu-shu hover:underline flex items-center gap-1"
              >
                <span>検索・絞り込みをリセット</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {filteredOrganizations.length === 0 ? (
            <div className="bg-white p-16 text-center rounded-3xl border border-wafuu-ekasumi/60 space-y-5 shadow-sm font-sans">
              <div className="w-16 h-16 mx-auto rounded-full bg-wafuu-shu/10 text-wafuu-shu flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black text-wafuu-sumi font-serif">該当する出展企画が見つかりませんでした</p>
                <p className="text-sm text-wafuu-sumi/70">キーワードを変更するか、フィルター条件をリセットして再度お試しください。</p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('all');
                  setSelectedFloor('all');
                }}
                className="px-8 py-3.5 rounded-xl bg-[#2C3E55] text-white font-bold hover:bg-wafuu-shu transition-colors shadow-sm text-sm"
              >
                すべての検索条件をリセット
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredOrganizations.map((org) => (
                <OrganizationCard key={org.id} org={org} onSelectCard={setSelectedCard} />
              ))}
            </div>
          )}
        </div>

        {/* フッターアクション（トップへ戻る） */}
        <div className="pt-8 border-t border-wafuu-sumi/15 flex justify-center">
          <button
            onClick={() => onNavigateTab && onNavigateTab('home')}
            className="px-8 py-4 rounded-2xl bg-[#2C3E55] text-white hover:bg-wafuu-shu transition-colors font-bold text-sm sm:text-base flex items-center gap-2 shadow-md"
          >
            <span>トップページへ戻る</span>
          </button>
        </div>

      </div>

      <ClassDetailModal org={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  );
};
