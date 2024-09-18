import { COLORS } from '@/constant/colors';
import { headers } from 'next/headers';
import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/svg+xml';

// Image generation
export default function Icon() {
  const color = headers()
    .get('cookie')
    ?.split(';')
    .find(cookie => cookie.includes('__color'));

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: `hsl(${color?.split('=')[1] ?? COLORS[0]})`,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6v12" />
          <path d="M17.196 9 6.804 15" />
          <path d="m6.804 9 10.392 6" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
