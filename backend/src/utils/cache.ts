interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Salva un dato in cache
   * @param key - Chiave univoca
   * @param data - Dato da salvare
   * @param ttlSeconds - Tempo di vita in secondi (default: 5 minuti)
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
    console.log(`📦 Cache SET: ${key} (TTL: ${ttlSeconds}s)`);
  }

  /**
   * Recupera un dato dalla cache
   * @param key - Chiave univoca
   * @returns Il dato se presente e valido, null altrimenti
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      console.log(`❌ Cache MISS: ${key}`);
      return null;
    }

    // Verifica se è scaduto
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      console.log(`⏰ Cache EXPIRED: ${key}`);
      return null;
    }

    console.log(`✅ Cache HIT: ${key}`);
    return entry.data as T;
  }

  /**
   * Pulisce tutta la cache
   */
  clear(): void {
    this.cache.clear();
    console.log("🗑️ Cache cleared");
  }

  /**
   * Pulisce le chiavi che iniziano con un prefisso
   * @param prefix - Prefisso da cercare
   */
  clearByPrefix(prefix: string): void {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    console.log(`🗑️ Cache cleared: ${count} entries with prefix "${prefix}"`);
  }

  /**
   * Ritorna info sulla cache
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const cache = new SimpleCache();

// Pulizia automatica ogni 10 minuti
setInterval(() => {
  console.log("🧹 Running cache cleanup...");
  const stats = cache.getStats();
  console.log(`📊 Cache stats: ${stats.size} entries`);

  // Forza rivalidazione di tutte le chiavi
  stats.keys.forEach((key) => {
    cache.get(key); // Questo rimuove le entry scadute
  });
}, 10 * 60 * 1000);
