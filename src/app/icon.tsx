import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const size = { width: 256, height: 256 };
export const contentType = 'image/png';

export default function Icon() {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'profil_resmim.jpg');
    const imageData = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageData.toString('base64')}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        >
          <img
            src={base64Image}
            alt="Eren Kalaycı Favicon"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ),
      { ...size }
    );
  } catch {
    // Fallback if image reading fails
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: '#0F1923',
            color: '#FF4655',
            fontSize: '128px',
            fontWeight: 'bold',
          }}
        >
          EK
        </div>
      ),
      { ...size }
    );
  }
}
