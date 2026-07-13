import React, { useEffect } from 'react';
import { Calendar, BookOpen, Compass, MapPin, Layers, ChevronRight, Play, ExternalLink, Search, ShieldAlert } from 'lucide-react';

/*
  ========================================================================
  BurgerMenu - 全画面ポータルメニュー（モダン和風）
  ========================================================================
  
  生成り色背景＋麻の葉パターンの全画面メニュー。
  縦書きサイトタイトル「百輝夜行」をアクセントに配置。
*/

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: 'home' | 'timetable' | 'info' | 'lostfound' | 'admin';
  onSelectTab: (tab: 'home' | 'timetable' | 'info' | 'lostfound' | 'admin') => void;
  onSelectGenreQuick?: (genre: string) => void;
  onSelectStageQuick?: (stage: string) => void;
  onReplayIntro?: () => void;
  onOpenMapModal?: () => void;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onSelectGenreQuick,
  onSelectStageQuick,
  onReplayIntro,
  onOpenMapModal
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleTabClick = (tab: 'home' | 'timetable' | 'info' | 'lostfound' | 'admin') => {
    onSelectTab(tab);
    onClose();
  };

  const handleGenreClick = (genre: string) => {
    onSelectTab('home');
    if (onSelectGenreQuick) onSelectGenreQuick(genre);
    onClose();
  };

  const handleStageClick = (stage: string) => {
    onSelectTab('timetable');
    if (onSelectStageQuick) onSelectStageQuick(stage);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isOpen
          ? 'opacity-100 pointer-events-auto backdrop-blur-sm bg-[#F7F3ED]/97'
          : 'opacity-0 pointer-events-none backdrop-blur-none bg-[#F7F3ED]/0'
      }`}
    >
      {/* 背景: 麻の葉パターン */}
      <div className="absolute inset-0 pattern-asanoha pointer-events-none" />
      {/* 上部の朱色ライン */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-wafuu-shu/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-wafuu-ekasumi/40 to-transparent pointer-events-none" />

      {/* メインコンテンツ */}
      <div
        className={`relative w-full max-w-7xl mx-auto px-5 sm:px-10 py-10 sm:py-20 min-h-full flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-[0.96] translate-y-6 opacity-0'
        }`}
      >
        {/* ヘッダー: サイトタイトル（縦書きアクセント） */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-wafuu-sumi/10 mb-8 sm:mb-10 pr-16 sm:pr-24">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-wafuu-shu via-wafuu-shu-dark to-[#8B1A1E] border border-wafuu-ekasumi/60 shadow-[0_4px_20px_rgba(209,75,65,0.3)] flex items-center justify-center shrink-0">
              {/* 和傘SVGアイコン */}
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12h20c0-5.5-4.5-10-10-10z" />
                <path d="M12 2v20" />
                <path d="M12 12c-2.8 0-5.2-1.5-7-4" />
                <path d="M12 12c2.8 0 5.2-1.5 7-4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-full bg-wafuu-shu/10 border border-wafuu-shu/30 text-xs text-wafuu-shu font-bold tracking-widest uppercase">
                  2026 OFFICIAL
                </span>
                <span className="text-xs text-wafuu-text-muted tracking-wider font-sans">
                  市川中学校・高等学校
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-wafuu-sumi tracking-widest font-serif">
                百輝夜行 <span className="text-2xl sm:text-4xl text-wafuu-shu font-normal">総合案内</span>
              </h1>
            </div>
          </div>
          <div className="text-left sm:text-right text-sm text-wafuu-text-sub font-sans tracking-wide space-y-1">
            <p className="font-bold text-wafuu-sumi tracking-wider">なずな祭 2026 公式総合ウェブポータル</p>
            <p className="text-xs text-wafuu-shu">すべての展示・屋台・ステージ公演のリアルタイム情報</p>
          </div>
        </div>

        {/* ナビゲーショングリッド */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 my-auto">
          
          {/* 左側: 主要ページナビ */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-wafuu-shu" />
              <span className="text-sm font-black text-wafuu-shu tracking-widest uppercase font-serif">
                主要ページ一覧
              </span>
            </div>

            {/* ホーム */}
            <button
              onClick={() => handleTabClick('home')}
              className={`w-full p-6 sm:p-7 rounded-2xl text-left flex items-center justify-between transition-all duration-300 group border ${
                currentTab === 'home'
                  ? 'bg-wafuu-shu/10 border-wafuu-shu shadow-[0_4px_20px_rgba(209,75,65,0.15)] scale-[1.01]'
                  : 'bg-white hover:bg-wafuu-kinari border-wafuu-sumi/8 hover:border-wafuu-ekasumi/60'
              }`}
            >
              <div className="flex items-center gap-5 min-w-0 flex-1">
                <div className={`p-4 rounded-xl transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                  currentTab === 'home'
                    ? 'bg-wafuu-shu text-white shadow-[0_4px_15px_rgba(209,75,65,0.4)]'
                    : 'bg-wafuu-kinari text-wafuu-shu border border-wafuu-sumi/8'
                }`}>
                  <Compass className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-lg sm:text-xl font-serif font-bold block tracking-wider text-wafuu-sumi group-hover:text-wafuu-shu transition-colors">
                    出し物・展示 企画一覧＆検索トップ
                  </span>
                  <span className="text-xs sm:text-sm text-wafuu-text-muted font-sans block mt-1 font-medium">
                    全クラス・部活動・有志団体の出展企画ガイド / リアルタイム在庫
                  </span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0 ml-4 ${
                currentTab === 'home' ? 'bg-wafuu-shu text-white' : 'bg-wafuu-kinari text-wafuu-sumi group-hover:bg-wafuu-shu group-hover:text-white'
              }`}>
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </button>

            {/* タイムテーブル */}
            <button
              onClick={() => handleTabClick('timetable')}
              className={`w-full p-6 sm:p-7 rounded-2xl text-left flex items-center justify-between transition-all duration-300 group border ${
                currentTab === 'timetable'
                  ? 'bg-wafuu-kincha/10 border-wafuu-kincha shadow-[0_4px_20px_rgba(201,168,62,0.15)] scale-[1.01]'
                  : 'bg-white hover:bg-wafuu-kinari border-wafuu-sumi/8 hover:border-wafuu-ekasumi/60'
              }`}
            >
              <div className="flex items-center gap-5 min-w-0 flex-1">
                <div className={`p-4 rounded-xl transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                  currentTab === 'timetable'
                    ? 'bg-wafuu-kincha text-white shadow-[0_4px_15px_rgba(201,168,62,0.4)]'
                    : 'bg-wafuu-kinari text-wafuu-kincha border border-wafuu-sumi/8'
                }`}>
                  <Calendar className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-lg sm:text-xl font-serif font-bold block tracking-wider text-wafuu-sumi group-hover:text-wafuu-kincha transition-colors">
                    ステージ・演目 タイムテーブル
                  </span>
                  <span className="text-xs sm:text-sm text-wafuu-text-muted font-sans block mt-1 font-medium">
                    第一体育館・中庭ステージ・視聴覚室の全スケジュール
                  </span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0 ml-4 ${
                currentTab === 'timetable' ? 'bg-wafuu-kincha text-white' : 'bg-wafuu-kinari text-wafuu-sumi group-hover:bg-wafuu-kincha group-hover:text-white'
              }`}>
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </button>

            {/* 学校紹介 */}
            <button
              onClick={() => handleTabClick('info')}
              className={`w-full p-6 sm:p-7 rounded-2xl text-left flex items-center justify-between transition-all duration-300 group border ${
                currentTab === 'info'
                  ? 'bg-wafuu-ai/10 border-wafuu-ai shadow-[0_4px_20px_rgba(43,58,92,0.15)] scale-[1.01]'
                  : 'bg-white hover:bg-wafuu-kinari border-wafuu-sumi/8 hover:border-wafuu-ekasumi/60'
              }`}
            >
              <div className="flex items-center gap-5 min-w-0 flex-1">
                <div className={`p-4 rounded-xl transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                  currentTab === 'info'
                    ? 'bg-wafuu-ai text-white shadow-[0_4px_15px_rgba(43,58,92,0.4)]'
                    : 'bg-wafuu-kinari text-wafuu-ai border border-wafuu-sumi/8'
                }`}>
                  <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-lg sm:text-xl font-serif font-bold block tracking-wider text-wafuu-sumi group-hover:text-wafuu-ai transition-colors">
                    学校紹介・「百輝夜行」テーマ概要
                  </span>
                  <span className="text-xs sm:text-sm text-wafuu-text-muted font-sans block mt-1 font-medium">
                    ポスタービジュアル解説・市川中学校・高等学校の歴史と魅力
                  </span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0 ml-4 ${
                currentTab === 'info' ? 'bg-wafuu-ai text-white' : 'bg-wafuu-kinari text-wafuu-sumi group-hover:bg-wafuu-ai group-hover:text-white'
              }`}>
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </button>

            {/* 落とし物 */}
            <button
              onClick={() => handleTabClick('lostfound')}
              className={`w-full p-6 sm:p-7 rounded-2xl text-left flex items-center justify-between transition-all duration-300 group border ${
                currentTab === 'lostfound'
                  ? 'bg-wafuu-ekasumi/10 border-wafuu-ekasumi shadow-[0_4px_20px_rgba(196,162,101,0.15)] scale-[1.01]'
                  : 'bg-white hover:bg-wafuu-kinari border-wafuu-sumi/8 hover:border-wafuu-ekasumi/60'
              }`}
            >
              <div className="flex items-center gap-5 min-w-0 flex-1">
                <div className={`p-4 rounded-xl transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                  currentTab === 'lostfound'
                    ? 'bg-wafuu-ekasumi text-white shadow-[0_4px_15px_rgba(196,162,101,0.4)]'
                    : 'bg-wafuu-kinari text-wafuu-ekasumi border border-wafuu-sumi/8'
                }`}>
                  <Search className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-lg sm:text-xl font-serif font-bold block tracking-wider text-wafuu-sumi group-hover:text-wafuu-ekasumi transition-colors">
                    落とし物・お忘れ物 総合掲示板
                  </span>
                  <span className="text-xs sm:text-sm text-wafuu-text-muted font-sans block mt-1 font-medium">
                    会場内で拾得されたお忘れ物情報のリアルタイム確認
                  </span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0 ml-4 ${
                currentTab === 'lostfound' ? 'bg-wafuu-ekasumi text-white' : 'bg-wafuu-kinari text-wafuu-sumi group-hover:bg-wafuu-ekasumi group-hover:text-white'
              }`}>
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </button>

            {/* 管理者 */}
            <button
              onClick={() => handleTabClick('admin')}
              className={`w-full p-6 sm:p-7 rounded-2xl text-left flex items-center justify-between transition-all duration-300 group border ${
                currentTab === 'admin'
                  ? 'bg-wafuu-sumi/5 border-wafuu-sumi/30 shadow-[0_4px_20px_rgba(30,30,30,0.1)] scale-[1.01]'
                  : 'bg-white hover:bg-wafuu-kinari border-wafuu-sumi/8 hover:border-wafuu-sumi/20'
              }`}
            >
              <div className="flex items-center gap-5 min-w-0 flex-1">
                <div className={`p-4 rounded-xl transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                  currentTab === 'admin'
                    ? 'bg-wafuu-sumi text-white shadow-[0_4px_15px_rgba(30,30,30,0.3)]'
                    : 'bg-wafuu-kinari text-wafuu-text-muted border border-wafuu-sumi/8'
                }`}>
                  <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-lg sm:text-xl font-serif font-bold block tracking-wider text-wafuu-sumi group-hover:text-wafuu-text-sub transition-colors">
                    関係者専用 管理者ページ
                  </span>
                  <span className="text-xs sm:text-sm text-wafuu-text-muted font-sans block mt-1 font-medium">
                    実行委員会・教職員・当日シフト用ダッシュボード
                  </span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0 ml-4 ${
                currentTab === 'admin' ? 'bg-wafuu-sumi text-white' : 'bg-wafuu-kinari text-wafuu-sumi group-hover:bg-wafuu-sumi group-hover:text-white'
              }`}>
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </button>
          </div>

          {/* 右側: クイックアクセス＆特別機能 */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            
            {/* ジャンル別クイックアクセス */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-wafuu-kincha" />
                <span className="text-sm font-black text-wafuu-kincha tracking-widest uppercase font-serif">
                  ジャンル別 クイックアクセス
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '食品・カフェ屋台', genre: 'food' },
                  { label: 'アトラクション・遊技', genre: 'attraction' },
                  { label: '展示・学術・アート', genre: 'exhibition' },
                  { label: 'ステージ・公演', genre: 'stage' },
                ].map(({ label, genre }) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreClick(genre)}
                    className="p-4 rounded-xl bg-white hover:bg-wafuu-kinari border border-wafuu-sumi/8 hover:border-wafuu-ekasumi text-sm font-bold text-left text-wafuu-sumi flex items-center justify-between group transition-all hover:shadow-md"
                  >
                    <span>{label}</span>
                    <ChevronRight className="w-4 h-4 text-wafuu-ekasumi group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* ステージ会場別 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-wafuu-shu" />
                <span className="text-sm font-black text-wafuu-shu tracking-widest uppercase font-serif">
                  会場別 ステージスケジュール
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '第一体育館', stage: 'gym' },
                  { label: '中庭ステージ', stage: 'courtyard' },
                  { label: '視聴覚室', stage: 'av_room' },
                ].map(({ label, stage }) => (
                  <button
                    key={stage}
                    onClick={() => handleStageClick(stage)}
                    className="p-3.5 rounded-xl bg-white hover:bg-wafuu-kinari border border-wafuu-sumi/8 hover:border-wafuu-shu/40 text-xs sm:text-sm font-bold text-center text-wafuu-sumi transition-all hover:shadow-md"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 特別機能 */}
            <div className="space-y-4 pt-4 border-t border-wafuu-sumi/8">
              {onReplayIntro && (
                <button
                  onClick={() => {
                    onReplayIntro();
                    onClose();
                  }}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-wafuu-shu to-wafuu-shu-dark hover:from-[#E05A50] hover:to-[#B8403A] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 border border-wafuu-ekasumi/40 shadow-[0_4px_16px_rgba(209,75,65,0.25)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(209,75,65,0.35)] group"
                >
                  <div className="p-2 rounded-full bg-white/20 group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                  <span className="tracking-wider font-serif">
                    オープニング演出を再視聴
                  </span>
                </button>
              )}

              <div className="p-4 rounded-xl bg-white border border-wafuu-sumi/8 flex items-center justify-between text-xs sm:text-sm text-wafuu-text-sub">
                <span className="font-medium">キャンパスマップ・アクセス情報</span>
                {onOpenMapModal ? (
                  <button
                    onClick={() => {
                      onOpenMapModal();
                      onClose();
                    }}
                    className="text-wafuu-shu hover:text-wafuu-shu-dark flex items-center gap-1.5 font-bold transition-colors"
                  >
                    <span>校内マップ</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                ) : (
                  <a
                    href="https://map.nazuna.jp/campus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-wafuu-shu hover:text-wafuu-shu-dark flex items-center gap-1.5 font-bold transition-colors"
                  >
                    <span>マップを開く</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="pt-8 border-t border-wafuu-sumi/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-wafuu-text-muted font-sans mt-10">
          <p>&copy; 2026 NAZUNA FESTIVAL EXECUTIVE COMMITTEE. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>第81回 なずな祭 実行委員会</span>
            <span>市川中学校・高等学校</span>
          </div>
        </div>
      </div>
    </div>
  );
};
