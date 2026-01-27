import { Router } from "express";
import {
  trackEvent,
  trackConversion,
  getDashboardMetrics,
  getSessions,
  getSessionEvents,
} from "../controllers/landingAnalyticsController";

const router = Router();

// PUBLIC ROUTES
router.post("/track", trackEvent);
router.post("/convert", trackConversion);

// ADMIN ROUTES
router.get("/dashboard", getDashboardMetrics);
router.get("/sessions", getSessions);
router.get("/sessions/:sessionId/events", getSessionEvents);

export default router;
