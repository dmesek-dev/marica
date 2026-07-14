import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const asset = (name) => fileURLToPath(new URL(`./${name}`, import.meta.url));

// Static metadata for the generated image (used by Next for og:image / twitter:image).
export const alt = 'Marica slavi 360 mjeseci — 29.8.2026.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Bundled assets (colocated so they are traced into the serverless build).
const girlData = readFileSync(asset('marica-cutout-v3.png'));
const girlSrc = `data:image/png;base64,${girlData.toString('base64')}`;
const bagelFont = readFileSync(asset('BagelFatOne.ttf'));

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 70px',
          background:
            'radial-gradient(circle at 12% 12%, #FF6A00 0%, transparent 42%),' +
            'radial-gradient(circle at 88% 20%, #FFB800 0%, transparent 45%),' +
            'linear-gradient(150deg, #FF9500 0%, #A45CD0 100%)',
          fontFamily: 'Bagel Fat One',
        }}
      >
        {/* Left: title + details */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.05,
              color: '#FFE600',
              textShadow: '0 6px 0 rgba(120,45,0,.35)',
            }}
          >
            Marica slavi
          </div>
          <div
            style={{
              fontSize: 118,
              lineHeight: 1.0,
              color: '#FFE600',
              textShadow: '0 6px 0 rgba(120,45,0,.35)',
            }}
          >
            360 mjeseci
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 34,
              padding: '16px 30px',
              background: 'rgba(146,78,190,.95)',
              border: '4px dashed #FFE600',
              borderRadius: 22,
              color: '#ffffff',
              fontSize: 34,
              fontFamily: 'Bagel Fat One',
            }}
          >
            29.8.2026. · 21h · Downstairs
          </div>
        </div>

        {/* Right: the girl + a disco ball */}
        <div
          style={{
            display: 'flex',
            position: 'relative',
            width: 470,
            height: 560,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          {/* Big disco ball floating above/behind the girl */}
          <div
            style={{
              position: 'absolute',
              top: -6,
              right: 6,
              fontSize: 190,
              filter: 'drop-shadow(0 14px 22px rgba(120,45,0,.4))',
            }}
          >
            🪩
          </div>
          {/* Small twinkle */}
          <div style={{ position: 'absolute', bottom: 40, left: 6, fontSize: 78 }}>🪩</div>

          <img
            src={girlSrc}
            width={430}
            height={529}
            style={{ objectFit: 'contain', transform: 'rotate(3deg)' }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Bagel Fat One',
          data: bagelFont,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );
}
