import { useCallback } from 'react';
import { useCountdown } from 'usehooks-ts';
import { useEventListener } from '../../lib/hooks/use-event-listener';
import { usePrevious } from '../../lib/hooks/use-previous';
import CustomButton from './CustomButton';

export interface LoadMoreProps {
  currentSize?: number;
  first?: number;
  last?: number;
  onLoadMore: ({ offset, cursor }: { offset: number; cursor: number }) => void;
}

export default function LoadMore({ first, last, currentSize = 0, onLoadMore }: LoadMoreProps) {
  const prevSize = usePrevious(currentSize);
  const fetchedSize = currentSize - (prevSize ?? 0);
  const noMore = fetchedSize < 10;
  const [count, { startCountdown, resetCountdown }] = useCountdown({ countStart: 15 });
  const showNoMore = window.scrollY >= window.innerHeight / 2;

  const handleScrollToBottom = useCallback(() => {
    if (noMore) startCountdown();
    if (last && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight && count === 0) {
      onLoadMore({ offset: 1, cursor: last });
      resetCountdown();
      startCountdown();
    }
  }, [onLoadMore, last, count, noMore, resetCountdown, startCountdown]);

  useEventListener('scroll', handleScrollToBottom);
  return (
    <nav className='flex mt-4'>
      {showNoMore && (
        <CustomButton color='secondary' outlined size='s' disabled>
          No More
        </CustomButton>
      )}
    </nav>
  );
}
