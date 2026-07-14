import React, { useState, useEffect } from 'react';

export type PolicySectionId = 'sitemap' | 'privacy' | 'sitepolicy' | 'filming-guidelines';

interface PolicyPageProps {
  initialSection?: PolicySectionId;
  onNavigateTab?: (tab: 'home' | 'timetable' | 'info' | 'lostfound' | 'guidance' | 'policy') => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({
  initialSection = 'filming-guidelines',
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<PolicySectionId>(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialSection]);

  const navItems: { id: PolicySectionId; label: string; badge: string }[] = [
    { id: 'filming-guidelines', label: 'なずな祭に関する情報指針', badge: '撮影・SNS' },
    { id: 'privacy', label: 'プライバシーポリシー', badge: '個人情報保護' },
    { id: 'sitepolicy', label: 'サイトポリシー', badge: '利用規約' },
    { id: 'sitemap', label: 'サイトマップ', badge: '目次・一覧' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] py-16 sm:py-24 font-serif">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">

        {/* ヘッダー */}
        <div className="text-center space-y-4 border-b border-wafuu-sumi/10 pb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-wafuu-sumi tracking-wider">
            公式規約 ＆ 情報掲載指針
          </h1>
          <p className="text-sm sm:text-base text-wafuu-sumi/75 max-w-2xl mx-auto leading-relaxed">
            市川中学校・高等学校 2026年度なずな祭実行委員会が制定する公式方針・規約および個人情報・撮影に関する規定一覧です。
          </p>
        </div>

        {/* タブ切り替えナビゲーション */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  window.scrollTo({ top: 280, behavior: 'smooth' });
                }}
                className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between h-full ${isActive
                  ? 'bg-wafuu-sumi text-white border-wafuu-sumi shadow-md translate-y-[-2px]'
                  : 'bg-white text-wafuu-sumi border-wafuu-ekasumi/50 hover:bg-[#F2ECE1]'
                  }`}
              >
                <span className={`text-xs font-mono font-bold uppercase tracking-wider block mb-2 px-2.5 py-0.5 rounded-full w-max ${isActive ? 'bg-wafuu-shu text-white' : 'bg-wafuu-sumi/10 text-wafuu-sumi'
                  }`}>
                  {item.badge}
                </span>
                <span className="font-bold text-sm sm:text-base leading-snug">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* メインコンテンツパネル */}
        <div className="bg-white rounded-3xl border border-wafuu-ekasumi/60 p-8 sm:p-14 shadow-sm space-y-10 leading-relaxed text-wafuu-sumi/85">

          {/* 1. 撮影およびSNS掲載に関する情報指針 */}
          {activeSection === 'filming-guidelines' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-wafuu-sumi/15 pb-5">
                <span className="text-xs font-mono font-bold text-wafuu-shu block">GUIDELINE ON PHOTOGRAPHY & SNS</span>
                <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1">
                  なずな祭に関する情報指針 （撮影・SNS掲載制限事項）
                </h2>
              </div>

              <div className="space-y-6 text-sm sm:text-base font-sans">
                <div className="bg-wafuu-shu/8 p-6 rounded-2xl border-l-4 border-wafuu-shu space-y-2">
                  <h3 className="font-bold text-wafuu-shu text-lg font-serif">【重要なお願い】ご来場の皆様へ</h3>
                  <p>
                    本校では、生徒・教職員・ご来場者様のプライバシーおよび肖像権の保護、ならびに安全な行事運営を目的として、校内における撮影・録音およびインターネット上への公開について厳格なガイドラインを定めております。
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-wafuu-sumi border-b border-wafuu-sumi/10 pb-2">
                    1. 校内における撮影許可範囲について
                  </h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>校内での写真および動画撮影は、<strong>ご来場者様ご自身の私的鑑賞・記念記録の範囲内</strong>に限定いたします。</li>
                    <li>更衣室、トイレ、バックヤード、休憩スペース、および撮影禁止の掲示がある展示・ステージ企画内での撮影は固くお断りいたします。</li>
                    <li>三脚、一脚、ジンバル、自撮り棒等の補助機材を使用した撮影は、通路等の混雑・事故防止のため全面禁止とさせていただきます。</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-wafuu-sumi border-b border-wafuu-sumi/10 pb-2">
                    2. インターネット・SNSへの無断掲載・公開の禁止
                  </h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>本校生徒、教職員、および他のご来場者様の顔や名札等が識別できる写真・動画を、事前の明確な書面同意なくX(旧Twitter)、Instagram、TikTok、YouTube等の各種SNSやブログ、動画共有サイト等へ投稿・公開・ライブ配信することは、プライバシーおよび肖像権の重大な侵害として固く禁止いたします。</strong></li>
                    <li>記念撮影をSNSへ掲載される際は、必ず対象者以外の人物にモザイク・ぼかし等の加工を施し、個人が特定できない状態であることをご確認の上行ってください。</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-wafuu-sumi border-b border-wafuu-sumi/10 pb-2">
                    3. 著作権保護と違反時の措置
                  </h4>
                  <p>
                    各クラス・部活動が手掛けた展示制作物、ポスター原画デザイン、およびステージパフォーマンスの演出・楽曲使用等は著作権法によって保護されています。営利目的の撮影・複写・販売等は厳禁です。
                    上記指針に違反する行為や、不審な撮影行為を確認した場合、実行委員会役員または教職員がお声がけし、<strong>データの削除確認および退場措置</strong>をとらせていただく場合がございます。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. プライバシーポリシー */}
          {activeSection === 'privacy' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-wafuu-sumi/15 pb-5">
                <span className="text-xs font-mono font-bold text-wafuu-kincha block">PRIVACY POLICY</span>
                <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1">
                  個人情報保護方針 (Privacy Policy)
                </h2>
              </div>

              <div className="space-y-6 text-sm sm:text-base font-sans">
                <p>
                  2026年度なずな祭実行委員会（以下「当委員会」）は、当公式サイトにおけるユーザーの個人情報保護について、「個人情報の保護に関する法律」および関連法令を遵守し、以下の通り厳格に管理いたします。
                </p>
                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-wafuu-sumi border-b border-wafuu-sumi/10 pb-2">1. 取得する情報および利用目的</h4>
                  <p>当公式サイトでのお問い合わせや遺失物照会時等においてご提供いただいた氏名、連絡先（メールアドレス等）の個人情報は、お問い合わせへの回答、行事運営に関する安全連絡のみに利用し、目的外利用は一切行いません。</p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-wafuu-sumi border-b border-wafuu-sumi/10 pb-2">2. 第三者提供の制限</h4>
                  <p>当委員会は、法令に基づく場合または生命・身体・財産の保護のために緊急の必要がある場合を除き、ご本人の同意を得ることなく第三者に個人情報を提供いたしません。</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. サイトポリシー */}
          {activeSection === 'sitepolicy' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-wafuu-sumi/15 pb-5">
                <span className="text-xs font-mono font-bold text-wafuu-ai block">SITE POLICY & TERMS</span>
                <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1">
                  サイトポリシー ＆ 免責事項
                </h2>
              </div>

              <div className="space-y-6 text-sm sm:text-base font-sans">
                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-wafuu-sumi border-b border-wafuu-sumi/10 pb-2">1. 著作権および知的財産権</h4>
                  <p>当公式サイトに掲載されている全コンテンツ（ポスター原画、和紙イラスト、テキスト、SVG意匠、プログラム等）の著作権は、2026年度なずな祭実行委員会および市川中学校・高等学校に帰属します。私的利用以外の複製・転載を禁止します。</p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-wafuu-sumi border-b border-wafuu-sumi/10 pb-2">2. 免責事項</h4>
                  <p>当委員会は、当サイトの正確性・安全性について万全を期しておりますが、天候や不測の事態により予告なく企画内容・タイムテーブル・開催形態が変更または中止となる場合があります。当サイトの利用または変更・中断等により生じたいかなる損害についても責任を負いません。</p>
                </div>
              </div>
            </div>
          )}

          {/* 4. サイトマップ */}
          {activeSection === 'sitemap' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-wafuu-sumi/15 pb-5">
                <span className="text-xs font-mono font-bold text-wafuu-sumi block">SITE MAP</span>
                <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1">
                  サイトマップ （全ページ目次）
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 font-sans text-sm">
                <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-wafuu-ekasumi/40 space-y-3">
                  <h4 className="font-bold text-lg font-serif border-b pb-2">メインポータル</h4>
                  <ul className="space-y-2">
                    <li><button onClick={() => onNavigateTab && onNavigateTab('home')} className="hover:text-wafuu-shu font-bold">・ トップページ（百輝夜行ポータル）</button></li>
                    <li><button onClick={() => onNavigateTab && onNavigateTab('timetable')} className="hover:text-wafuu-shu font-bold">・ ステージタイムテーブル</button></li>
                    <li><button onClick={() => onNavigateTab && onNavigateTab('info')} className="hover:text-wafuu-shu font-bold">・ テーマ「百輝夜行」公式ストーリー</button></li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-wafuu-ekasumi/40 space-y-3">
                  <h4 className="font-bold text-lg font-serif border-b pb-2">ご案内・規約</h4>
                  <ul className="space-y-2">
                    <li><button onClick={() => onNavigateTab && onNavigateTab('guidance')} className="hover:text-wafuu-shu font-bold">・ 総合案内所・ご来場ガイド</button></li>
                    <li><button onClick={() => setActiveSection('filming-guidelines')} className="hover:text-wafuu-shu font-bold">・ なずな祭に関する情報指針</button></li>
                    <li><button onClick={() => setActiveSection('privacy')} className="hover:text-wafuu-shu font-bold">・ プライバシーポリシー</button></li>
                    <li><button onClick={() => setActiveSection('sitepolicy')} className="hover:text-wafuu-shu font-bold">・ サイトポリシー</button></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* フッターアクション */}
          <div className="pt-8 border-t border-wafuu-sumi/15 flex justify-center">
            <button
              onClick={() => onNavigateTab && onNavigateTab('home')}
              className="px-8 py-4 rounded-2xl bg-wafuu-sumi text-white hover:bg-wafuu-shu transition-colors font-bold flex items-center gap-2 shadow-md"
            >
              <span>トップページへ戻る</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
