import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { TimetablePage } from './pages/TimetablePage';
import { SchoolInfoPage } from './pages/SchoolInfoPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { AdminPage } from './pages/AdminPage';
import { GuidanceDetailPage, type GuidanceSectionId } from './pages/GuidanceDetailPage';
import { PolicyPage, type PolicySectionId } from './pages/PolicyPage';
import { ExhibitionPage } from './pages/ExhibitionPage';
import { ShojiOpening } from './components/intro/ShojiOpening';
import { openExternalMap } from './lib/api';
import {
  mockOrganizations,
  mockTimetableEvents,
  mockAnnouncements,
  mockLostItems,
  fetchOrganizationsFromDB,
  fetchTimetableEventsFromDB,
  fetchAnnouncementsFromDB,
  fetchLostItemsFromDB,
  subscribeToDataChanges
} from './lib/supabase';
import type { Organization, TimetableEvent, Announcement, LostItem } from './types/database';

type TabId = 'home' | 'exhibitions' | 'timetable' | 'map' | 'info' | 'lostfound' | 'admin' | 'guidance' | 'policy';

function getTabFromUrl(): TabId {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase();
  const path = window.location.pathname.replace(/^\//, '').split('/')[0].toLowerCase();
  const target = hash || path;

  if (target === 'exhibitions' || target === 'exhibition' || target === 'kikaku') return 'exhibitions';
  if (target === 'timetable' || target === 'schedule') return 'timetable';
  if (target === 'map' || target === 'campusmap' || target === 'icompass') return 'map';
  if (target === 'info' || target === 'school' || target === 'about') return 'info';
  if (target === 'lostfound' || target === 'lost') return 'lostfound';
  if (target === 'admin' || target === 'dashboard' || target === 'login') return 'admin';
  if (target === 'guidance' || target === 'guide') return 'guidance';
  if (target === 'policy' || target === 'privacy') return 'policy';
  return 'home';
}

export const App: React.FC = () => {
  const [currentTab, setCurrentTabState] = useState<TabId>(() => {
    const initial = getTabFromUrl();
    if (initial === 'map') {
      // 初期ロード時にURLが#map等の場合は外部マップを開き、画面はホームを表示
      setTimeout(() => openExternalMap(), 100);
      return 'home';
    }
    return initial;
  });

  // 5時間（18,000,000ミリ秒）以内ならオープニング演出をスキップする判定
  const checkShouldSkipIntro = () => {
    try {
      const lastPlayed = localStorage.getItem('last_shoji_played_time');
      if (lastPlayed) {
        const diff = Date.now() - parseInt(lastPlayed, 10);
        if (diff < 5 * 60 * 60 * 1000) {
          return true;
        }
      }
    } catch {}
    return false;
  };

  const [isIntroFinished, setIsIntroFinished] = useState<boolean>(false);
  const [introKey] = useState(0);
  const [isShojiFinished, setIsShojiFinished] = useState<boolean>(() => checkShouldSkipIntro());

  // ページ切り替えとURL履歴 (window.history / window.location.hash) の同期
  const setCurrentTab = (tab: TabId) => {
    if (tab === 'map') {
      openExternalMap();
      return;
    }
    setCurrentTabState(tab);
    const currentHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (currentHash !== tab && !(tab === 'home' && !currentHash)) {
      if (tab === 'home') {
        window.history.pushState(null, '', window.location.pathname || '/');
      } else {
        window.history.pushState(null, '', `#${tab}`);
      }
    }
  };

  // ブラウザの「戻る・進む」や直接URLハッシュ変更の監視
  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentTabState(getTabFromUrl());
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [timetableEvents, setTimetableEvents] = useState<TimetableEvent[]>(mockTimetableEvents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [lostItems, setLostItems] = useState<LostItem[]>(mockLostItems);

  const [genreQuick, setGenreQuick] = useState<string>('all');
  const [stageQuick, setStageQuick] = useState<string>('gym');
  const [searchQueryQuick, setSearchQueryQuick] = useState<string>('');
  const [floorQuick, setFloorQuick] = useState<string>('all');

  // 専用ページ切り替え用の初期セクション記憶
  const [activeGuidanceSection, setActiveGuidanceSection] = useState<GuidanceSectionId>('precautions');
  const [activePolicySection, setActivePolicySection] = useState<PolicySectionId>('filming-guidelines');

  useEffect(() => {
    // 初回マウント時にSupabase DBから正確に動的取得
    async function loadFromDB() {
      const orgs = await fetchOrganizationsFromDB();
      const evts = await fetchTimetableEventsFromDB();
      const anns = await fetchAnnouncementsFromDB();
      const losts = await fetchLostItemsFromDB();

      if (orgs.length > 0) setOrganizations(orgs);
      if (evts.length > 0) setTimetableEvents(evts);
      if (anns.length > 0) setAnnouncements(anns);
      if (losts.length > 0) setLostItems(losts);
    }
    loadFromDB();

    const unsubscribe = subscribeToDataChanges(
      (newOrgs: Organization[]) => setOrganizations(newOrgs),
      (newEvts: TimetableEvent[]) => setTimetableEvents(newEvts),
      (newAnns: Announcement[]) => setAnnouncements(newAnns),
      (newLosts: LostItem[]) => setLostItems(newLosts)
    );

    return () => unsubscribe();
  }, []);

  // ジャンルクイック選択で独立企画一覧ページに移動
  const handleSelectGenreQuick = (genre: string) => {
    setGenreQuick(genre);
    if (currentTab !== 'exhibitions') {
      setCurrentTab('exhibitions');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ステージクイック選択でTimetableに移動
  const handleSelectStageQuick = (stage: string) => {
    setStageQuick(stage);
    if (currentTab !== 'timetable') {
      setCurrentTab('timetable');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentTab === 'admin') {
    return (
      <div className="admin-portal min-h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
        <AdminPage
          organizations={organizations}
          timetableEvents={timetableEvents}
          announcements={announcements}
          lostItems={lostItems}
          onNavigateHome={() => {
            setCurrentTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wafuu-kinari text-wafuu-sumi font-sans selection:bg-wafuu-shu selection:text-white flex flex-col justify-between">
      
      {/* 42層ポスター＆和紙・霧の障子オープニングアニメーション */}
      {!isShojiFinished && (
        <ShojiOpening
          onComplete={() => {
            setIsShojiFinished(true);
            try {
              localStorage.setItem('last_shoji_played_time', Date.now().toString());
            } catch {}
          }}
          key={introKey}
        />
      )}

      {/* モダン和風ナビゲーション */}
      <Navbar
        currentTab={currentTab}
        isIntroFinished={isIntroFinished}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectGenreQuick={handleSelectGenreQuick}
        onSelectStageQuick={handleSelectStageQuick}
        onOpenMapModal={() => {
          setCurrentTab('map');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* メインコンテンツ切り替え */}
      {currentTab === 'home' && (
        <Home
          organizations={organizations}
          announcements={announcements}
          initialGenre={genreQuick}
          introKey={introKey}
          isShojiFinished={isShojiFinished}
          isIntroFinished={isIntroFinished}
          onIntroComplete={() => {
            setIsIntroFinished(true);
            try {
              localStorage.setItem('last_shoji_played_time', Date.now().toString());
            } catch {}
          }}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateGuidancePage={(section) => {
            if (section === 'campus-map') {
              setCurrentTab('map');
            } else {
              setActiveGuidanceSection(section);
              setCurrentTab('guidance');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          onNavigatePolicyPage={(section) => {
            setActivePolicySection(section);
            setCurrentTab('policy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateExhibitionsPage={(query, genre, floor) => {
            setSearchQueryQuick(query);
            setGenreQuick(genre);
            setFloorQuick(floor);
            setCurrentTab('exhibitions');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
      {currentTab === 'exhibitions' && (
        <main className="w-full pt-20">
          <ExhibitionPage
            organizations={organizations}
            initialQuery={searchQueryQuick}
            initialGenre={genreQuick}
            initialFloor={floorQuick}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      )}
      {currentTab === 'timetable' && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
          <TimetablePage
            events={timetableEvents}
            initialStage={stageQuick as 'gym' | 'courtyard' | 'av_room'}
          />
        </main>
      )}
      {currentTab === 'info' && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
          <SchoolInfoPage />
        </main>
      )}
      {currentTab === 'lostfound' && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
          <LostFoundPage lostItems={lostItems} />
        </main>
      )}
      {currentTab === 'guidance' && (
        <main className="w-full">
          <GuidanceDetailPage
            initialSection={activeGuidanceSection}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        </main>
      )}
      {currentTab === 'policy' && (
        <main className="w-full">
          <PolicyPage
            initialSection={activePolicySection}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        </main>
      )}

      {/* フッター */}
      <Footer
        onNavigatePolicyPage={(section) => {
          setActivePolicySection(section);
          setCurrentTab('policy');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default App;
