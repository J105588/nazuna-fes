import React, { useEffect } from 'react';
import { Compass, Search, Calendar, MapPin, BookOpen, HelpCircle, ChevronRight, FileText, Info } from 'lucide-react';

/*
  ========================================================================
  BurgerMenu - なずな祭 公式全画面ナビゲーションメニュー（和風模様背景）
  ========================================================================
*/

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: 'home' | 'exhibitions' | 'timetable' | 'map' | 'info' | 'lostfound' | 'admin' | 'guidance' | 'policy';
  onSelectTab: (tab: 'home' | 'exhibitions' | 'timetable' | 'map' | 'info' | 'lostfound' | 'admin' | 'guidance' | 'policy') => void;
  onSelectGenreQuick?: (genre: string) => void;
  onOpenMapModal?: () => void;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab
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

  const handleTabClick = (tab: 'home' | 'exhibitions' | 'timetable' | 'map' | 'info' | 'lostfound' | 'admin' | 'guidance' | 'policy') => {
    onSelectTab(tab);
    onClose();
  };

  const navItems: Array<{
    id: 'home' | 'exhibitions' | 'timetable' | 'map' | 'guidance' | 'info' | 'lostfound' | 'policy';
    label: string;
    subLabel: string;
    icon: React.ReactNode;
    color: string;
    badge?: string;
  }> = [
      {
        id: 'home',
        label: 'HOME',
        subLabel: '総合案内・最新お知らせ',
        icon: <Compass className="w-6 h-6 sm:w-7 sm:h-7 hover-icon-y-spin" />,
        color: 'bg-wafuu-shu text-white',
      },
      {
        id: 'exhibitions',
        label: '出し物・展示 企画一覧',
        subLabel: 'クラス・部活動・有志団体の出展企画',
        icon: <Search className="w-6 h-6 sm:w-7 sm:h-7 hover-icon-y-spin" />,
        color: 'bg-wafuu-shu text-white',
        badge: '企画',
      },
      {
        id: 'timetable',
        label: 'タイムテーブル',
        subLabel: '各ステージ・会場のスケジュール',
        icon: <Calendar className="w-6 h-6 sm:w-7 sm:h-7 hover-icon-y-spin" />,
        color: 'bg-wafuu-kincha text-white',
        badge: 'ステージ',
      },
      {
        id: 'map',
        label: '校内マップ',
        subLabel: 'マップ・ルート案内',
        icon: <MapPin className="w-6 h-6 sm:w-7 sm:h-7 hover-icon-y-spin" />,
        color: 'bg-[#2C3E55] text-white',
        badge: 'マップ',
      },
      {
        id: 'guidance',
        label: 'ご案内・総合案内所窓口',
        subLabel: '本館2階総合案内所・ご来場ルール・FAQ',
        icon: <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 hover-icon-y-spin" />,
        color: 'bg-[#4A6382] text-white',
        badge: 'ご案内',
      },
      {
        id: 'info',
        label: 'テーマ「百輝夜行」について',
        subLabel: '2026年度なずな祭テーマについて',
        icon: <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 hover-icon-y-spin" />,
        color: 'bg-wafuu-ai text-white',
        badge: 'テーマ',
      },
      {
        id: 'lostfound',
        label: '落とし物掲示板',
        subLabel: '拾得物オンライン検索',
        icon: <Info className="w-6 h-6 sm:w-7 sm:h-7 hover-icon-y-spin" />,
        color: 'bg-wafuu-ekasumi text-white',
        badge: '窓口',
      },
      {
        id: 'policy',
        label: 'プライバシー＆サイトポリシー',
        subLabel: '個人情報保護方針・免責事項・各種情報指針',
        icon: <FileText className="w-6 h-6 sm:w-7 sm:h-7 hover-icon-y-spin" />,
        color: 'bg-wafuu-sumi/70 text-white',
      },
    ];

  /* SVG 麻の葉模様パターン定義 (インラインで完結) */
  const asanohaPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0L60 15L30 30L0 15Z' fill='none' stroke='%23C4A574' stroke-width='0.5' opacity='0.25'/%3E%3Cpath d='M30 30L60 45L30 60L0 45Z' fill='none' stroke='%23C4A574' stroke-width='0.5' opacity='0.25'/%3E%3Cpath d='M0 15L30 30L0 45' fill='none' stroke='%23C4A574' stroke-width='0.5' opacity='0.2'/%3E%3Cpath d='M60 15L30 30L60 45' fill='none' stroke='%23C4A574' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E")`;

  /* SVG 青海波模様パターン定義 */
  const seigaihaPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'%3E%3Cpath d='M0 40 C20 40 20 20 40 20 C60 20 60 40 80 40' fill='none' stroke='%232C3E55' stroke-width='0.6' opacity='0.12'/%3E%3Cpath d='M0 30 C15 30 15 15 30 15 C45 15 45 30 60 30 C75 30 75 45 90 45' fill='none' stroke='%232C3E55' stroke-width='0.4' opacity='0.08'/%3E%3C/svg%3E")`;

  return (
    <div
      className={`fixed inset-0 z-[70] overflow-y-auto overflow-x-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${isOpen
        ? 'opacity-100 pointer-events-auto'
        : 'opacity-0 pointer-events-none'
        }`}
    >
      {/* 和紙テクスチャ不透明背景（複数レイヤー） */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #F5F0E6 0%, #EDE6D6 35%, #F0E8D8 65%, #E8DFD0 100%)',
        }}
      />
      {/* 麻の葉パターンレイヤー */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: asanohaPattern, backgroundSize: '60px 60px' }}
      />
      {/* 青海波パターンレイヤー（下半分寄り） */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: seigaihaPattern,
          backgroundSize: '80px 40px',
          maskImage: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      {/* 上部の朱色→金茶のアクセントライン */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-wafuu-shu via-[#D4AF37] to-wafuu-shu" />
      {/* 上部の淡い金色グロー */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#D4AF37]/8 to-transparent pointer-events-none" />

      {/* メインコンテンツ（右上起点 origin-top-right で滑らかに展開） */}
      <div
        className={`relative w-full max-w-5xl mx-auto px-5 sm:px-10 py-8 sm:py-12 min-h-full flex flex-col justify-between origin-top-right transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen
          ? 'scale-100 translate-x-0 translate-y-0 opacity-100'
          : 'scale-90 translate-x-12 -translate-y-12 opacity-0'
          }`}
      >
        {/* メニュータイトルヘッダー */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#2C3E55]/15 mb-8 mt-20 sm:mt-24">
          <div>
            <span className="text-xs font-serif font-bold text-wafuu-shu tracking-widest block mb-1">
              総合案内・ページ目次
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C3E55] tracking-wider font-serif">
              ナビゲーション
            </h2>
          </div>
        </div>

        {/* ページナビゲーションリスト */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 my-auto">
          {navItems.map((item, idx) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full p-5 sm:p-6 rounded-2xl text-left flex items-center justify-between transition-all duration-300 group border ${isActive
                  ? 'bg-white border-2 border-wafuu-shu shadow-md scale-[1.01]'
                  : 'bg-white/90 hover:bg-white border-[#2C3E55]/10 hover:border-wafuu-shu/50 shadow-sm hover:shadow-md hover:translate-y-[-2px]'
                  }`}
                style={{
                  transitionDelay: isOpen ? `${idx * 40}ms` : '0ms',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(12px)',
                }}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`p-3.5 rounded-xl transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-sm ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-base sm:text-lg font-serif font-bold tracking-wider text-[#2C3E55] group-hover:text-wafuu-shu transition-colors">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F5F0E6] border border-[#2C3E55]/15 text-[#2C3E55]/70">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#2C3E55]/60 font-sans block leading-relaxed line-clamp-1">
                      {item.subLabel}
                    </span>
                  </div>
                </div>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0 ml-2 ${isActive
                  ? 'bg-wafuu-shu text-white'
                  : 'bg-[#F5F0E6] text-[#2C3E55]/40 group-hover:bg-wafuu-shu group-hover:text-white'
                  }`}>
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* 下部フッター */}
        <div className="pt-8 mt-10 border-t border-[#2C3E55]/15 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#2C3E55]/50 font-sans">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span>2026年度 なずな祭実行委員会</span>
          </div>
          <p>&copy; 2026 市川学園 なずな祭実行委員会</p>
        </div>
      </div>
    </div>
  );
};
