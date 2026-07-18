'use client';

import QRCode from 'qrcode';
import type { RenderOptions } from '@/features/qr-tables/types/tables.types';

export interface QrStyle {
  patternType: 'dots' | 'squares' | 'lines' | 'rounded' | 'diamonds';
  logoOverlay: boolean;
}

const DEFAULT_QR_STYLE: QrStyle = { patternType: 'dots', logoOverlay: false };

export const getQrStyle = (tableId: string): QrStyle => {
  if (tableId === 'new' || typeof window === 'undefined') {
    return DEFAULT_QR_STYLE;
  }
  
  const saved = localStorage.getItem(`qr-style-${tableId}`);
  if (!saved) {
    return DEFAULT_QR_STYLE;
  }
  try {
    const parsed = JSON.parse(saved);
    return {
      patternType: parsed.patternType || 'dots',
      logoOverlay: parsed.logoOverlay === true,
    };
  } catch {
    return DEFAULT_QR_STYLE;
  }
};

export const saveQrStyle = (tableId: string, config: QrStyle): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`qr-style-${tableId}`, JSON.stringify(config));
  }
};

export const drawStyledQr = async ({ url, patternType, logoOverlay, logoUrl, isDark }: Omit<RenderOptions, 'canvas'>): Promise<string> => {
  const fgColor = isDark ? '#FFFFFF' : '#1C1917';
  const bgColor = isDark ? '#100E0D' : '#FFFFFF';
  const size = 400;
  const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
  const moduleCount = qr.modules.size;
  const marginModules = 4;
  const totalModules = moduleCount + marginModules * 2;
  const step = size / totalModules;
  const dotRadius = step * 0.44;
  let svgElements = '';

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.modules.get(row, col)) {
        const x = (col + marginModules) * step;
        const y = (row + marginModules) * step;
        const cx = x + step / 2;
        const cy = y + step / 2;

        const isFinderPattern =
          (row < 7 && col < 7) ||
          (row < 7 && col >= moduleCount - 7) ||
          (row >= moduleCount - 7 && col < 7);
        if (isFinderPattern) {
          svgElements += `<rect x="${x}" y="${y}" width="${step}" height="${step}" fill="${fgColor}" />`;
        } else if (patternType === 'dots') {
          svgElements += `<circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="${fgColor}" />`;
        } else if (patternType === 'lines') {
          svgElements += `<rect x="${x + 0.5}" y="${y + 1.5}" width="${step - 1}" height="${step - 3}" rx="${step * 0.2}" fill="${fgColor}" />`;
        } else if (patternType === 'rounded') {
          svgElements += `<rect x="${x + 0.4}" y="${y + 0.4}" width="${step - 0.8}" height="${step - 0.8}" rx="${step * 0.35}" fill="${fgColor}" />`;
        } else if (patternType === 'diamonds') {
          svgElements += `<polygon points="${cx},${y + 0.2} ${x + step - 0.2},${cy} ${cx},${y + step - 0.2} ${x + 0.2},${cy}" fill="${fgColor}" />`;
        } else {
          svgElements += `<rect x="${x + 0.2}" y="${y + 0.2}" width="${step - 0.4}" height="${step - 0.4}" fill="${fgColor}" />`;
        }
      }
    }
  }

  let logoElement = '';
  const centerSize = size * 0.24;
  const lx = (size - centerSize) / 2;
  const ly = (size - centerSize) / 2;

  if (logoOverlay) {
    logoElement += `<rect x="${lx}" y="${ly}" width="${centerSize}" height="${centerSize}" fill="${bgColor}" rx="${centerSize * 0.25}" />`;
    
    if (logoUrl) {
      let embeddedLogoUrl = logoUrl;
      if (!logoUrl.startsWith('data:')) {
        try {
          const res = await fetch(logoUrl);
          const blob = await res.blob();
          embeddedLogoUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.error(e);
        }
      }

      logoElement += `<image href="${embeddedLogoUrl}" x="${lx + 3}" y="${ly + 3}" width="${centerSize - 6}" height="${centerSize - 6}" preserveAspectRatio="xMidYMid slice" clip-path="url(#logo-clip-path)" />`;
    } else {
      logoElement += `<text x="${size / 2}" y="${size / 2 + 2}" font-family="sans-serif" font-weight="bold" font-size="${centerSize * 0.45}" fill="#00A46C" text-anchor="middle" dominant-baseline="middle">🍴</text>`;
    }
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <defs>
        <clipPath id="logo-clip-path">
          <rect x="${lx + 3}" y="${ly + 3}" width="${centerSize - 6}" height="${centerSize - 6}" rx="${(centerSize - 6) * 0.22}" />
        </clipPath>
      </defs>
      <rect width="${size}" height="${size}" fill="${bgColor}" />
      ${svgElements}
      ${logoElement}
    </svg>
  `.trim().replace(/\s+/g, ' ');

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
};