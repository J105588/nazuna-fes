import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { TimetablePage } from './pages/TimetablePage';
import { SchoolInfoPage } from './pages/SchoolInfoPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { AdminPage } from './pages/AdminPage';
import { CampusNavModal } from './components/common/CampusNavModal';
import { ShojiOpening } from './components/intro/ShojiOpening';
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

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'timetable' | 'info' | 'lostfound' | 'admin'>('home');
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const [isShojiFinished, setIsShojiFinished] = useState(false);

  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [timetableEvents, setTimetableEvents] = useState<TimetableEvent[]>(mockTimetableEvents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [lostItems, setLostItems] = useState<LostItem[]>(mockLostItems);

  const [genreQuick, setGenreQuick] = useState<string>('all');
  const [stageQuick, setStageQuick] = useState<string>('gym');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    // 初回マウント時にSupabase DBから正確に動的取得（フロントエンド内には事前データを保持しない）
    async function loadFromDB() {
      const orgs = await fetchOrganizationsFromDB();
      const evts = await fetchTimetableEventsFromDB();
      const anns = await fetchAnnouncementsFromDB();
      const losts = await fetchLostItemsFromDB();
      setOrganizations([...orgs]);
      setTimetableEvents([...evts]);
      setAnnouncements([...anns]);
      setLostItems([...losts]);
    }
    loadFromDB();

    const unsubscribe = subscribeToDataChanges(() => {
      setOrganizations([...mockOrganizations]);
      setTimetableEvents([...mockTimetableEvents]);
      setAnnouncements([...mockAnnouncements]);
      setLostItems([...mockLostItems]);
    });
    return () => unsubscribe();
  }, []);

  // ★重要★: 演出中（障子開閉からポスター霧演出が完了するまで）はスクロールを完全ブロックし最上部に固定
  useEffect(() => {
    if (currentTab === 'home' && (!isShojiFinished || !isIntroFinished)) {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [currentTab, isShojiFinished, isIntroFinished]);

  return (
    <div className="min-h-screen bg-wafuu-kinari text-wafuu-sumi selection:bg-wafuu-shu selection:text-white">
      {/* 障子オープニング演出 */}
      {!isShojiFinished && (
        <ShojiOpening onComplete={() => setIsShojiFinished(true)} />
      )}
      {/* ナビゲーションバー (z-40 sticky / 演出完了時または別タブ時はメニューボタンを表示) */}
      <Navbar
        currentTab={currentTab}
        isIntroFinished={isIntroFinished || currentTab !== 'home'}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectGenreQuick={(genre) => {
          setGenreQuick(genre);
          setCurrentTab('home');
          setTimeout(() => {
            const el = document.getElementById('exhibition-index');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }}
        onSelectStageQuick={(stage) => {
          setStageQuick(stage);
          setCurrentTab('timetable');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReplayIntro={() => {
          setCurrentTab('home');
          setIsShojiFinished(false);
          setIsIntroFinished(false);
          setIntroKey((prev) => prev + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMapModal={() => setIsMapModalOpen(true)}
      />

      {/* メインコンテンツ */}
      {currentTab === 'home' && (
        <Home
          organizations={organizations}
          initialGenre={genreQuick}
          introKey={introKey}
          isShojiFinished={isShojiFinished}
          onIntroComplete={() => setIsIntroFinished(true)}
          onSelectTab={(tab) => {
            setCurrentTab(tab as 'timetable' | 'info');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
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
      {currentTab === 'admin' && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
          <AdminPage
            organizations={organizations}
            timetableEvents={timetableEvents}
            announcements={announcements}
            lostItems={lostItems}
          />
        </main>
      )}

      {/* 校内ナビゲーション＆安全ガイダンス モーダル */}
      <CampusNavModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        organizations={organizations}
      />

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default App;
