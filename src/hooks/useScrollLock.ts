import { useEffect, useRef } from 'react';

/*
  ========================================================================
  useScrollLock - 任意のモーダル内で背景スクロールを完璧に抑止するフック
  ========================================================================
  iOS Safari / Android / PCブラウザすべてにおいて、モーダル展開時の
  背景スクロール（裏移りスクロールやオーバースクロール・バウンス）を完全にロックします。
  position: fixed ＋ top 固定とスクロールバー幅補正によるガタつき防止を兼備。
*/

export const useScrollLock = (isOpen: boolean) => {
  const savedScrollYRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      savedScrollYRef.current = window.scrollY || window.pageYOffset;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';

      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      if (document.body.style.position === 'fixed') {
        document.documentElement.style.overflow = '';
        document.documentElement.style.overscrollBehavior = '';
        document.body.style.overflow = '';
        document.body.style.overscrollBehavior = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, savedScrollYRef.current);
      }
    }

    return () => {
      if (document.body.style.position === 'fixed') {
        document.documentElement.style.overflow = '';
        document.documentElement.style.overscrollBehavior = '';
        document.body.style.overflow = '';
        document.body.style.overscrollBehavior = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, savedScrollYRef.current);
      }
    };
  }, [isOpen]);
};
