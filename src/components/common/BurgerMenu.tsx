import React from 'react';

/*
  ========================================================================
  BurgerMenu - なずな祭 百輝夜行 総合案内ドロワーメニュー
  ========================================================================
  
  【全画面遷移・機能の完全集約】
  画面上部のヘッダーバーを撤廃したため、本メニュー内に
  - メインナビゲーション (出し物索引、タイムテーブル、学校概要)
  - ジャンル別クイックジャンプ
  - ステージ別クイックジャンプ
  - オープニング演出再視聴ボタン
  のすべてを集約。極上の和紙・漆・金屏風調のグラデーションデザインで構築。
*/

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: 'home' | 'timetable' | 'info';
  onSelectTab: (tab: 'home' | 'timetable' | 'info') => void;
  onSelectGenreQuick?: (genre: string) => void;
  onSelectStageQuick?: (stage: string) => void;
  onReplayIntro?: () => void;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onSelectGenreQuick,
  onSelectStageQuick,
  onReplayIntro
}) => {
  if (!isOpen) return null;

  const handleTabClick = (tab: 'home' | 'timetable' | 'info') => {
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
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in select-none">
      {/* オーバーレイ背景 (ポスターの深い極夜ネイビー) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#050711]/85 backdrop-blur-md transition-opacity"
      />

      {/* ドロワー本体 (金彩と緋色のアクセントが美しい高級パネル) */}
      <div className="relative w-full max-w-lg bg-[#080c1f] border-l-2 border-[#F5D061]/50 shadow-[0_0_100px_rgba(0,0,0,0.95)] h-full overflow-y-auto flex flex-col justify-between p-6 sm:p-10 z-10">
        
        {/* 上部ヘッダー */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-[rgba(245,208,97,0.3)] pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E51937] to-[#800010] flex items-center justify-center border border-[#F5D061]/60 shadow-[0_0_20px_rgba(229,25,55,0.6)]">
                <svg className="w-6 h-6 text-[#F5D061]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <span className="text-xs text-[#F5D061] tracking-widest block font-serif">
                  2026年度 なずな祭 公式総合メニュー
                </span>
                <h2 className="text-2xl font-bold text-white tracking-wider font-serif">
                  百輝夜行 案内所
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-3 rounded-xl bg-white/5 hover:bg-[#E51937]/20 text-white/80 hover:text-white border border-white/10 hover:border-[#E51937]/60 transition-all duration-200"
              title="メニューを閉じる"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* メインナビゲーションリンク */}
          <nav className="space-y-3.5">
            <span className="text-xs font-bold text-[#F5D061] tracking-widest block uppercase pl-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E51937]" />
              <span>画面遷移・主要メニュー</span>
            </span>

            {/* ホーム・出し物索引 */}
            <button
              onClick={() => handleTabClick('home')}
              className={`w-full p-4.5 rounded-2xl text-left flex items-center justify-between transition-all duration-300 border ${
                currentTab === 'home'
                  ? 'bg-gradient-to-r from-[#E51937]/30 via-[#131a3b] to-transparent border-[#E51937] text-white font-bold shadow-[0_4px_20px_rgba(229,25,55,0.3)]'
                  : 'bg-[#0d132a]/80 hover:bg-[#141d3f] border-white/10 text-white/85 hover:border-[#F5D061]/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-xl ${currentTab === 'home' ? 'bg-[#E51937] text-white' : 'bg-white/5 text-[#E51937]'}`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <div>
                  <span className="text-base font-serif block tracking-wider">出し物・展示 リアルタイム索引</span>
                  <span className="text-xs text-[#94A1B2] font-sans">全クラス・部活動一覧 / 即時在庫フィルタ</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* タイムテーブル */}
            <button
              onClick={() => handleTabClick('timetable')}
              className={`w-full p-4.5 rounded-2xl text-left flex items-center justify-between transition-all duration-300 border ${
                currentTab === 'timetable'
                  ? 'bg-gradient-to-r from-[#00D2FF]/30 via-[#131a3b] to-transparent border-[#00D2FF] text-white font-bold shadow-[0_4px_20px_rgba(0,210,255,0.3)]'
                  : 'bg-[#0d132a]/80 hover:bg-[#141d3f] border-white/10 text-white/85 hover:border-[#00D2FF]/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-xl ${currentTab === 'timetable' ? 'bg-[#00D2FF] text-[#050711]' : 'bg-white/5 text-[#00D2FF]'}`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <span className="text-base font-serif block tracking-wider">ステージ・演目 タイムテーブル</span>
                  <span className="text-xs text-[#94A1B2] font-sans">第一体育館 / 中庭 / 視聴覚室 スケジュール</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* 学校・テーマ概要 */}
            <button
              onClick={() => handleTabClick('info')}
              className={`w-full p-4.5 rounded-2xl text-left flex items-center justify-between transition-all duration-300 border ${
                currentTab === 'info'
                  ? 'bg-gradient-to-r from-[#F5D061]/30 via-[#131a3b] to-transparent border-[#F5D061] text-white font-bold shadow-[0_4px_20px_rgba(245,208,97,0.3)]'
                  : 'bg-[#0d132a]/80 hover:bg-[#141d3f] border-white/10 text-white/85 hover:border-[#F5D061]/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-xl ${currentTab === 'info' ? 'bg-[#F5D061] text-[#050711]' : 'bg-white/5 text-[#F5D061]'}`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div>
                  <span className="text-base font-serif block tracking-wider">学校紹介・「百輝夜行」コンセプト</span>
                  <span className="text-xs text-[#94A1B2] font-sans">ポスタービジュアル詳細・市川中学校・高等学校</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </nav>

          {/* クイックセレクト：ジャンル別ジャンプ */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <span className="text-xs font-bold text-[#F5D061] tracking-widest block uppercase pl-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#F5D061]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span>出し物ジャンル別 クイックアクセス</span>
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleGenreClick('food')}
                className="p-3.5 rounded-xl bg-[#0d132a] hover:bg-[#141d3f] border border-white/10 hover:border-[#F5D061]/50 text-xs font-bold text-left text-white flex items-center justify-between group transition-all"
              >
                <span>食品・カフェ</span>
                <svg className="w-3.5 h-3.5 text-[#F5D061] group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
              <button
                onClick={() => handleGenreClick('attraction')}
                className="p-3.5 rounded-xl bg-[#0d132a] hover:bg-[#141d3f] border border-white/10 hover:border-[#F5D061]/50 text-xs font-bold text-left text-white flex items-center justify-between group transition-all"
              >
                <span>アトラクション・遊技</span>
                <svg className="w-3.5 h-3.5 text-[#F5D061] group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
              <button
                onClick={() => handleGenreClick('exhibition')}
                className="p-3.5 rounded-xl bg-[#0d132a] hover:bg-[#141d3f] border border-white/10 hover:border-[#F5D061]/50 text-xs font-bold text-left text-white flex items-center justify-between group transition-all"
              >
                <span>展示・学術・アート</span>
                <svg className="w-3.5 h-3.5 text-[#F5D061] group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
              <button
                onClick={() => handleGenreClick('stage')}
                className="p-3.5 rounded-xl bg-[#0d132a] hover:bg-[#141d3f] border border-white/10 hover:border-[#F5D061]/50 text-xs font-bold text-left text-white flex items-center justify-between group transition-all"
              >
                <span>ステージ・公演</span>
                <svg className="w-3.5 h-3.5 text-[#F5D061] group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>

          {/* クイックセレクト：場所別ステージスケジュール */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <span className="text-xs font-bold text-[#00D2FF] tracking-widest block uppercase pl-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#00D2FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>ステージ場所別 タイムテーブル</span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStageClick('gym')}
                className="p-3 rounded-xl bg-[#0d132a] hover:bg-[#141d3f] border border-white/10 hover:border-[#00D2FF]/50 text-xs font-bold text-center text-white transition-all"
              >
                第一体育館
              </button>
              <button
                onClick={() => handleStageClick('courtyard')}
                className="p-3 rounded-xl bg-[#0d132a] hover:bg-[#141d3f] border border-white/10 hover:border-[#00D2FF]/50 text-xs font-bold text-center text-white transition-all"
              >
                中庭ステージ
              </button>
              <button
                onClick={() => handleStageClick('av_room')}
                className="p-3 rounded-xl bg-[#0d132a] hover:bg-[#141d3f] border border-white/10 hover:border-[#00D2FF]/50 text-xs font-bold text-center text-white transition-all"
              >
                視聴覚室
              </button>
            </div>
          </div>
        </div>

        {/* 下部：ポスター演出再視聴ボタン＆フッター */}
        <div className="pt-8 border-t border-[rgba(245,208,97,0.3)] space-y-4">
          {onReplayIntro && (
            <button
              onClick={() => {
                onReplayIntro();
                onClose();
              }}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#E51937] to-[#A30E24] hover:from-[#ff2446] hover:to-[#c4122d] text-white font-bold text-sm flex items-center justify-center gap-3 border border-[#F5D061]/60 shadow-[0_6px_25px_rgba(229,25,55,0.6)] transition-all duration-300 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 text-[#F5D061]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              <span className="tracking-wider font-serif">オープニング・ポスター演出を再視聴</span>
            </button>
          )}

          <div className="flex items-center justify-between text-xs text-[#94A1B2] pt-2">
            <span>市川学園公式キャンパスマップ</span>
            <a
              href="https://map.nazuna.jp/campus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00D2FF] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>マップを開く</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
