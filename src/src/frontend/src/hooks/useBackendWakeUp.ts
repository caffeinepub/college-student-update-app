import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "./useActor";

/**
 * Sends a lightweight ping to wake up the backend canister
 * before the user tries to login/register.
 *
 * On free hosting the canister may be in a "cold" state — the first
 * call can take 5–15 s.  Pinging early means the real login request
 * arrives while the canister is already warm.
 */
export function useBackendWakeUp() {
  const { actor } = useActor();
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const wakeAttemptRef = useRef(0);
  const hasPingedRef = useRef(false);

  // Auto-ping as soon as actor is available
  useEffect(() => {
    if (!actor || hasPingedRef.current) return;
    hasPingedRef.current = true;
    setIsWakingUp(true);
    // Try up to 3 times on page load to warm the canister
    const tryPing = async (attempts: number) => {
      for (let i = 0; i < attempts; i++) {
        try {
          await actor.getCallerUserRole();
          setIsAwake(true);
          setIsWakingUp(false);
          return;
        } catch {
          if (i < attempts - 1) {
            await new Promise((r) => setTimeout(r, 3000));
          }
        }
      }
      setIsWakingUp(false);
    };
    tryPing(3);
  }, [actor]);

  /**
   * Call this right before a login or register request.
   * Returns `true` when the backend responds (any response counts as awake).
   * Retries up to `maxRetries` times with a delay between each attempt.
   */
  const ensureAwake = useCallback(
    async (maxRetries = 4, delayMs = 2500): Promise<boolean> => {
      if (!actor) return false;
      if (isAwake) return true;

      setIsWakingUp(true);
      for (let i = 0; i <= maxRetries; i++) {
        wakeAttemptRef.current = i + 1;
        try {
          await actor.getCallerUserRole();
          setIsAwake(true);
          setIsWakingUp(false);
          return true;
        } catch {
          if (i < maxRetries) {
            await new Promise((r) => setTimeout(r, delayMs));
          }
        }
      }
      setIsWakingUp(false);
      return false; // backend did not respond — caller decides what to do
    },
    [actor, isAwake],
  );

  return {
    isWakingUp,
    isAwake,
    ensureAwake,
    wakeAttempt: wakeAttemptRef.current,
  };
}
