import React, { useState, useMemo, useEffect } from 'react';
import type { Organization } from '../types/database';
import { SearchFilter } from '../components/exhibition/SearchFilter';
import { OrganizationCard } from '../components/exhibition/OrganizationCard';
import { ClassDetailModal } from '../components/exhibition/ClassDetailModal';
import { OpeningIntro } from '../components/intro/OpeningIntro';

/*
  ========================================================================
  Home - なずな祭 百輝夜行 公式ポータル トップページ
  ========================================================================
  
  【公式サイト構造・全画面演出重視の完全再設計】
  - ポスター演出 (OpeningIntro) が fixed 背景として画面最奥に常駐。
  - ファーストビュー (100vh) はポスターの全貌・演出のみを鑑賞するピュアスペース。
  - スクロールすることで、エ霞金彩ラインと高級ガラスモーフをまとった
    出し物索引・企画カード一覧がポスターの上に美しくスライドインする設計。
*/

interface HomeProps {
  organizations: Organization[];
  initialGenre?: string;
  introKey?: number;
  onIntroComplete?: () => void;
  onSelectTab?: (tab: 'timetable' | 'info') => void;
}

export const Home: React.FC<HomeProps> = ({
  organizations,
  initialGenre = 'all',
  introKey = 0,
  onIntroComplete,
  onSelectTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedCard, setSelectedCard] = useState<Organization | null>(null);

  useEffect(() => {
    if (initialGenre) setSelectedGenre(initialGenre);
  }, [initialGenre]);

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      if (!org.is_published) return false;
      if (searchQuery !== '') {
        const q = searchQuery.toLowerCase();
        if (!org.name.toLowerCase().includes(q) &&
            !org.description.toLowerCase().includes(q) &&
            !org.room_code.toLowerCase().includes(q)) return false;
      }
      if (selectedGenre !== 'all' && org.genre !== selectedGenre) return false;
      if (selectedFloor !== 'all' && !org.floor_info.includes(selectedFloor)) return false;
      return true;
    });
  }, [organizations, searchQuery, selectedGenre, selectedFloor]);

  return (
    <>
      {/* ===============================================
          常設背景: シネマティック・ポスター演出 (fixed z-0)
          =============================================== */}
      <OpeningIntro key={introKey} onComplete={onIntroComplete} />

      {/* ===============================================
          スクロールコンテンツ層 (z-10 relative)
          =============================================== */}
      <div className="relative z-10 w-full">
        
        {/* ファーストビュー (100vh): 演出・ポスター鑑賞専用のクリアスペース */}
        <div className="w-full h-screen relative flex flex-col justify-end pb-12 pointer-events-none select-none">
          {/* スクロール誘導インジケーター */}
          <div className="w-full flex flex-col items-center justify-center gap-3 animate-bounce">
            <span className="text-xs font-serif tracking-[0.35em] text-[#F5D061] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] bg-[#050711]/60 px-4 py-1 rounded-full border border-[#F5D061]/40 backdrop-blur-md">
              リアルタイム索引・企画一覧へスクロール
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-[#F5D061]/60 flex items-start justify-center p-1.5 bg-[#050711]/40 backdrop-blur-sm shadow-[0_0_15px_rgba(245,208,97,0.3)]">
              <div className="w-1.5 h-3 bg-gradient-to-b from-[#F5D061] to-[#E51937] rounded-full" />
            </div>
          </div>
        </div>

        {/* 下部コンテンツエリア: ポスターの上へと滑らかに被さる漆黒＆金屏風パネル */}
        <div className="w-full bg-gradient-to-b from-[#080c1f]/95 via-[#050711]/98 to-[#050711] backdrop-blur-2xl border-t-2 border-[#F5D061]/60 shadow-[0_-25px_80px_rgba(0,0,0,0.95)] relative">
          
          {/* 上部接続：エ霞調・和の光の反射 */}
          <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-[#F5D061] to-transparent shadow-[0_0_20px_#F5D061]" />
          <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-[#E51937]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-[#F5D061]/12 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20 relative z-10">
            
            {/* ポータルヘッダーエリア */}
            <div className="space-y-8 max-w-4xl pt-4">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#131a3b]/90 border border-[#F5D061]/50 text-xs text-[#F5D061] font-bold tracking-widest shadow-[0_0_20px_rgba(245,208,97,0.25)]">
                <svg className="w-4 h-4 text-[#F5D061]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="font-serif">2026年度 市川中学校・高等学校 なずな祭 「百輝夜行」 公式ポータル</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-wide leading-tight font-serif drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                極夜を彩る、<br />
                <span className="text-gradient-red-gold">百の魂と赤い和傘。</span>
              </h1>

              <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed max-w-2xl font-sans bg-[#0d132a]/90 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
                市川学園全クラス・部活動・有志団体が手掛ける、一夜限りの幻想エンターテインメント。
                完成版ポスターの世界観そのままに、0msリアルタイム検索・即時在庫状況システムにより、
                見逃すことなく全ての出し物を快適にお楽しみいただけます。
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('exhibition-index');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-wamodern-red text-sm sm:text-base flex items-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  <span>リアルタイム出し物検索へジャンプ</span>
                </button>
                {onSelectTab && (
                  <button
                    onClick={() => onSelectTab('timetable')}
                    className="btn-wamodern-gold text-sm sm:text-base flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>タイムテーブルを見る</span>
                  </button>
                )}
              </div>
            </div>

            {/* リアルタイム索引バー */}
            <div id="exhibition-index" className="scroll-mt-28">
              <SearchFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedGenre={selectedGenre}
                onGenreChange={setSelectedGenre}
                selectedFloor={selectedFloor}
                onFloorChange={setSelectedFloor}
              />
            </div>

            {/* 出展企画一覧 */}
            <div className="space-y-10">
              <div className="section-heading-line">
                <div className="flex items-center gap-3.5">
                  <div className="w-3 h-9 bg-gradient-to-b from-[#E51937] via-[#F5D061] to-[#800010] rounded-sm shadow-[0_0_15px_rgba(229,25,55,0.7)]" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-wider font-serif">
                    出展企画一覧 <span className="text-[#F5D061] text-xl font-mono font-normal ml-2">({filteredOrganizations.length} 件)</span>
                  </h3>
                </div>
              </div>

              {filteredOrganizations.length === 0 ? (
                <div className="wamodern-panel p-16 text-center rounded-3xl space-y-5 border border-[#F5D061]/40 shadow-2xl">
                  <svg className="w-14 h-14 mx-auto text-[#F5D061]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-white font-serif">該当する出し物が見つかりませんでした</p>
                    <p className="text-xs text-[#94A1B2] font-sans">キーワードを変更するか、絞り込み条件をリセットして再度お試しください。</p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGenre('all');
                      setSelectedFloor('all');
                    }}
                    className="btn-wamodern-gold text-xs mt-2"
                  >
                    すべての条件をクリアする
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
          </div>
        </div>
      </div>

      <ClassDetailModal org={selectedCard} onClose={() => setSelectedCard(null)} />
    </>
  );
};
