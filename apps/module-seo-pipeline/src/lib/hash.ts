import { createHash } from 'crypto';

/** Hash SHA-256 del contenido exacto a publicar (auditoría). */
export function contentHashSha256(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}
