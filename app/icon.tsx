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
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
        }}
      >
        <span
          style={{
            color: '#C9A84C',
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: '-0.5px',
            fontFamily: 'sans-serif',
          }}
        >
          H14
        </span>
      </div>
    ),
    { ...size }
  );
}
