import crypto from "crypto";
import { prisma } from "./prisma";
import type { Visitor } from "@prisma/client";

interface VisitorData {
  ipAddress: string | null;
  userAgent: string | null;
  sessionToken?: string;
}

interface VisitorResult {
  visitorId: string;
  visitorNumber: number;
  isNew: boolean;
}

/**
 * Generate unique fingerprint for visitor identification
 */
export function generateVisitorFingerprint(data: VisitorData): string {
  // Use sessionToken if available (unique per browser tab)
  if (data.sessionToken) {
    const fingerprintData = `${data.sessionToken}`;
    return crypto.createHash("md5").update(fingerprintData).digest("hex");
  }

  // Use IP + UserAgent (for browsers without sessionStorage)
  const fingerprintData = `${data.ipAddress || "unknown"}_${data.userAgent || "unknown"}`;
  return crypto.createHash("md5").update(fingerprintData).digest("hex");
}

/**
 * Get existing visitor or create new one with progressive number
 */
export async function getOrCreateVisitor(
  fingerprint: string,
): Promise<VisitorResult> {
  const visitor = await prisma.visitor.upsert({
    where: { fingerprint },
    update: {
      lastSeen: new Date(),
      totalVisits: { increment: 1 },
    },
    create: {
      fingerprint,
      firstSeen: new Date(),
      lastSeen: new Date(),
      totalVisits: 1,
    },
  });

  return {
    visitorId: visitor.id,
    visitorNumber: visitor.visitorNumber,
    isNew: visitor.totalVisits === 1,
  };
}

/**
 * Update visitor location information
 */
export async function updateVisitorLocation(
  visitorId: string,
  location: {
    country: string;
    city: string;
    region: string;
    countryCode: string;
  },
): Promise<void> {
  await prisma.visitor.update({
    where: { id: visitorId },
    data: {
      lastCountry: location.country,
      lastCity: location.city,
      lastRegion: location.region,
      lastCountryCode: location.countryCode,
    },
  });
}
