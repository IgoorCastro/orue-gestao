interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    // Se não existe ou expirou, criar novo
    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(identifier, {
            count: 1,
            resetTime: now + windowMs,
        });
        return { success: true, remaining: maxAttempts - 1 };
    }

    // Se atingiu o limite
    if (entry.count >= maxAttempts) {
        const resetAfter = Math.ceil((entry.resetTime - now) / 1000);
        return { success: false, remaining: 0, resetAfter };
    }

    // Incrementar tentativa
    entry.count++;
    const remaining = maxAttempts - entry.count;
    return { success: true, remaining };
}

// Limpar map periodicamente (evitar memory leak)
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 60 * 1000); // Limpar a cada 1 minuto