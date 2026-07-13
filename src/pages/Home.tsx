import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, BookOpen, Compass, ChevronRight, MapPin } from 'lucide-react';
import type { Organization } from '../types/database';
import { SearchFilter } from '../components/exhibition/SearchFilter';
import { OrganizationCard } from '../components/exhibition/OrganizationCard';
import { ClassDetailModal } from '../components/exhibition/ClassDetailModal';
import { OpeningIntro } from '../components/intro/OpeningIntro';

/*
  ========================================================================
  Home - なずな祭 百輝夜行 モダン和風ポータル トップページ
  ========================================================================
  
  ファーストビュー（ポスター演出）はダーク背景を維持し、
  スクロール後は生成り色の和紙世界へ切り替わる。
*/

interface HomeProps {
  organizations: Organization[];
  initialGenre?: string;
  introKey?: number;
  isShojiFinished?: boolean;
  onIntroComplete?: () => void;
  onSelectTab?: (tab: 'timetable' | 'info') => void;
}

export const Home: React.FC<HomeProps> = ({
  organizations,
  initialGenre = 'all',
  introKey = 0,
  isShojiFinished = true,
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
          常設背景: ポスター演出 (fixed z-0, ダーク背景維持)
          =============================================== */}
      <OpeningIntro startTrigger={isShojiFinished} key={introKey} onComplete={onIntroComplete} />

      {/* ===============================================
          スクロールコンテンツ層 (z-10 relative)
          =============================================== */}
      <div className="relative z-10 w-full">

        {/* ファーストビュー: ポスター鑑賞空間（スマホは115vh、PCは2画面分） */}
        <div className="w-full h-[115vh] sm:h-screen relative pointer-events-none select-none" />
        <div className="hidden sm:block w-full h-screen relative pointer-events-none select-none" />

        {/* ダーク→ライト切り替えの波線SVG */}
        <div className="relative -mt-1">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0,0 C360,60 720,80 1080,40 C1260,20 1380,0 1440,0 L1440,80 L0,80 Z" fill="#F7F3ED"/>
          </svg>
        </div>

        {/* =========================================================================================
            セクション1: ポータルヒーロー＆主要ページリンク（生成り色の和紙世界）
            ========================================================================================= */}
        <section className="w-full bg-wafuu-kinari relative overflow-hidden py-20 sm:py-28">
          {/* 麻の葉パターン背景 */}
          <div className="absolute inset-0 pattern-asanoha pointer-events-none" />
          
          {/* 上部の朱色＋金茶のアクセントライン */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-wafuu-shu/30 to-transparent" />

          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

            {/* ポータルヘッダー */}
            <div className="space-y-8 max-w-4xl">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-wafuu-ekasumi/40 text-xs sm:text-sm text-wafuu-shu font-bold tracking-widest shadow-sm">
                <svg className="w-4 h-4 text-wafuu-shu shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.5 2 2 6.5 2 12h20c0-5.5-4.5-10-10-10z" />
                  <path d="M12 2v20" />
                </svg>
                <span className="font-serif">2026年度 市川中学校・高等学校 なずな祭 「百輝夜行」</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-wafuu-sumi tracking-wide leading-tight font-serif">
                極夜を彩る、<br />
                <span className="text-gradient-shu-kincha">百の魂と赤い和傘。</span>
              </h1>

              <p className="text-base sm:text-lg text-wafuu-text-sub leading-relaxed max-w-3xl font-serif bg-white/80 p-7 rounded-2xl border border-wafuu-sumi/6 shadow-sm backdrop-blur-sm">
                市川学園全クラス・部活動・有志団体が手掛ける、一夜限りの幻想エンターテインメント「百輝夜行」。
                まずは以下の主要ページリンクより、タイムテーブルや企画概要をご鑑賞いただけます。
              </p>
            </div>

            {/* 主要ページリンクカード */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3 border-l-4 border-wafuu-shu pl-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-wafuu-sumi tracking-wider">
                  主要ページナビゲーション
                </h2>
                <span className="text-xs sm:text-sm text-wafuu-shu font-mono font-bold bg-wafuu-shu/8 px-3 py-1 rounded-full border border-wafuu-shu/20">
                  MAIN PORTAL
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                {/* 1. タイムテーブル */}
                <div
                  onClick={() => onSelectTab && onSelectTab('timetable')}
                  className="group cursor-pointer relative rounded-2xl p-7 sm:p-8 bg-white hover:bg-wafuu-kinari border border-wafuu-sumi/8 hover:border-wafuu-kincha shadow-sm hover:shadow-[0_12px_32px_rgba(30,30,30,0.08)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden min-h-[400px]"
                >
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-wafuu-kincha to-[#B08A2E] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Calendar className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-mono font-bold text-wafuu-kincha uppercase tracking-wider bg-wafuu-kincha/8 px-3 py-1.5 rounded-full border border-wafuu-kincha/20">
                        STAGE SCHEDULE
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-serif font-black text-wafuu-sumi group-hover:text-wafuu-kincha transition-colors tracking-wide leading-snug">
                        ステージ・演目<br />タイムテーブル
                      </h3>
                      <p className="text-sm text-wafuu-text-sub mt-3 leading-relaxed font-serif">
                        第一体育館・中庭ステージ・視聴覚室で開催される全ステージ公演のスケジュール・出演順・演目紹介。
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 relative z-10">
                    <div className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-wafuu-kincha to-[#B08A2E] hover:brightness-105 text-white font-bold font-serif text-sm flex items-center justify-between shadow-md transition-all">
                      <span>タイムテーブル画面へ</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* 2. 学校紹介 */}
                <div
                  onClick={() => onSelectTab && onSelectTab('info')}
                  className="group cursor-pointer relative rounded-2xl p-7 sm:p-8 bg-white hover:bg-wafuu-kinari border border-wafuu-sumi/8 hover:border-wafuu-ai shadow-sm hover:shadow-[0_12px_32px_rgba(30,30,30,0.08)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden min-h-[400px]"
                >
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-wafuu-ai to-[#1E3050] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <BookOpen className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-mono font-bold text-wafuu-ai uppercase tracking-wider bg-wafuu-ai/8 px-3 py-1.5 rounded-full border border-wafuu-ai/20">
                        CONCEPT
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-serif font-black text-wafuu-sumi group-hover:text-wafuu-ai transition-colors tracking-wide leading-snug">
                        学校紹介・<br />コンセプトストーリー
                      </h3>
                      <p className="text-sm text-wafuu-text-sub mt-3 leading-relaxed font-serif">
                        ポスター原画デザイン制作秘話、市川中学校・高等学校「第三教育」の魅力と歴史。
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 relative z-10">
                    <div className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-wafuu-ai to-[#1E3050] hover:brightness-105 text-white font-bold font-serif text-sm flex items-center justify-between shadow-md transition-all">
                      <span>コンセプトページを見る</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* 3. 企画一覧 */}
                <div
                  onClick={() => {
                    const el = document.getElementById('exhibition-index');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group cursor-pointer relative rounded-2xl p-7 sm:p-8 bg-white hover:bg-wafuu-kinari border border-wafuu-sumi/8 hover:border-wafuu-shu shadow-sm hover:shadow-[0_12px_32px_rgba(209,75,65,0.1)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between overflow-hidden min-h-[400px]"
                >
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-wafuu-shu to-wafuu-shu-dark text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Compass className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-mono font-bold text-wafuu-shu uppercase tracking-wider bg-wafuu-shu/8 px-3 py-1.5 rounded-full border border-wafuu-shu/20">
                        EXHIBITION
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-serif font-black text-wafuu-sumi group-hover:text-wafuu-shu transition-colors tracking-wide leading-snug">
                        出し物・展示<br />企画一覧＆在庫状況
                      </h3>
                      <p className="text-sm text-wafuu-text-sub mt-3 leading-relaxed font-serif">
                        全出展クラス・部活動の検索と絞り込み。食品やアトラクションの混雑・在庫状況を即時チェック。
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 relative z-10">
                    <div className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-wafuu-shu to-wafuu-shu-dark hover:brightness-105 text-white font-bold font-serif text-sm flex items-center justify-between shadow-md transition-all">
                      <span>企画索引エリアへ</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================================
            セクション2: タイムテーブルハイライト
            ========================================================================================= */}
        <section className="w-full bg-wafuu-silk border-y border-wafuu-sumi/6 py-16 sm:py-20 relative overflow-hidden">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-wafuu-shu uppercase tracking-widest bg-wafuu-shu/8 px-3 py-1 rounded-full border border-wafuu-shu/20">
                <MapPin className="w-4 h-4 text-wafuu-shu" />
                <span>STAGE HIGHLIGHTS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-wafuu-sumi tracking-wide">
                注目のステージタイムテーブル情報
              </h2>
              <p className="text-sm sm:text-base text-wafuu-text-sub font-serif leading-relaxed">
                第一体育館でのダンス部・吹奏楽部・軽音楽部ライブや、中庭での書道パフォーマンスなど、見逃せないスケジュールをお見逃しなく。
              </p>
            </div>

            {onSelectTab && (
              <button
                onClick={() => onSelectTab('timetable')}
                className="w-full md:w-auto py-4 px-8 rounded-xl bg-gradient-to-r from-wafuu-kincha to-[#B08A2E] hover:brightness-105 text-white font-bold font-serif text-base flex items-center justify-center gap-3 shadow-md transition-all hover:shadow-lg shrink-0"
              >
                <Calendar className="w-5 h-5" />
                <span>タイムテーブル全日程を見る</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </section>

        {/* =========================================================================================
            セクション3: 出し物・展示 企画一覧＆フィルター
            ========================================================================================= */}
        <section id="exhibition-index" className="w-full bg-wafuu-kinari py-20 sm:py-28 relative overflow-hidden scroll-mt-20">
          <div className="absolute inset-0 pattern-asanoha pointer-events-none" />

          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-1.5 h-10 bg-gradient-to-b from-wafuu-shu to-wafuu-kincha rounded-full" />
                <h2 className="text-3xl sm:text-5xl font-serif font-black text-wafuu-sumi tracking-wider">
                  出し物・展示 企画索引 <span className="text-wafuu-shu text-2xl font-mono font-normal ml-3">({filteredOrganizations.length} 件)</span>
                </h2>
              </div>
              <p className="text-sm sm:text-base text-wafuu-text-sub max-w-2xl font-sans pl-5">
                キーワード・ジャンル・階数別で瞬時に絞り込みが行えます。各クラスや団体の詳細をタップしてご覧ください。
              </p>
            </div>

            {/* 検索・フィルター */}
            <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              selectedFloor={selectedFloor}
              onFloorChange={setSelectedFloor}
            />

            {/* カード一覧 */}
            <div className="pt-6">
              {filteredOrganizations.length === 0 ? (
                <div className="wafuu-panel p-16 text-center rounded-2xl space-y-5 border border-wafuu-ekasumi/30 shadow-sm">
                  <svg className="w-16 h-16 mx-auto text-wafuu-ekasumi/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-wafuu-sumi font-serif">該当する出し物が見つかりませんでした</p>
                    <p className="text-sm text-wafuu-text-sub font-sans">キーワードを変更するか、絞り込み条件をリセットして再度お試しください。</p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGenre('all');
                      setSelectedFloor('all');
                    }}
                    className="btn-wafuu-kincha text-sm px-8 py-3.5 mt-3"
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
        </section>
      </div>

      <ClassDetailModal org={selectedCard} onClose={() => setSelectedCard(null)} />
    </>
  );
};
