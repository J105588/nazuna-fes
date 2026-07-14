import React, { useState, useEffect, useRef } from 'react';
import type { Organization, Announcement } from '../types/database';
import type { GuidanceSectionId } from './GuidanceDetailPage';
import type { PolicySectionId } from './PolicyPage';
import { OpeningIntro } from '../components/intro/OpeningIntro';
import { openExternalMap } from '../lib/api';
import { FaqCustomIcon } from '../components/common/FaqCustomIcon';
import { AnnouncementDetailModal } from '../components/common/AnnouncementDetailModal';

/*
  ========================================================================
  Home - なずな祭 「百輝夜行」 モダン和風ポータル 総合トップページ
  ========================================================================
*/

interface HomeProps {
  organizations: Organization[];
  announcements?: Announcement[];
  initialGenre?: string;
  introKey?: number;
  isShojiFinished?: boolean;
  isIntroFinished?: boolean;
  onIntroComplete?: () => void;
  onSelectTab?: (tab: 'home' | 'exhibitions' | 'timetable' | 'map' | 'news' | 'info' | 'lostfound' | 'admin' | 'guidance' | 'policy') => void;
  onNavigateGuidancePage?: (section: GuidanceSectionId) => void;
  onNavigatePolicyPage?: (section: PolicySectionId) => void;
  onNavigateExhibitionsPage?: (query: string, genre: string, floor: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  organizations,
  announcements = [],
  initialGenre = 'all',
  introKey = 0,
  isShojiFinished = true,
  isIntroFinished = true,
  onIntroComplete,
  onSelectTab,
  onNavigateGuidancePage,
  onNavigatePolicyPage,
  onNavigateExhibitionsPage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedFloor] = useState('all');
  const [showScrollGuide, setShowScrollGuide] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (initialGenre) setSelectedGenre(initialGenre);
  }, [initialGenre]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 50) {
        setShowScrollGuide(false);
      } else {
        setShowScrollGuide(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ========================================================================
  // スクロール連動アニメーション用の IntersectionObserver 設定
  // ========================================================================
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const scrollElements = document.querySelectorAll('.scroll-animate');
    scrollElements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [organizations, announcements]);

  return (
    <>
      {/* ===============================================
          スクロールコンテンツ層 (z-10 relative)
          =============================================== */}
      <div className="relative z-10 w-full font-serif">

        {/* ファーストビュー: ポスター鑑賞空間（スマホは100svh、PCは1画面分の完璧な高さ） */}
        <div id="hero-poster" className="w-full h-[100svh] sm:h-screen relative pointer-events-none select-none bg-[#050711] overflow-hidden">
          {/* ポスター＆霧結晶演出（ページと一緒にスクロール＆超軽量化） */}
          <OpeningIntro startTrigger={isShojiFinished} key={introKey} onComplete={onIntroComplete} />

          {/* =========================================================
              オープニング終了後：ヘッダーと同時に出現するスクロール促進アニメーション
              ========================================================= */}
          {isIntroFinished && (
            <div
              className={`absolute bottom-10 sm:bottom-14 left-1/2 -translate-x-1/2 z-30 transition-opacity duration-500 pointer-events-auto ${showScrollGuide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
              <button
                onClick={() => {
                  const target = document.getElementById('exhibitions-search');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                  }
                }}
                className="flex flex-col items-center gap-2 group focus:outline-none animate-scroll-guide-appear"
                title="下にスクロールして企画を見る"
                aria-label="下にスクロールして企画を見る"
              >
                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#EDE8DF] group-hover:text-wafuu-kincha transition-colors drop-shadow-md">
                  SCROLL DOWN
                </span>

                {/* 縦飾りライン＆下向き矢印 */}
                <div className="w-6 h-12 sm:w-7 sm:h-14 rounded-full border border-wafuu-ekasumi/60 bg-wafuu-sumi/40 backdrop-blur-sm flex flex-col items-center justify-start py-2 shadow-lg group-hover:border-wafuu-kincha transition-colors">
                  <div className="w-[2.5px] h-3 bg-gradient-to-b from-wafuu-shu to-wafuu-kincha rounded-full animate-scroll-down-flow" />
                  <svg
                    className="w-3.5 h-3.5 text-[#EDE8DF] mt-auto group-hover:translate-y-0.5 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>
            </div>
          )}

          {/* 画面の下地の半円の弧（ポスター空間と企画検索エリアを優雅に繋ぐウェーブカーブ：オープニング終了時にヘッダーやスクロール案内と同時出現） */}
          {isIntroFinished && (
            <div className="absolute -bottom-[1px] left-0 right-0 w-full z-20 pointer-events-none overflow-hidden animate-arc-appear">
              <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[36px] sm:h-[80px] block" preserveAspectRatio="none">
                <path d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z" fill="#FAF8F5" />
              </svg>
            </div>
          )}
        </div>

        {/* =========================================================================================
            【第2階層】 企画情報エリア（input_file_0.png 準拠：検索バー ＋ 質素な3大アイコン）
            ========================================================================================= */}
        <section id="exhibitions-search" className="w-full bg-[#FAF8F5] relative overflow-hidden py-16 sm:py-24 scroll-mt-20">

          {/* 右上・左下の市松模様コーナー装飾 (input_file_0.png 準拠) */}
          <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 pattern-ichimatsu pointer-events-none opacity-40" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 pattern-ichimatsu pointer-events-none opacity-40" />

          <div className="max-w-6xl w-full mx-auto px-5 sm:px-8 lg:px-10 space-y-16 relative z-10">

            {/* input_file_0.png 準拠：モダンキーワード検索バー */}
            <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-700 ease-out space-y-10">

              {/* 検索バー本体 (`[ Q ] + キーワードを入力`) */}
              <div className="max-w-2xl mx-auto shadow-[0_10px_30px_rgba(44,62,85,0.12)] rounded-lg overflow-hidden flex border-2 border-[#2C3E55] bg-white">
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (onNavigateExhibitionsPage) {
                        onNavigateExhibitionsPage(searchQuery, selectedGenre, selectedFloor);
                      } else if (onSelectTab) {
                        onSelectTab('exhibitions');
                      }
                    }
                  }}
                  placeholder="キーワードを入力して Enter（例：焼きそば、お化け屋敷、ダンス、茶道）..."
                  className="w-full px-5 py-4 sm:py-5 bg-[#FAF8F5] sm:bg-white text-wafuu-sumi placeholder-wafuu-sumi/50 text-base sm:text-lg font-sans outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 flex items-center text-wafuu-sumi/40 hover:text-wafuu-sumi transition-colors"
                    title="検索をクリア"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onNavigateExhibitionsPage) {
                      onNavigateExhibitionsPage(searchQuery, selectedGenre, selectedFloor);
                    } else if (onSelectTab) {
                      onSelectTab('exhibitions');
                    }
                  }}
                  className="px-6 sm:px-8 bg-[#2C3E55] hover:bg-wafuu-shu text-white font-bold text-sm sm:text-base transition-colors shrink-0 flex items-center gap-2"
                >
                  <span>検索</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* -------------------------------------------------------------------------
                input_file_0.png 準拠：質素で美しい3大ナビゲーションアイコン
                （ホバー時：Z軸を中心にして1回転しながら浮き出してくるアニメーション搭載）
            ------------------------------------------------------------------------- */}
            <div id="quick-nav-section" className="scroll-animate opacity-0 translate-y-12 transition-all duration-700 ease-out delay-150 pt-6">
              <div className="grid grid-cols-3 gap-4 sm:gap-12 max-w-3xl mx-auto text-center">

                {/* 1. 企画索引（独立された企画一覧ページへ直結） */}
                <button
                  onClick={() => {
                    if (onNavigateExhibitionsPage) {
                      onNavigateExhibitionsPage(searchQuery, selectedGenre, selectedFloor);
                    } else if (onSelectTab) {
                      onSelectTab('exhibitions');
                    }
                  }}
                  className="group flex flex-col items-center justify-center cursor-pointer p-4 rounded-2xl hover:bg-white/50 transition-all duration-300"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 text-[#2C3E55] group-hover:text-wafuu-shu flex items-center justify-center transition-colors">
                    {/* 企画索引 SVG (input_file_0.png 準拠: リスト＋矢印) */}
                    <svg className="w-16 h-16 sm:w-24 sm:h-24 hover-icon-y-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="16" height="18" rx="2" ry="2" />
                      <line x1="7" y1="8" x2="15" y2="8" />
                      <line x1="7" y1="12" x2="15" y2="12" />
                      <line x1="7" y1="16" x2="11" y2="16" />
                      <circle cx="5.5" cy="8" r="0.5" fill="currentColor" />
                      <circle cx="5.5" cy="12" r="0.5" fill="currentColor" />
                      <circle cx="5.5" cy="16" r="0.5" fill="currentColor" />
                      <path d="M15 15l4 4-1.5 1.5-2.5-2.5V20h-2v-5h2z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-base sm:text-2xl font-bold font-serif text-wafuu-sumi group-hover:text-wafuu-shu transition-colors tracking-widest mt-2 sm:mt-4">
                    企画索引
                  </span>
                </button>

                {/* 2. マップアプリ（直接マップを開く） */}
                <button
                  onClick={() => {
                    if (onSelectTab) {
                      onSelectTab('map');
                    } else {
                      openExternalMap();
                    }
                  }}
                  className="group flex flex-col items-center justify-center cursor-pointer p-4 rounded-2xl hover:bg-white/50 transition-all duration-300"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 text-[#2C3E55] group-hover:text-wafuu-kincha flex items-center justify-center transition-colors">
                    {/* マップアプリ SVG (input_file_0.png 準拠: ピン＋円形台座) */}
                    <svg className="w-16 h-16 sm:w-24 sm:h-24 hover-icon-y-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a6 6 0 0 0-6 6c0 4.5 6 10.5 6 10.5s6-6 6-10.5a6 6 0 0 0-6-6z" />
                      <circle cx="12" cy="8" r="2.5" />
                      <ellipse cx="12" cy="20.5" rx="7" ry="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
                    </svg>
                  </div>
                  <span className="text-base sm:text-2xl font-bold font-serif text-wafuu-sumi group-hover:text-wafuu-kincha transition-colors tracking-widest mt-2 sm:mt-4">
                    マップアプリ
                  </span>
                </button>

                {/* 3. タイムテーブル */}
                <button
                  onClick={() => onSelectTab && onSelectTab('timetable')}
                  className="group flex flex-col items-center justify-center cursor-pointer p-4 rounded-2xl hover:bg-white/50 transition-all duration-300"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 text-[#2C3E55] group-hover:text-wafuu-ai flex items-center justify-center transition-colors">
                    {/* タイムテーブル SVG (input_file_0.png 準拠: 太枠丸時計) */}
                    <svg className="w-16 h-16 sm:w-24 sm:h-24 hover-icon-y-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9.5" />
                      <polyline points="12 6 12 12 16.5 12" />
                    </svg>
                  </div>
                  <span className="text-base sm:text-2xl font-bold font-serif text-wafuu-sumi group-hover:text-wafuu-ai transition-colors tracking-widest mt-2 sm:mt-4">
                    タイムテーブル
                  </span>
                </button>

              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================================
            【第3階層】 テーマ — 簡潔な中央配置（遷移先で詳細）
            ========================================================================================= */}
        <section id="theme-section" className="w-full bg-[#F2ECE1] py-24 sm:py-36 border-y border-wafuu-ekasumi/50 relative overflow-hidden scroll-mt-20">
          {/* 装飾：朱色と藍のぼかしグロウ */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-wafuu-shu/[0.06] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-wafuu-ai/[0.05] rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-4xl w-full mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
            <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-700 ease-out flex flex-col items-center text-center space-y-8">

              {/* 上部ラベル — 水引風の装飾線 */}
              <div className="flex items-center gap-4">
                <span className="w-16 sm:w-24 h-px bg-wafuu-ai/40" />
                <span className="text-sm sm:text-base font-serif font-bold text-wafuu-sumi/70 tracking-[0.3em]">
                  テーマ
                </span>
                <span className="w-16 sm:w-24 h-px bg-wafuu-shu/40" />
              </div>

              {/* テーマ名 */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-wafuu-sumi/50 font-serif tracking-widest">
                  2026年 市川学園 なずな祭
                </p>
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-wafuu-sumi tracking-wider font-serif leading-none">
                  百<span className="text-wafuu-shu">輝</span>夜行
                </h2>
              </div>

              {/* 遷移ボタン */}
              <button
                onClick={() => onSelectTab && onSelectTab('info')}
                className="mt-4 group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-wafuu-sumi text-white hover:bg-wafuu-shu font-bold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg font-serif tracking-wider"
              >
                <span>詳しくはこちら</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>

            </div>
          </div>
        </section>

        {/* =========================================================================================
            【第4階層】 News エリア (`News / リアルタイムお知らせ`) ＋「詳しくはこちら」
            ========================================================================================= */}
        <section id="news-section" className="w-full bg-[#FAF8F5] py-20 sm:py-28 relative overflow-hidden scroll-mt-20">
          <div className="max-w-6xl w-full mx-auto px-5 sm:px-8 lg:px-10 space-y-12 relative z-10">
            <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-700 ease-out flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-wafuu-sumi/15 pb-6">
              <div className="space-y-2">
                <span className="text-xs font-serif font-bold text-wafuu-shu tracking-widest block">最新お知らせ・ご案内</span>
                <h2 className="text-3xl sm:text-4xl font-black text-wafuu-sumi tracking-wider">
                  実行委員会からのお知らせ
                </h2>
              </div>
              <button
                onClick={() => onSelectTab && onSelectTab('news')}
                className="px-6 py-2.5 rounded-xl bg-[#2C3E55] text-white hover:bg-wafuu-shu transition-colors font-bold text-sm flex items-center gap-2 self-start sm:self-center shrink-0 shadow-sm group"
              >
                <span>詳しくはこちら</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>

            {(() => {
              const publishedHomeAnnouncements = (announcements || [])
                .filter((a) => a.is_published)
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 3);

              return (
                <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-700 ease-out delay-150 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {publishedHomeAnnouncements.length === 0 ? (
                    <div className="md:col-span-3 bg-white p-12 text-center rounded-3xl border border-wafuu-ekasumi/70 shadow-sm space-y-3 font-serif">
                      <div className="w-12 h-12 rounded-full bg-wafuu-sumi/5 flex items-center justify-center mx-auto text-wafuu-kincha">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                      </div>
                      <p className="font-bold text-wafuu-sumi text-base sm:text-lg">現在配信中の最新お知らせはありません。</p>
                      <p className="text-xs sm:text-sm text-wafuu-sumi/60 font-sans">実行委員会からの更新・ご案内が届き次第、こちらに掲載されます。</p>
                    </div>
                  ) : (
                    publishedHomeAnnouncements.map((ann) => {
                      let badge = { label: '一般お知らせ', className: 'bg-blue-500/15 text-blue-700 border border-blue-500/30' };
                      if (ann.category === 'urgent') badge = { label: '緊急・重要', className: 'bg-rose-500/15 text-rose-700 border border-rose-500/30 font-bold' };
                      if (ann.category === 'stage') badge = { label: 'ステージ予定', className: 'bg-amber-500/15 text-amber-800 border border-amber-500/30 font-bold' };

                      return (
                        <div
                          key={ann.id}
                          onClick={() => setSelectedAnnouncement(ann)}
                          className="bg-white p-6 sm:p-7 rounded-2xl border border-wafuu-ekasumi/70 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between group"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-xs text-wafuu-text-sub font-mono">
                              <span>{new Date(ann.created_at).toLocaleDateString()}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-serif ${badge.className}`}>
                                {badge.label}
                              </span>
                            </div>
                            <h4 className="font-bold text-lg text-wafuu-sumi leading-snug group-hover:text-wafuu-shu transition-colors line-clamp-2">
                              {ann.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-wafuu-sumi/75 leading-relaxed font-sans line-clamp-3">
                              {ann.content}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-wafuu-ekasumi/50 flex items-center justify-end text-xs font-bold text-wafuu-sumi/70 group-hover:text-wafuu-shu transition-colors gap-1">
                            <span>詳細を見る</span>
                            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })()}
          </div>
        </section>

        {/* =========================================================================================
            【第5階層】 ご案内（input_file_1.png 準拠：筆書き飾り枠 ＋ 8連ダブルリング丸型エンブレム）
            ========================================================================================= */}
        <section id="guidance-section" className="w-full bg-[#FAF8F5] py-20 sm:py-28 border-t border-wafuu-ekasumi/50 relative overflow-hidden scroll-mt-20">
          <div className="max-w-6xl w-full mx-auto px-5 sm:px-8 lg:px-10 space-y-16 relative z-10">

            {/* 筆書き和風飾り枠付きタイトル (`ご案内`) */}
            <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-700 ease-out text-center">
              <div className="brush-title-container my-4">
                {/* 上の二重和風筆書きライン */}
                <svg className="brush-line-top w-full h-3 sm:h-4 text-[#2C3E55]" viewBox="0 0 300 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5,6 C80,4 220,4 295,6" />
                  <path d="M15,2 C100,2 200,2 285,2" strokeWidth="1.2" />
                  <path d="M5,6 C2,8 2,10 5,11 C8,10 8,8 5,6 Z" fill="currentColor" />
                </svg>

                <h2 className="text-4xl sm:text-6xl font-black text-[#2C3E55] tracking-widest py-3 font-serif">
                  ご案内
                </h2>

                {/* 下の二重和風筆書きライン＋朱色のループ結び目 */}
                <svg className="brush-line-bottom w-full h-4 sm:h-5 text-[#2C3E55]" viewBox="0 0 300 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M10,4 C100,4 200,4 290,4" />
                  <path d="M20,9 C110,9 210,9 285,9" stroke="#D14B41" strokeWidth="1.5" />
                  <path d="M285,9 C289,9 292,12 290,14 C288,16 285,13 285,9 Z" stroke="#D14B41" fill="none" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            {/* 亀甲紋様（六角形隣り合わせタイル）グリッド */}
            <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-700 ease-out delay-150 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto pt-8">

              {/* 1. ご来場の際の注意点 */}
              <button
                onClick={() => onNavigateGuidancePage && onNavigateGuidancePage('precautions')}
                className="hexagon-border-box group"
              >
                <div className="hexagon-outer">
                  <div className="hexagon-inner">
                    <div className="hexagon-decor-ring" />
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2C3E55] text-white flex items-center justify-center shrink-0 shadow-md mb-4 group-hover:bg-wafuu-shu transition-colors">
                      {/* 三角警告アイコン (`!`) */}
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 hover-icon-z-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="currentColor" fillOpacity="0.2" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <span className="text-base sm:text-lg lg:text-xl font-black font-serif text-[#2C3E55] group-hover:text-white leading-tight">
                      ご来場の際の<br />注意点
                    </span>
                  </div>
                </div>
              </button>

              {/* 2. アクセス・キャンパスマップ */}
              <button
                onClick={() => onNavigateGuidancePage && onNavigateGuidancePage('campus-map')}
                className="hexagon-border-box group"
              >
                <div className="hexagon-outer">
                  <div className="hexagon-inner">
                    <div className="hexagon-decor-ring" />
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2C3E55] text-white flex items-center justify-center shrink-0 shadow-md mb-4 group-hover:bg-wafuu-shu transition-colors">
                      {/* 足跡・マップアイコン */}
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 hover-icon-z-spin" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 2C4.5 2 3.5 5 4 8c.5 3 2 6 2 8 0 1.5.5 3 2 3s2.5-1.5 2.5-3c0-2-1.5-5-1-8 .5-3-.5-6-3-6zm10 2c-2.5 0-3.5 3-3 6 .5 3-1 6-1 8 0 1.5.5 3 2 3s2.5-1.5 2.5-3c0-2 1.5-5 2-8 .5-3-.5-6-2.5-6z" />
                      </svg>
                    </div>
                    <span className="text-base sm:text-lg lg:text-xl font-black font-serif text-[#2C3E55] group-hover:text-white leading-tight">
                      アクセス・キャン<br />パスマップ
                    </span>
                  </div>
                </div>
              </button>

              {/* 3. 総合案内所（本館2階） */}
              <button
                onClick={() => onNavigateGuidancePage && onNavigateGuidancePage('info-desk')}
                className="hexagon-border-box group"
              >
                <div className="hexagon-outer">
                  <div className="hexagon-inner">
                    <div className="hexagon-decor-ring" />
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2C3E55] text-white flex items-center justify-center shrink-0 shadow-md mb-4 group-hover:bg-wafuu-shu transition-colors">
                      {/* 総合案内所コンパスアイコン */}
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 hover-icon-z-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.3" />
                      </svg>
                    </div>
                    <span className="text-base sm:text-lg lg:text-xl font-black font-serif text-[#2C3E55] group-hover:text-white leading-tight">
                      総合案内所<br />（本館2階窓口）
                    </span>
                  </div>
                </div>
              </button>

              {/* 4. 落とし物掲示板 */}
              <button
                onClick={() => onSelectTab && onSelectTab('lostfound')}
                className="hexagon-border-box group"
              >
                <div className="hexagon-outer">
                  <div className="hexagon-inner">
                    <div className="hexagon-decor-ring" />
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2C3E55] text-white flex items-center justify-center shrink-0 shadow-md mb-4 group-hover:bg-wafuu-shu transition-colors">
                      {/* 検索・情報アイコン */}
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 hover-icon-z-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                    <span className="text-base sm:text-lg lg:text-xl font-black font-serif text-[#2C3E55] group-hover:text-white leading-tight">
                      落とし物<br />掲示板
                    </span>
                  </div>
                </div>
              </button>

              {/* 5. よくあるご質問 (FAQ) */}
              <button
                onClick={() => onNavigateGuidancePage && onNavigateGuidancePage('faq')}
                className="hexagon-border-box group"
              >
                <div className="hexagon-outer">
                  <div className="hexagon-inner">
                    <div className="hexagon-decor-ring" />
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2C3E55] text-white flex items-center justify-center shrink-0 shadow-md mb-4 group-hover:bg-wafuu-shu transition-colors">
                      {/* Q & A 吹き出しアイコン */}
                      <FaqCustomIcon />
                    </div>
                    <span className="text-base sm:text-lg lg:text-xl font-black font-serif text-[#2C3E55] group-hover:text-white leading-tight">
                      よくある<br />ご質問 (FAQ)
                    </span>
                  </div>
                </div>
              </button>

              {/* 6. ごみ分別のお願い */}
              <button
                onClick={() => onNavigateGuidancePage && onNavigateGuidancePage('waste-rules')}
                className="hexagon-border-box group"
              >
                <div className="hexagon-outer">
                  <div className="hexagon-inner">
                    <div className="hexagon-decor-ring" />
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2C3E55] text-white flex items-center justify-center shrink-0 shadow-md mb-4 group-hover:bg-wafuu-shu transition-colors">
                      {/* ごみ箱・リサイクルアイコン */}
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 hover-icon-z-spin" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        <path d="M10 10h1.5v7H10zm2.5 0H14v7h-1.5z" opacity="0.4" />
                      </svg>
                    </div>
                    <span className="text-base sm:text-lg lg:text-xl font-black font-serif text-[#2C3E55] group-hover:text-white leading-tight">
                      ごみ分別の<br />お願い
                    </span>
                  </div>
                </div>
              </button>

            </div>

            {/* 総合ご案内ページおよび規約ページへ飛ぶ大型「詳しくはこちら」ボタン */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={() => onNavigateGuidancePage && onNavigateGuidancePage('precautions')}
                className="px-8 py-4 rounded-2xl bg-[#2C3E55] text-white hover:bg-wafuu-shu transition-all duration-300 font-bold text-sm sm:text-base shadow-md hover:shadow-xl inline-flex items-center gap-2.5 group"
              >
                <span>ご案内総合ガイド詳細を確認（詳しくはこちら）</span>
                <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
              <button
                onClick={() => onNavigatePolicyPage && onNavigatePolicyPage('filming-guidelines')}
                className="px-8 py-4 rounded-2xl bg-white text-[#2C3E55] border-2 border-[#2C3E55] hover:bg-[#2C3E55] hover:text-white transition-all duration-300 font-bold text-sm sm:text-base shadow-sm hover:shadow-md inline-flex items-center gap-2.5 group"
              >
                <span>情報掲載・撮影制限指針を確認（詳しくはこちら）</span>
                <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>

          </div>
        </section>

        {/* =========================================================================================
            【第6階層】 なずな祭とは (`About Nazuna Festival`) ＋「詳しくはこちら」
            ========================================================================================= */}
        <section id="about-nazuna-section" className="w-full bg-[#FAF8F5] py-20 sm:py-28 relative overflow-hidden scroll-mt-20">
          <div className="max-w-6xl w-full mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
            <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-700 ease-out bg-gradient-to-br from-[#F4EFE6] via-white to-[#FAF8F5] p-8 sm:p-14 rounded-3xl border border-wafuu-ekasumi/60 shadow-[0_20px_60px_rgba(30,30,30,0.06)] space-y-8">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wafuu-sumi/10 pb-6">
                <div>
                  <span className="text-xs font-serif font-bold text-wafuu-shu tracking-widest block">第76回なずな祭 テーマコンセプトストーリー</span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-wafuu-sumi tracking-wider mt-1">
                    なずな祭とは
                  </h2>
                </div>
                <button
                  onClick={() => onSelectTab && onSelectTab('info')}
                  className="px-6 py-2.5 rounded-xl bg-[#2C3E55] text-white hover:bg-wafuu-shu font-bold text-sm transition-colors flex items-center gap-2 self-start sm:self-center shrink-0 shadow-sm"
                >
                  <span>テーマ「百輝夜行」について</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-wafuu-sumi/85 leading-relaxed font-serif">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-wafuu-sumi flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-wafuu-shu inline-block" />
                    <span>歴史と伝統：「第三教育」の舞台</span>
                  </h3>
                  <p>
                    市川中学校・市川高等学校の文化祭「なずな祭」は、本校が大切にする教育理念「第三教育（自分で自分を教育する）」が最高潮に発揮される一大行事です。
                    生徒実行委員会を中心に、企画立案、ポスター原画・Web開発、ステージ運営から当日の安全誘導まで、すべてを生徒たちが自立して運営しています。
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-wafuu-sumi flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-wafuu-kincha inline-block" />
                    <span>「なずな」の由来と自律精神</span>
                  </h3>
                  <p>
                    校歌や行事名にも冠される「なずな」は、春の七草のひとつ。踏まれてもたくましく花を咲かせる野草であり、市川学園生の強靭な精神と誠実さを象徴しています。
                    創立89周年を迎える今年度も、その誇りを胸に、ご来場いただくすべての方へ最高の「百輝夜行」をお届けします。
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-wafuu-text-sub font-mono border-t border-wafuu-sumi/10">
                <span>主催：2026年度 なずな祭実行委員会</span>
                <span>場所：千葉県市川市本北方2-38-1 市川学園市川中学校・高等学校</span>
              </div>

            </div>
          </div>
        </section>

      </div>

      {/* 共通詳細モーダル（#news内と同様に開く） */}
      <AnnouncementDetailModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />
    </>
  );
};
