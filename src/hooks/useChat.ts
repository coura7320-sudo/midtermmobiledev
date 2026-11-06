import { useChat as useChatCtx } from '@/context/ChatContext';

export function useChat() {
  return useChatCtx();
}
