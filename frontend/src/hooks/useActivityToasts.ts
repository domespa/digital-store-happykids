import { useState, useEffect, useRef } from "react";

import {
  CONNECTION_MESSAGES,
  CART_MESSAGES,
  PURCHASE_MESSAGES,
  VIEW_MESSAGES,
  STAT_MESSAGES,
  COMMUNITY_MESSAGES,
  generateMessage,
  getRandomMessage,
  getRandomCity,
  getRandomCount,
  type ActivityMessage,
} from "./activityMessages";

// ============================================
//       CONFIGURATION
// ============================================

const TOAST_CONFIG = {
  enabled: true,
  maxToastsPerSession: 5,
  minInterval: 60000, // 60 secondi
  maxInterval: 90000, // 90 secondi
  duration: 5000, // 5 secondi show
  adhdFriendly: true,
  realEventPriority: true,
};

// ============================================
//       TYPES
// ============================================

interface ToastData {
  id: string;
  message: string;
  icon: string;
  timestamp: number;
}

interface ActivityEventData {
  city?: string;
  name?: string;
  product?: string;
  count?: number;
}

// ============================================
//       HOOK
// ============================================

export const useActivityToasts = () => {
  const [currentToast, setCurrentToast] = useState<ToastData | null>(null);
  const [toastCount, setToastCount] = useState(0);
  const lastToastTime = useRef<number>(0);
  const scheduledTimer = useRef<NodeJS.Timeout | null>(null);
  const hasRealEvent = useRef<boolean>(false);

  // MOSTRA TOAST
  const showToast = (message: string, icon: string) => {
    const now = Date.now();
    const timeSinceLastToast = now - lastToastTime.current;

    // Check max toasts per session
    if (toastCount >= TOAST_CONFIG.maxToastsPerSession) {
      console.log("🔕 Max toasts reached for this session");
      return;
    }

    // Check min interval
    if (timeSinceLastToast < TOAST_CONFIG.minInterval) {
      console.log("⏱️ Toast interval too short, skipping");
      return;
    }

    const toast: ToastData = {
      id: `toast-${now}`,
      message,
      icon,
      timestamp: now,
    };

    console.log("🎯 Showing toast:", message);
    setCurrentToast(toast);
    setToastCount((prev) => prev + 1);
    lastToastTime.current = now;
  };

  // CHIUDI TOAST
  const closeToast = () => {
    setCurrentToast(null);
  };

  // ============================================
  //       LAYER 1: REAL WEBSOCKET EVENTS
  // ============================================

  //   useEffect(() => {
  //     // Listener per eventi real-time dal WebSocket
  //     const handleUserConnected = (data: any) => {
  //       if (!TOAST_CONFIG.enabled) return;

  //       console.log("📡 Real event: user_connected", data);
  //       hasRealEvent.current = true;

  //       const message = getRandomMessage(CONNECTION_MESSAGES);
  //       const generatedMessage = generateMessage(message, {
  //         city: data.location?.city || data.city,
  //         name: data.name,
  //       });

  //       showToast(generatedMessage, message.icon);
  //     };

  //     const handleCartActivity = (data: any) => {
  //       if (!TOAST_CONFIG.enabled) return;

  //       console.log("📡 Real event: cart_activity", data);
  //       hasRealEvent.current = true;

  //       const message = getRandomMessage(CART_MESSAGES);
  //       const generatedMessage = generateMessage(message, {
  //         city: data.city,
  //         product: data.product,
  //       });

  //       showToast(generatedMessage, message.icon);
  //     };

  //     const handlePurchase = (data: any) => {
  //       if (!TOAST_CONFIG.enabled) return;

  //       console.log("📡 Real event: purchase", data);
  //       hasRealEvent.current = true;

  //       const message = getRandomMessage(PURCHASE_MESSAGES);
  //       const generatedMessage = generateMessage(message, {
  //         city: data.city,
  //         product: data.product,
  //       });

  //       showToast(generatedMessage, message.icon);
  //     };

  //     // TODO: Quando backend supporta questi eventi, decommentare
  //     // const socket = locationWebSocketService.socket;
  //     // socket?.on('user_connected', handleUserConnected);
  //     // socket?.on('cart_activity', handleCartActivity);
  //     // socket?.on('purchase', handlePurchase);

  //     return () => {
  //       // socket?.off('user_connected', handleUserConnected);
  //       // socket?.off('cart_activity', handleCartActivity);
  //       // socket?.off('purchase', handlePurchase);
  //     };
  //   }, []);

  // ============================================
  //       LAYER 2+3+4: SCHEDULED TOASTS
  // ============================================

  useEffect(() => {
    if (!TOAST_CONFIG.enabled) return;

    const scheduleNextToast = () => {
      // Cancella timer precedente
      if (scheduledTimer.current) {
        clearTimeout(scheduledTimer.current);
      }

      // Se raggiunto max, stop
      if (toastCount >= TOAST_CONFIG.maxToastsPerSession) {
        console.log("🔕 Max toasts reached, stopping scheduler");
        return;
      }

      // Random interval tra min e max
      const randomInterval =
        Math.random() * (TOAST_CONFIG.maxInterval - TOAST_CONFIG.minInterval) +
        TOAST_CONFIG.minInterval;

      scheduledTimer.current = setTimeout(() => {
        generateScheduledToast();
        scheduleNextToast();
      }, randomInterval);

      console.log(
        `⏰ Next toast scheduled in ${Math.round(randomInterval / 1000)}s`
      );
    };

    const generateScheduledToast = () => {
      // Se ci sono stati eventi real recentemente, priorità bassa ai fake
      const timeSinceLastReal = Date.now() - lastToastTime.current;
      if (hasRealEvent.current && timeSinceLastReal < 120000) {
        // 2 min
        console.log("⏸️ Skipping fake toast - real event recent");
        hasRealEvent.current = false;
        return;
      }

      // STRATEGIA MIX: 40% DB Stats, 30% View, 30% Community
      const rand = Math.random();

      let message: ActivityMessage;
      let data: ActivityEventData = {};

      if (rand < 0.4) {
        // 40% - Database Stats (simulati per ora)
        message = getRandomMessage(STAT_MESSAGES);
        data = {
          count: getRandomCount(50, 150), // Numeri credibili
        };
        console.log("📊 Generated: DB stat toast");
      } else if (rand < 0.7) {
        // 30% - View Activity
        message = getRandomMessage(VIEW_MESSAGES);
        data = {
          city: getRandomCity(),
          count: getRandomCount(2, 5),
        };
        console.log("👀 Generated: View toast");
      } else {
        // 30% - Community
        message = getRandomMessage(COMMUNITY_MESSAGES);
        console.log("💜 Generated: Community toast");
      }

      const generatedMessage = generateMessage(message, data);
      showToast(generatedMessage, message.icon);
    };

    // Aspetta 10-20 secondi prima del primo toast
    const initialDelay = Math.random() * 10000 + 10000;

    const initialTimer = setTimeout(() => {
      generateScheduledToast();
      scheduleNextToast();
    }, initialDelay);

    console.log(`🎬 First toast in ${Math.round(initialDelay / 1000)} seconds`);

    return () => {
      clearTimeout(initialTimer);
      if (scheduledTimer.current) {
        clearTimeout(scheduledTimer.current);
      }
    };
  }, [toastCount]);

  // ============================================
  //       PUBLIC API
  // ============================================

  return {
    currentToast,
    closeToast,
    toastCount,
    maxToasts: TOAST_CONFIG.maxToastsPerSession,
    canShowMore: toastCount < TOAST_CONFIG.maxToastsPerSession,
  };
};

// ============================================
//       HELPER: MANUAL TRIGGER
// ============================================

// Funzione helper per triggare manualmente un toast (per testing)
export const triggerActivityToast = (
  type: "connection" | "cart" | "purchase" | "view" | "stat" | "community",
  data?: ActivityEventData
) => {
  const messageMap = {
    connection: CONNECTION_MESSAGES,
    cart: CART_MESSAGES,
    purchase: PURCHASE_MESSAGES,
    view: VIEW_MESSAGES,
    stat: STAT_MESSAGES,
    community: COMMUNITY_MESSAGES,
  };

  const messages = messageMap[type];
  const message = getRandomMessage(messages);
  const generatedMessage = generateMessage(message, data);

  return {
    message: generatedMessage,
    icon: message.icon,
  };
};
