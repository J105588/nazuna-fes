import type { VotePyramidData, InventoryStatus } from '../types/database';

const GAS_API_URL = import.meta.env.VITE_GAS_PYRAMID_API || 'https://mock-gas.nazuna.jp/pyramid';
const EXTERNAL_MAP_BASE = import.meta.env.VITE_EXTERNAL_MAP_URL || 'https://map.nazuna.jp/campus';
const INVENTORY_API_BASE = import.meta.env.VITE_INVENTORY_API || 'https://inventory.nazuna.jp/api';

// モックの投票ピラミッドデータ
const mockPyramidData: Record<string, VotePyramidData> = {
  'org-1': { class_id: 'org-1', rank: 1, total_votes: 342, pyramid_tier: 'gold' },
  'org-2': { class_id: 'org-2', rank: 3, total_votes: 218, pyramid_tier: 'silver' },
  'org-3': { class_id: 'org-3', rank: 5, total_votes: 189, pyramid_tier: 'bronze' },
  'org-4': { class_id: 'org-4', rank: 8, total_votes: 140, pyramid_tier: 'normal' },
  'org-5': { class_id: 'org-5', rank: 2, total_votes: 310, pyramid_tier: 'gold' }
};

export async function fetchVotePyramid(orgId: string): Promise<VotePyramidData> {
  // 実サーバー環境変数が設定されている場合のみ外部フェッチ
  if (import.meta.env.VITE_USE_REAL_API === 'true') {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      const response = await fetch(`${GAS_API_URL}?orgId=${encodeURIComponent(orgId)}`, {
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // フォールバック
    }
  }
  
  // デモ・ローカル環境：即時クリーンにモックデータを返却 (ネットワークエラー防止)
  return mockPyramidData[orgId] || {
    class_id: orgId,
    rank: 12,
    total_votes: 85,
    pyramid_tier: 'normal'
  };
}

export async function fetchInventoryStatus(orgId: string): Promise<InventoryStatus> {
  // 実サーバー環境変数が設定されている場合のみ外部フェッチ
  if (import.meta.env.VITE_USE_REAL_API === 'true') {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${INVENTORY_API_BASE}/status/${orgId}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        return data.status as InventoryStatus;
      }
    } catch {
      // フォールバック
    }
  }
  
  // モック・スタンドアロン時のリアルタイム状況返却
  if (orgId === 'org-2') return 'STATUS_FEW';
  if (orgId === 'org-3') return 'STATUS_SOLD_OUT';
  return 'STATUS_AVAILABLE';
}

export function openExternalMap(roomCode: string, floorInfo: string) {
  const url = `${EXTERNAL_MAP_BASE}?room=${encodeURIComponent(roomCode)}&floor=${encodeURIComponent(floorInfo)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openGoogleFormVote(orgId: string, orgName: string) {
  const formUrl = `https://docs.google.com/forms/d/e/mock-form-id/viewform?usp=pp_url&entry.100001=${encodeURIComponent(orgId)}&entry.100002=${encodeURIComponent(orgName)}`;
  window.open(formUrl, '_blank', 'noopener,noreferrer');
}
