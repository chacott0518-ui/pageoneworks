'use client';

import { ComingSoonModal } from '@/components/ComingSoonModal';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** AI 에디터 전용 "준비 중" 안내 — 공통 ComingSoonModal 재사용 */
export function AiComingSoonModal({ open, onClose }: Props) {
  return (
    <ComingSoonModal
      open={open}
      onClose={onClose}
      eyebrow="PAGEONEWORKS · AI EDITOR"
      title="AI 에디터 업데이트 준비 중"
      description={
        <>
          더 정확하고 신뢰할 수 있는 답변을 제공하기 위해 기능을 개선하고 있습니다.
          <br />
          준비가 완료되면 다시 안내드리겠습니다.
        </>
      }
    />
  );
}
