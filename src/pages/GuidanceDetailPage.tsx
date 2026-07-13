import React, { useState, useEffect } from 'react';
import { HelpCircle, MapPin, ShieldCheck, HelpCircle as FaqIcon, Recycle, Search, ArrowRight, Compass, PhoneCall } from 'lucide-react';

export type GuidanceSectionId =
  | 'precautions'
  | 'campus-map'
  | 'info-desk'
  | 'faq'
  | 'waste-rules'
  | 'lost-found'
  | 'barrier-free'
  | 'press-coverage'
  | 'pamphlet';

interface GuidanceDetailPageProps {
  initialSection?: GuidanceSectionId;
  onNavigateTab?: (tab: 'home' | 'timetable' | 'info' | 'lostfound' | 'guidance' | 'policy') => void;
}

export const GuidanceDetailPage: React.FC<GuidanceDetailPageProps> = ({
  initialSection = 'precautions',
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<GuidanceSectionId>('precautions');

  useEffect(() => {
    if (initialSection === 'lost-found') {
      if (onNavigateTab) {
        onNavigateTab('lostfound');
      } else {
        setActiveSection('info-desk');
      }
    } else if (
      initialSection === 'barrier-free' ||
      initialSection === 'press-coverage' ||
      initialSection === 'pamphlet'
    ) {
      setActiveSection('info-desk');
    } else if (initialSection) {
      setActiveSection(initialSection);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialSection, onNavigateTab]);

  const navItems: { id: GuidanceSectionId; label: string; badge: string; icon: React.ReactNode }[] = [
    { id: 'precautions', label: 'ご来場の際の注意点', badge: 'お願い', icon: <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" /> },
    { id: 'campus-map', label: 'アクセス・校内立体マップ', badge: 'マップ', icon: <MapPin className="w-7 h-7 sm:w-8 sm:h-8" /> },
    { id: 'info-desk', label: '総合案内所（本館2階）', badge: '総合案内所', icon: <Compass className="w-7 h-7 sm:w-8 sm:h-8" /> },
    { id: 'faq', label: 'よくあるご質問 (FAQ)', badge: 'Q&A', icon: <FaqIcon className="w-7 h-7 sm:w-8 sm:h-8" /> },
    { id: 'waste-rules', label: 'ごみ分別ルール', badge: 'エコ', icon: <Recycle className="w-7 h-7 sm:w-8 sm:h-8" /> },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] py-16 sm:py-24 font-serif select-none">
      {/* 独創的モダン和風ヘッダー背景（麻の葉パターン＆朱の帯） */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">

        {/* タイトルヘッダー */}
        <div className="text-center space-y-5 relative pb-8 border-b border-wafuu-sumi/15">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wafuu-shu/10 border border-wafuu-shu/30 text-xs font-bold text-wafuu-shu tracking-widest font-mono">
            <span>OFFICIAL VISITOR GUIDANCE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-wafuu-sumi tracking-wider font-serif">
            ご来場者ガイド ＆ 総合案内所
          </h1>
          <p className="text-sm sm:text-base text-wafuu-sumi/80 max-w-2xl mx-auto leading-relaxed">
            第76回なずな祭「百輝夜行」へようこそ。安心・安全に文化祭をお楽しみいただくための公式ご案内窓口および注意事項について掲載しております。
          </p>
        </div>

        {/* タブ一覧切り替えナビゲーション（亀甲紋・隣接六角形スタイル） */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 font-sans">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  window.scrollTo({ top: 320, behavior: 'smooth' });
                }}
                className="hexagon-border-box group"
              >
                <div className="hexagon-outer">
                  <div className={`hexagon-inner ${isActive ? '!bg-gradient-to-br !from-[#2C3E55] !to-[#1B273E] !text-white' : ''}`}>
                    <div className={`hexagon-decor-ring ${isActive ? '!border-[#F5D061]' : ''}`} />
                    <div className="flex items-center justify-between w-full mb-3 px-1">
                      <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isActive ? 'bg-wafuu-kincha text-white' : 'bg-wafuu-sumi/10 text-wafuu-sumi/80'}`}>
                        {item.badge}
                      </span>
                      <div className={`${isActive ? 'text-wafuu-kincha' : 'text-[#2C3E55] group-hover:text-wafuu-shu transition-colors'}`}>
                        {item.icon}
                      </div>
                    </div>
                    <span className={`font-black text-sm sm:text-base lg:text-lg leading-tight font-serif mt-1 ${isActive ? 'text-white' : 'text-[#2C3E55] group-hover:text-white transition-colors'}`}>{item.label}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* メイン詳細パネル（千代紙・和紙風上質カード） */}
        <div className="bg-white rounded-3xl border border-wafuu-ekasumi/60 p-8 sm:p-14 shadow-md space-y-10 leading-relaxed text-wafuu-sumi/85 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-wafuu-kincha/5 rounded-full blur-3xl pointer-events-none" />

          {/* ==========================================================
              1. ご来場の際の注意点 (precautions)
          ========================================================== */}
          {activeSection === 'precautions' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-wafuu-sumi/15 pb-5">
                <span className="text-xs font-mono font-bold text-wafuu-shu block">VISITOR PRECAUTIONS</span>
                <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1 font-serif">
                  ご来場の際の注意点 （お願い事項）
                </h2>
              </div>
              <div className="space-y-6 text-sm sm:text-base font-sans">
                <div className="bg-wafuu-shu/8 p-6 sm:p-8 rounded-3xl border-l-4 border-wafuu-shu space-y-3 shadow-inner">
                  <div className="flex items-center gap-2 font-bold text-wafuu-shu text-lg font-serif">
                    <ShieldCheck className="w-6 h-6" />
                    <span>ご来場者様へ・厳守のお願い</span>
                  </div>
                  <p className="leading-relaxed text-wafuu-sumi">
                    ご来場いただくすべての皆様にお楽しみいただくため、公共マナーおよび安全な行事運営へのご協力をお願いいたします。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-wafuu-ekasumi/50 space-y-3">
                    <h4 className="font-bold text-lg font-serif text-wafuu-sumi flex items-center gap-2 border-b border-wafuu-sumi/10 pb-2.5">
                      <span className="w-2 h-2 rounded-full bg-wafuu-shu" />
                      <span>公共交通機関ご利用のお願い</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
                      校内および周辺道路に一般ご来場者様用の駐車場・パーキング等は一切ございません。お車・オートバイ等でのご来場は固くお断りいたします。JR本八幡駅・市川大野駅・京成八幡駅等の各駅から路線バス等の公共交通機関をご利用ください。
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-wafuu-ekasumi/50 space-y-3">
                    <h4 className="font-bold text-lg font-serif text-wafuu-sumi flex items-center gap-2 border-b border-wafuu-sumi/10 pb-2.5">
                      <span className="w-2 h-2 rounded-full bg-wafuu-kincha" />
                      <span>上履きのご持参と土足禁止エリア</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
                      本館および各校舎内は土足厳禁となっております。ご来場の際は必ず<strong className="text-wafuu-shu font-bold">上履き（スリッパ等）および外履きを入れる袋</strong>をご持参の上、校内での履き替えにご協力ください。
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-wafuu-ekasumi/50 space-y-3">
                    <h4 className="font-bold text-lg font-serif text-wafuu-sumi flex items-center gap-2 border-b border-wafuu-sumi/10 pb-2.5">
                      <span className="w-2 h-2 rounded-full bg-wafuu-ai" />
                      <span>全面禁煙および酒類持込禁止</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
                      市川学園敷地内および周辺道路はすべて全面禁煙（電子タバコ含む）です。また、酒類の持ち込み・飲酒された状態でのご入場は固くお断り申し上げます。
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-wafuu-ekasumi/50 space-y-3">
                    <h4 className="font-bold text-lg font-serif text-wafuu-sumi flex items-center gap-2 border-b border-wafuu-sumi/10 pb-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#2C3E55]" />
                      <span>写真撮影およびSNS投稿ルール</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
                      生徒や他のご来場者様のお顔がはっきりと写っている写真を許可なくインターネットや各種SNS（Instagram、X、TikTok等）へ投稿することはプライバシー保護の観点から禁止しております。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              2. アクセス・キャンパスマップ (campus-map)
          ========================================================== */}
          {activeSection === 'campus-map' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-wafuu-sumi/15 pb-5">
                <span className="text-xs font-mono font-bold text-wafuu-ai block">ACCESS & CAMPUS MAP</span>
                <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1 font-serif">
                  アクセス・キャンパスマップ （校内立体配置）
                </h2>
              </div>
              <div className="space-y-6 text-sm sm:text-base font-sans">
                <p className="leading-relaxed">
                  市川学園キャンパス（千葉県市川市本北方2-38-1）の主要建物構成および動線ガイドです。キャンパスマップの詳細は「マップタブ」よりインタラクティブマップをご活用いただけます。
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-wafuu-ekasumi/50 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-lg font-serif text-wafuu-sumi">
                      <MapPin className="w-5 h-5 text-wafuu-shu" />
                      <span>本館・東館・理科棟 (1F〜4F)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-wafuu-sumi/75 leading-relaxed">
                      全クラス出展、文化部企画、各種模擬店受付が集中するメインエリアです。<strong className="text-wafuu-shu font-bold">本館2階に総合案内所</strong>がございます。
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-wafuu-ekasumi/50 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-lg font-serif text-wafuu-sumi">
                      <MapPin className="w-5 h-5 text-wafuu-kincha" />
                      <span>第一・第二体育館＆中庭特設ステージ</span>
                    </div>
                    <p className="text-xs sm:text-sm text-wafuu-sumi/75 leading-relaxed">
                      ダンス部・吹奏楽部等のステージ公演会場です。第一体育館へは本館2F連絡通路よりスムーズにご移動いただけます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              3. 総合案内所（本館2階総合案内所） (info-desk)
              ※ 取材・バリアフリー・公式パンフレット削除、落とし物は完全分離
          ========================================================== */}
          {activeSection === 'info-desk' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-wafuu-sumi/15 pb-5">
                <span className="text-xs font-mono font-bold text-wafuu-kincha block">GENERAL INFORMATION DESK</span>
                <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1 font-serif flex items-center gap-3">
                  <span>総合案内所 （本館2階）</span>
                </h2>
              </div>

              <div className="space-y-8 font-sans">
                {/* メイン窓口所在地・サポート内容の独創的カード */}
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5] border border-wafuu-kincha/40 shadow-md space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-wafuu-shu via-wafuu-kincha to-wafuu-ai" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-wafuu-sumi/10">
                    <div className="space-y-1">
                      <span className="px-3 py-1 rounded-full bg-wafuu-kincha/15 text-wafuu-kincha font-bold text-xs font-serif block w-max">
                        公式サポートセンター
                      </span>
                      <h3 className="text-xl sm:text-3xl font-black text-wafuu-sumi font-serif pt-1">
                        本館2階 総合案内所
                      </h3>
                    </div>
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-wafuu-sumi text-white text-xs font-bold shrink-0">
                      <Compass className="w-4 h-4 text-wafuu-kincha" />
                      <span>本館正面大階段を上がって2階中央</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-wafuu-sumi/80 leading-relaxed font-serif">
                    なずな祭当日は、<strong>「本館2階 総合案内所」</strong>にて実行委員会役員が常駐し、ご来場の皆様をトータルサポートしております。ご不明点やお困りごとがございましたら、お気軽にお立ち寄りください。
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 font-sans">
                    <div className="p-5 rounded-2xl bg-white border border-wafuu-ekasumi/70 space-y-2 shadow-sm">
                      <div className="flex items-center gap-2 font-bold text-sm text-wafuu-sumi font-serif">
                        <HelpCircle className="w-4 h-4 text-wafuu-shu" />
                        <span>企画場所・経路案内</span>
                      </div>
                      <p className="text-xs text-wafuu-sumi/70 leading-relaxed">
                        校内マップで見つからない企画やステージの開催教室・最短移動ルートをご案内いたします。
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-wafuu-ekasumi/70 space-y-2 shadow-sm">
                      <div className="flex items-center gap-2 font-bold text-sm text-wafuu-sumi font-serif">
                        <PhoneCall className="w-4 h-4 text-wafuu-kincha" />
                        <span>迷子・お連れ様のお尋ね</span>
                      </div>
                      <p className="text-xs text-wafuu-sumi/70 leading-relaxed">
                        校内ではぐれてしまったお連れ様のお尋ねや、迷子へのご対応・ご相談を承ります。
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-wafuu-ekasumi/70 space-y-2 shadow-sm">
                      <div className="flex items-center gap-2 font-bold text-sm text-wafuu-sumi font-serif">
                        <ShieldCheck className="w-4 h-4 text-wafuu-ai" />
                        <span>校内サポートご相談</span>
                      </div>
                      <p className="text-xs text-wafuu-sumi/70 leading-relaxed">
                        緊急時のお問い合わせや、車椅子等で移動に介助が必要な際のご案内窓口として対応いたします。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 落とし物との完全分離＆接続バナー（リアルタイム配信システム誘導） */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-white space-y-5 shadow-xl border border-wafuu-ai/40 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                    <Search className="w-64 h-64 -mr-12 -mb-12 text-white" />
                  </div>

                  <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wafuu-shu/20 border border-wafuu-shu/40 text-xs font-bold text-[#FF9E9E]">
                      <span>落とし物・遺失物についてのお知らせ</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black font-serif tracking-wide">
                      落とし物は「専用の落とし物掲示板」から検索が可能です
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-[#E2E8F0]/80 leading-relaxed max-w-3xl relative z-10 font-serif">
                    校内での落とし物・お忘れ物は、実行委員より<strong>『落とし物掲示板』</strong>へ配信されております。<br />
                    お探しの品物がある場合は、総合案内所でお並びいただく前に、まずはオンライン掲示板をご確認ください。
                  </p>

                  <div className="pt-2 relative z-10">
                    <button
                      type="button"
                      onClick={() => onNavigateTab && onNavigateTab('lostfound')}
                      className="py-3.5 px-8 rounded-2xl font-bold text-sm bg-wafuu-kincha hover:bg-[#E5C158] text-[#121A2C] transition-all shadow-lg flex items-center gap-3 active:scale-95"
                    >
                      <span>落とし物掲示板へ移動</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              4. よくあるご質問 (FAQ) (faq)
          ========================================================== */}
          {activeSection === 'faq' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-wafuu-sumi/15 pb-5">
                <span className="text-xs font-mono font-bold text-[#2C3E55] block">FREQUENTLY ASKED QUESTIONS</span>
                <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1 font-serif">
                  よくあるご質問 (FAQ)
                </h2>
              </div>
              <div className="space-y-6 text-sm sm:text-base font-sans">
                <div className="p-6 rounded-3xl bg-[#FAF8F5] space-y-2 border border-wafuu-ekasumi/50 shadow-sm">
                  <h4 className="font-bold text-[#2C3E55] flex items-center gap-2.5 text-base font-serif">
                    <span className="w-6 h-6 rounded-lg bg-[#2C3E55] text-white flex items-center justify-center text-xs font-mono shrink-0">Q</span>
                    <span>途中退場や再入場は可能ですか？</span>
                  </h4>
                  <p className="pl-8 text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
                    はい、可能です。正門付近の特設ブースにて配付された入場リストバンドまたはデジタルスタンプをご提示いただくことで、開催時間内であれば何度でも再入場いただけます。
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-[#FAF8F5] space-y-2 border border-wafuu-ekasumi/50 shadow-sm">
                  <h4 className="font-bold text-[#2C3E55] flex items-center gap-2.5 text-base font-serif">
                    <span className="w-6 h-6 rounded-lg bg-[#2C3E55] text-white flex items-center justify-center text-xs font-mono shrink-0">Q</span>
                    <span>校内での飲食ルールについて教えてください。</span>
                  </h4>
                  <p className="pl-8 text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
                    歩行中の飲食は安全および衛生面から厳禁です。中庭等の屋外指定飲食エリア、または指定の休憩教室でのお食事にご協力をお願いいたします。
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-[#FAF8F5] space-y-2 border border-wafuu-ekasumi/50 shadow-sm">
                  <h4 className="font-bold text-[#2C3E55] flex items-center gap-2.5 text-base font-serif">
                    <span className="w-6 h-6 rounded-lg bg-[#2C3E55] text-white flex items-center justify-center text-xs font-mono shrink-0">Q</span>
                    <span>落とし物をした場合はどこへ行けばよいですか？</span>
                  </h4>
                  <p className="pl-8 text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
                    まずはオンラインの<strong>「落とし物掲示板」</strong>をご確認ください。該当する品物が見つかった場合は、スマートフォン画面をご提示の上、<strong>「本館2階 総合案内所」</strong>までお越しください。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              5. ごみ分別ルール (waste-rules)
          ========================================================== */}
          {activeSection === 'waste-rules' && (
            <div className="space-y-8 animate-fade-in font-sans">
              <div className="border-b border-wafuu-sumi/15 pb-5">
                <span className="text-xs font-mono font-bold text-[#1E6B47] block">ECO RULES & WASTE SEPARATION</span>
                <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1 font-serif">
                  ごみ分別のお願い （エコステーション）
                </h2>
              </div>
              <div className="space-y-6 text-sm sm:text-base">
                <p className="leading-relaxed">
                  なずな祭では「環境にやさしいエコな文化祭」を目指し、校内各所に「エコステーション（ごみ分別回収窓口）」を設置しております。必ず実行委員会の誘導に従い、以下の分別ルールにご協力ください。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-5 rounded-2xl bg-white border-2 border-[#1E6B47] font-bold text-center space-y-1 shadow-sm">
                    <div className="text-sm text-[#1E6B47]">燃えるごみ</div>
                    <div className="text-[11px] text-wafuu-sumi/70 font-sans">紙くず・割り箸・紙コップ等</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border-2 border-[#1E6B47] font-bold text-center space-y-1 shadow-sm">
                    <div className="text-sm text-[#1E6B47]">プラスチック類</div>
                    <div className="text-[11px] text-wafuu-sumi/70 font-sans">食品プラスチック容器・フィルム等</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border-2 border-[#1E6B47] font-bold text-center space-y-1 shadow-sm">
                    <div className="text-sm text-[#1E6B47]">ペットボトル・缶</div>
                    <div className="text-[11px] text-wafuu-sumi/70 font-sans">キャップとラベルを必ず分離</div>
                  </div>
                </div>
                <p className="text-xs text-wafuu-sumi/70 pt-2 font-serif">
                  ※ 飲み残しの汁物・氷等はゴミ箱に直接捨てず、必ずエコステーション専用バケツにあけてから容器を分別してください。
                </p>
              </div>
            </div>
          )}

          {/* フッターアクション */}
          <div className="pt-8 border-t border-wafuu-sumi/15 flex justify-center font-serif">
            <button
              onClick={() => onNavigateTab && onNavigateTab('home')}
              className="px-8 py-4 rounded-2xl bg-wafuu-sumi text-white hover:bg-wafuu-shu transition-colors font-bold flex items-center gap-2 shadow-lg active:scale-95"
            >
              <span>総合トップページへ戻る</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
