import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            inset: 32,
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 12,
          }}
        />

        {/* Ball */}
        <div style={{ fontSize: 90, lineHeight: 1 }}>⚽</div>

        {/* H14 */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#C9A84C',
            letterSpacing: '-4px',
            lineHeight: 1,
          }}
        >
          H14
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '-0.5px',
          }}
        >
          Mundial FIFA · Hangar 14
        </div>

        {/* Date */}
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
          }}
        >
          3 de Julio · 2025
        </div>
      </div>
    ),
    { ...size }
  );
}
