import QRCode from 'qrcode';
import { RenderOptions } from '@/features/qr-tables/types/tables.types';

export const drawStyledQr = async ({ canvas, url, patternType, logoOverlay, logoUrl, isDark }: RenderOptions): Promise<string> => {
  const fgColor = isDark ? '#FFFFFF' : '#1C1917';
  const bgColor = isDark ? '#100E0D' : '#FFFFFF';

  await QRCode.toCanvas(canvas, url, {
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: fgColor,
      light: bgColor
    }
  });

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const size = canvas.width;
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  const step = size / Math.round(size / 8.5);
  const dotRadius = step * 0.4;
  ctx.fillStyle = fgColor;

  for (let y = step; y < size - step; y += step) {
    for (let x = step; x < size - step; x += step) {
      const alphaIndex = (Math.floor(y) * size + Math.floor(x)) * 4 + 3;
      const rIndex = (Math.floor(y) * size + Math.floor(x)) * 4;

      if (data[alphaIndex] > 0 && data[rIndex] < 127) {
        const isFinderPattern = (x < size * 0.23 && y < size * 0.23) || 
                                (x > size * 0.77 && y < size * 0.23) || 
                                (x < size * 0.23 && y > size * 0.77);
        
        ctx.beginPath();
        if (isFinderPattern) {
          ctx.rect(x - step / 2, y - step / 2, step - 1, step - 1);
        } else if (patternType === 'dots') {
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        } else if (patternType === 'lines') {
          ctx.roundRect?.(x - step / 2 + 1, y - step / 2 + 2, step - 2, step - 4, 2);
        } else {
          ctx.rect(x - step / 2 + 0.5, y - step / 2 + 0.5, step - 1, step - 1);
        }
        ctx.fill();
      }
    }
  }

  if (logoOverlay) {
    const centerSize = size * 0.24;
    const cx = (size - centerSize) / 2;
    const cy = (size - centerSize) / 2;

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect?.(cx, cy, centerSize, centerSize, centerSize * 0.25);
    ctx.fill();

    if (logoUrl) {
      try {
        const img = await new Promise<HTMLImageElement | null>((resolve) => {
          const image = new window.Image();
          image.crossOrigin = 'anonymous';
          image.src = logoUrl;
          image.onload = () => resolve(image);
          image.onerror = () => resolve(null);
        });

        if (img) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect?.(cx + 3, cy + 3, centerSize - 6, centerSize - 6, (centerSize - 6) * 0.22);
          ctx.clip();
          ctx.drawImage(img, cx + 3, cy + 3, centerSize - 6, centerSize - 6);
          ctx.restore();
        } else {
          ctx.fillStyle = '#D4AF37';
          ctx.font = `bold ${centerSize * 0.45}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🍴', size / 2, size / 2);
        }
      } catch {
        ctx.fillStyle = '#D4AF37';
        ctx.font = `bold ${centerSize * 0.45}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍴', size / 2, size / 2);
      }
    } else {
      ctx.fillStyle = '#D4AF37';
      ctx.font = `bold ${centerSize * 0.45}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🍴', size / 2, size / 2);
    }
  }

  return canvas.toDataURL();
};