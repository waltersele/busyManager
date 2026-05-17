import tls from 'node:tls';

export interface SslCheckResult {
  ssl_ok: boolean;
  ssl_expires_at: string | null;
  ssl_days_remaining: number | null;
  ssl_error?: string;
}

export async function checkSsl(url: string): Promise<SslCheckResult> {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return { ssl_ok: true, ssl_expires_at: null, ssl_days_remaining: null };
    }

    const host = parsed.hostname;
    const port = parsed.port ? Number(parsed.port) : 443;

    return await new Promise((resolve) => {
      const socket = tls.connect(
        { host, port, servername: host, rejectUnauthorized: false },
        () => {
          const cert = socket.getPeerCertificate();
          socket.end();

          if (!cert?.valid_to) {
            resolve({
              ssl_ok: false,
              ssl_expires_at: null,
              ssl_days_remaining: null,
              ssl_error: 'certificado no disponible',
            });
            return;
          }

          const expires = new Date(cert.valid_to);
          const days = Math.floor((expires.getTime() - Date.now()) / 86_400_000);
          resolve({
            ssl_ok: days > 0,
            ssl_expires_at: expires.toISOString(),
            ssl_days_remaining: days,
          });
        },
      );

      socket.setTimeout(15_000, () => {
        socket.destroy();
        resolve({
          ssl_ok: false,
          ssl_expires_at: null,
          ssl_days_remaining: null,
          ssl_error: 'timeout SSL',
        });
      });

      socket.on('error', (err) => {
        resolve({
          ssl_ok: false,
          ssl_expires_at: null,
          ssl_days_remaining: null,
          ssl_error: err.message,
        });
      });
    });
  } catch (e) {
    return {
      ssl_ok: false,
      ssl_expires_at: null,
      ssl_days_remaining: null,
      ssl_error: e instanceof Error ? e.message : 'URL inválida',
    };
  }
}
