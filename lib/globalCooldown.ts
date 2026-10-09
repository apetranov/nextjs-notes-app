// @/lib/globalCooldown.ts

type CooldownListener = (cooldown: number) => void;

let globalCooldown = 0;
let timerInterval: NodeJS.Timeout | null = null;
const listeners = new Set<CooldownListener>();

export const getGlobalCooldown = () => globalCooldown;

export const subscribeToGlobalCooldown = (listener: CooldownListener) => {
  listeners.add(listener);
  // Emit initial value straight away
  listener(globalCooldown); 
  
  return () => {
    listeners.delete(listener);
  };
};

export const startGlobalCooldown = (seconds: number) => {
  globalCooldown = seconds;
  listeners.forEach((l) => l(globalCooldown));

  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    globalCooldown -= 1;
    listeners.forEach((l) => l(globalCooldown));

    if (globalCooldown <= 0) {
      if (timerInterval) clearInterval(timerInterval);
      globalCooldown = 0;
    }
  }, 1000);
};
