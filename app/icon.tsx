import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          gap: 1,
        }}
      >
        <span style={{ fontSize: 9, lineHeight: 1 }}>⚽</span>
        <span
          style={{
            color: '#C9A84C',
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: '-0.5px',
            fontFamily: 'sans-serif',
            lineHeight: 1,
          }}
        >
          H14
        </span>
      </div>
    ),
    { ...size }
  );
}
