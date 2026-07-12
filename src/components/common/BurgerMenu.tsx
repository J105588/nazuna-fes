import React from 'react';
import { Sparkles, Calendar, BookOpen, Compass, MapPin, Layers, ChevronRight, X, Play } from 'lucide-react';

/*
  ========================================================================
  BurgerMenu - なずな祭 百輝夜行 公式総合案内ドロワーメニュー
  ========================================================================
  
  【完成品ポスター準拠の完全再設計】
  - 開くときのアニメーション: 掛け軸や屏風が開くような立体的3D展開アニメーション (.animate-kakejiku)
  - 背景・デザイン: 極夜ネイビーにポスターの掛け軸・和傘アセットを幽玄に重ね、金彩と緋色の境界線で仕立てた和モダン空間
  - 絵文字完全排除: すべて高品質SVG/Lucideアイコンで構成
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
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* オーバーレイ背景 (ポスターの深い極夜ネイビー濃霧) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#050711]/90 backdrop-blur-md animate-fade-in transition-opacity"
      />

      {/* ドロワー本体 (ポスター準拠：掛け軸・屏風展開アニメーション & 漆黒金彩パネル) */}
      <div className="relative w-full max-w-xl bg-[#080c1f] border-l-2 border-[#F5D061]/70 shadow-[0_0_120px_rgba(0,0,0,0.95)] h-full overflow-y-auto flex flex-col justify-between p-6 sm:p-10 z-10 animate-kakejiku">
        
        {/* ポスター背景装飾テクスチャ (掛け軸・雲・和傘の幽玄なシルエット) */}
        <div className="absolute top-0 right-0 w-80 h-96 opacity-15 pointer-events-none overflow-hidden">
          <img
            src="/assets/poster/kakejiku_right_base.png"
            alt=""
            className="w-full h-full object-contain object-top filter blur-[1px]"
          />
        </div>
        <div className="absolute bottom-10 left-0 w-64 h-64 opacity-10 pointer-events-none overflow-hidden">
          <img
            src="/assets/poster/umbrella_color.png"
            alt=""
            className="w-full h-full object-contain filter blur-[2px]"
          />
        </div>
        <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F5D061]/20 to-transparent pointer-events-none" />

        {/* 上部ヘッダー */}
        <div className="space-y-8 relative z-10">
          <div className="flex items-center justify-between border-b border-[rgba(245,208,97,0.35)] pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E51937] to-[#800010] flex items-center justify-center border border-[#F5D061]/70 shadow-[0_0_20px_rgba(229,25,55,0.7)]">
                <Sparkles className="w-6 h-6 text-[#F5D061]" />
              </div>
              <div>
                <span className="text-xs text-[#F5D061] tracking-widest block font-serif font-bold">
                  2026年度 なずな祭 公式総合メニュー
                </span>
                <h2 className="text-2xl font-bold text-white tracking-wider font-serif">
                  百輝夜行 案内所
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-white/5 hover:bg-[#E51937]/25 text-white/80 hover:text-white border border-white/10 hover:border-[#F5D061] transition-all duration-300 shadow-md hover:scale-105"
              title="メニューを閉じる"
            >
              <X className="w-6 h-6 text-[#F5D061]" />
            </button>
          </div>

          {/* メインナビゲーションリンク */}
          <nav className="space-y-4">
            <span className="text-xs font-bold text-[#F5D061] tracking-widest block uppercase pl-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E51937] shadow-[0_0_8px_#E51937]" />
              <span className="font-serif">画面遷移・主要メニュー</span>
            </span>

            {/* ホーム・出し物索引 */}
            <button
              onClick={() => handleTabClick('home')}
              className={`w-full p-5 rounded-2xl text-left flex items-center justify-between transition-all duration-400 group border ${
                currentTab === 'home'
                  ? 'bg-gradient-to-r from-[#E51937]/35 via-[#131a3b] to-[#080c1f] border-[#E51937] text-white font-bold shadow-[0_6px_25px_rgba(229,25,55,0.35)] scale-[1.02]'
                  : 'wamodern-panel wamodern-panel-hover text-white/90'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${currentTab === 'home' ? 'bg-[#E51937] text-white shadow-[0_0_15px_rgba(229,25,55,0.8)]' : 'bg-white/5 text-[#E51937] border border-white/10'}`}>
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-serif font-bold block tracking-wider text-white group-hover:text-[#F5D061] transition-colors">
                    出し物・展示 リアルタイム索引
                  </span>
                  <span className="text-xs text-[#94A1B2] font-sans block mt-0.5">
                    全クラス・部活動一覧 / 即時在庫フィルタ
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${currentTab === 'home' ? 'text-[#F5D061]' : 'text-white/40'}`} />
            </button>

            {/* タイムテーブル */}
            <button
              onClick={() => handleTabClick('timetable')}
              className={`w-full p-5 rounded-2xl text-left flex items-center justify-between transition-all duration-400 group border ${
                currentTab === 'timetable'
                  ? 'bg-gradient-to-r from-[#00D2FF]/35 via-[#131a3b] to-[#080c1f] border-[#00D2FF] text-white font-bold shadow-[0_6px_25px_rgba(0,210,255,0.35)] scale-[1.02]'
                  : 'wamodern-panel wamodern-panel-hover text-white/90'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${currentTab === 'timetable' ? 'bg-[#00D2FF] text-[#050711] shadow-[0_0_15px_rgba(0,210,255,0.8)]' : 'bg-white/5 text-[#00D2FF] border border-white/10'}`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-serif font-bold block tracking-wider text-white group-hover:text-[#00D2FF] transition-colors">
                    ステージ・演目 タイムテーブル
                  </span>
                  <span className="text-xs text-[#94A1B2] font-sans block mt-0.5">
                    第一体育館 / 中庭 / 視聴覚室 スケジュール
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${currentTab === 'timetable' ? 'text-[#00D2FF]' : 'text-white/40'}`} />
            </button>

            {/* 学校・テーマ概要 */}
            <button
              onClick={() => handleTabClick('info')}
              className={`w-full p-5 rounded-2xl text-left flex items-center justify-between transition-all duration-400 group border ${
                currentTab === 'info'
                  ? 'bg-gradient-to-r from-[#F5D061]/35 via-[#131a3b] to-[#080c1f] border-[#F5D061] text-white font-bold shadow-[0_6px_25px_rgba(245,208,97,0.35)] scale-[1.02]'
                  : 'wamodern-panel wamodern-panel-hover text-white/90'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${currentTab === 'info' ? 'bg-[#F5D061] text-[#050711] shadow-[0_0_15px_rgba(245,208,97,0.8)]' : 'bg-white/5 text-[#F5D061] border border-white/10'}`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-serif font-bold block tracking-wider text-white group-hover:text-[#F5D061] transition-colors">
                    学校紹介・「百輝夜行」コンセプト
                  </span>
                  <span className="text-xs text-[#94A1B2] font-sans block mt-0.5">
                    ポスタービジュアル詳細・市川中学校・高等学校
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${currentTab === 'info' ? 'text-[#F5D061]' : 'text-white/40'}`} />
            </button>
          </nav>

          {/* クイックセレクト：ジャンル別ジャンプ */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <span className="text-xs font-bold text-[#F5D061] tracking-widest block uppercase pl-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#F5D061]" />
              <span className="font-serif">出し物ジャンル別 クイックアクセス</span>
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleGenreClick('food')}
                className="p-3.5 rounded-xl bg-[#0d132a] hover:bg-[#151e42] border border-white/10 hover:border-[#F5D061]/60 text-xs font-bold text-left text-white flex items-center justify-between group transition-all shadow-md"
              >
                <span>食品・カフェ屋台</span>
                <ChevronRight className="w-4 h-4 text-[#F5D061] group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleGenreClick('attraction')}
                className="p-3.5 rounded-xl bg-[#0d132a] hover:bg-[#151e42] border border-white/10 hover:border-[#F5D061]/60 text-xs font-bold text-left text-white flex items-center justify-between group transition-all shadow-md"
              >
                <span>アトラクション・遊技</span>
                <ChevronRight className="w-4 h-4 text-[#F5D061] group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleGenreClick('exhibition')}
                className="p-3.5 rounded-xl bg-[#0d132a] hover:bg-[#151e42] border border-white/10 hover:border-[#F5D061]/60 text-xs font-bold text-left text-white flex items-center justify-between group transition-all shadow-md"
              >
                <span>展示・学術・アート</span>
                <ChevronRight className="w-4 h-4 text-[#F5D061] group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleGenreClick('stage')}
                className="p-3.5 rounded-xl bg-[#0d132a] hover:bg-[#151e42] border border-white/10 hover:border-[#F5D061]/60 text-xs font-bold text-left text-white flex items-center justify-between group transition-all shadow-md"
              >
                <span>ステージ・公演</span>
                <ChevronRight className="w-4 h-4 text-[#F5D061] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* クイックセレクト：場所別ステージスケジュール */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <span className="text-xs font-bold text-[#00D2FF] tracking-widest block uppercase pl-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00D2FF]" />
              <span className="font-serif">ステージ場所別 タイムテーブル</span>
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => handleStageClick('gym')}
                className="p-3 rounded-xl bg-[#0d132a] hover:bg-[#151e42] border border-white/10 hover:border-[#00D2FF]/60 text-xs font-bold text-center text-white transition-all shadow-md"
              >
                第一体育館
              </button>
              <button
                onClick={() => handleStageClick('courtyard')}
                className="p-3 rounded-xl bg-[#0d132a] hover:bg-[#151e42] border border-white/10 hover:border-[#00D2FF]/60 text-xs font-bold text-center text-white transition-all shadow-md"
              >
                中庭ステージ
              </button>
              <button
                onClick={() => handleStageClick('av_room')}
                className="p-3 rounded-xl bg-[#0d132a] hover:bg-[#151e42] border border-white/10 hover:border-[#00D2FF]/60 text-xs font-bold text-center text-white transition-all shadow-md"
              >
                視聴覚室
              </button>
            </div>
          </div>
        </div>

        {/* 下部：ポスター演出再視聴ボタン＆フッター */}
        <div className="pt-8 border-t border-[rgba(245,208,97,0.35)] space-y-5 relative z-10">
          {onReplayIntro && (
            <button
              onClick={() => {
                onReplayIntro();
                onClose();
              }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E51937] via-[#A30E24] to-[#800010] hover:from-[#ff2446] hover:to-[#c4122d] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 border border-[#F5D061]/80 shadow-[0_8px_30px_rgba(229,25,55,0.7)] transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="p-1.5 rounded-full bg-black/40 border border-[#F5D061]/50 group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 text-[#F5D061] fill-current" />
              </div>
              <span className="tracking-wider font-serif font-bold">オープニング・ポスター演出を再視聴</span>
            </button>
          )}

          <div className="flex items-center justify-between text-xs text-[#94A1B2] pt-2">
            <span className="font-sans">市川学園公式キャンパスマップ</span>
            <a
              href="https://map.nazuna.jp/campus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00D2FF] hover:underline flex items-center gap-1.5 font-semibold"
            >
              <span>デジタルマップを開く</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
