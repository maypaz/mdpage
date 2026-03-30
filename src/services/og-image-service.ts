import { FONT_URLS } from "../config/constants";
import { generateOgSvg } from "../domain/og";
import { OG_IMAGE_PNG_B64 } from "../presentation/assets";

let fontPromise: Promise<{ bold: ArrayBuffer; regular: ArrayBuffer }> | null = null;

async function getFonts(): Promise<{ bold: ArrayBuffer; regular: ArrayBuffer }> {
  if (!fontPromise) {
    fontPromise = Promise.all([
      fetch(FONT_URLS.bold).then((response) => response.arrayBuffer()),
      fetch(FONT_URLS.regular).then((response) => response.arrayBuffer()),
    ])
      .then(([bold, regular]) => ({ bold, regular }))
      .catch((error) => {
        fontPromise = null;
        throw error;
      });
  }

  return fontPromise;
}

export class OgImageService {
  async render(title: string, description: string): Promise<Uint8Array> {
    const svg = generateOgSvg(title, description);
    const fonts = await getFonts();
    const { Resvg } = await import("@cf-wasm/resvg/workerd");
    const resvg = await Resvg.async(svg, {
      fitTo: { mode: "width" as const, value: 1200 },
      font: {
        fontBuffers: [new Uint8Array(fonts.bold), new Uint8Array(fonts.regular)],
        loadSystemFonts: false,
        defaultFontFamily: "Inter",
      },
    });
    return resvg.render().asPng();
  }

  fallbackPng(): Uint8Array {
    return Uint8Array.from(atob(OG_IMAGE_PNG_B64), (char) => char.charCodeAt(0));
  }
}
