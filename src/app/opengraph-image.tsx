import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Roadify — Find your learning path';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#030712',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            width: 80,
            height: 6,
            background: '#6366f1',
            borderRadius: 3,
            marginBottom: 32,
          }}
        />
        <div
          style={{
            color: 'white',
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: '-2px',
          }}
        >
          Roadify
        </div>
        <div style={{ color: '#94a3b8', fontSize: 32, marginTop: 20 }}>
          Find your learning path
        </div>
      </div>
    ),
    { ...size }
  );
}
