import { QueryClient } from '@tanstack/react-query';
import type { Socket } from 'socket.io-client';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import type { LiveCallItem } from '@/features/live-calls/types/live-calls.types';

export const attachLiveCallsListeners = (
  socket: Socket,
  queryClient: QueryClient,
  restaurantId: number,
  onNewCallAlert: () => void
) => {
  const queryKey = QUERY_KEYS.liveCalls(restaurantId);

  const handleNewCall = (call: LiveCallItem) => {
    queryClient.setQueryData<LiveCallItem[]>(queryKey, (prev) => {
      if (!prev) return [call];
      if (prev.some((c) => c.id === call.id)) return prev;
      return [...prev, call];
    });
    onNewCallAlert();
  };

  const handleCallDismissed = (callId: string) => {
    queryClient.setQueryData<LiveCallItem[]>(queryKey, (prev) => 
      prev ? prev.filter((c) => c.id !== callId) : []
    );
  };

  socket.on('new_call', handleNewCall);
  socket.on('call_dismissed', handleCallDismissed);

  return () => {
    socket.off('new_call', handleNewCall);
    socket.off('call_dismissed', handleCallDismissed);
  };
};