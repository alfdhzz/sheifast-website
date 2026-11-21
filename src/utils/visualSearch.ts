import { Product, VisualSearchResult } from '@/types/catalog';

interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16) || 0;
    const g = parseInt(cleaned[1] + cleaned[1], 16) || 0;
    const b = parseInt(cleaned[2] + cleaned[2], 16) || 0;
    return { r, g, b };
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return { r: 220, g: 210, b: 195 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Extracts top 3 dominant colors from an HTMLImageElement using an offscreen HTML5 Canvas
 */
export function extractDominantColorsFromImage(imgEl: HTMLImageElement): string[] {
  try {
    const canvas = document.createElement('canvas');
    const size = 48;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return ['#EFE6D8', '#683B1E', '#B5895A'];

    ctx.drawImage(imgEl, 0, 0, size, size);
    const imageData = ctx.getImageData(0, 0, size, size).data;

    // Quantize pixels into buckets
    const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();

    for (let i = 0; i < imageData.length; i += 16) {
      const a = imageData[i + 3];
      if (a < 128) continue;

      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];

      const qr = Math.round(r / 32) * 32;
      const qg = Math.round(g / 32) * 32;
      const qb = Math.round(b / 32) * 32;
      const key = `${qr}-${qg}-${qb}`;

      const prev = buckets.get(key);
      if (prev) {
        prev.count += 1;
        prev.r += r;
        prev.g += g;
        prev.b += b;
      } else {
        buckets.set(key, { count: 1, r, g, b });
      }
    }

    const sorted = Array.from(buckets.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((item) =>
        rgbToHex({
          r: item.r / item.count,
          g: item.g / item.count,
          b: item.b / item.count,
        })
      );

    return sorted.length > 0 ? sorted : ['#EFE6D8', '#683B1E', '#B5895A'];
  } catch {
    return ['#EFE6D8', '#683B1E', '#B5895A'];
  }
}

/**
 * Computes color similarity [0..1] between two sets of hex colors
 */
export function computeColorSimilarity(colorsA: string[], colorsB: string[]): number {
  if (!colorsA.length || !colorsB.length) return 0.65;
  const rgbsA = colorsA.map(hexToRgb);
  const rgbsB = colorsB.map(hexToRgb);

  let bestScoreSum = 0;
  for (const a of rgbsA) {
    let minDist = Infinity;
    for (const b of rgbsB) {
      const dist = Math.sqrt(
        Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2)
      );
      if (dist < minDist) minDist = dist;
    }
    // Max RGB euclidean distance is ~441.67
    const sim = Math.max(0, 1 - minDist / 441.67);
    bestScoreSum += sim;
  }

  return bestScoreSum / rgbsA.length;
}

// Singleton cache for MobileNet model
let cachedMobileNetModel: {
  classify: (
    img: HTMLImageElement
  ) => Promise<Array<{ className: string; probability: number }>>;
} | null = null;

async function getMobileNetModel() {
  if (cachedMobileNetModel) return cachedMobileNetModel;
  const tf = await import('@tensorflow/tfjs');
  await tf.ready();
  const mobilenet = await import('@tensorflow-models/mobilenet');
  cachedMobileNetModel = await mobilenet.load({ version: 2, alpha: 0.5 });
  return cachedMobileNetModel;
}

// Map MobileNet Imagenet classes to our catalog visual tags & categories
const IMAGENET_KEYWORD_MAPPING: Record<string, string[]> = {
  shoe: ['sneakers', 'shoes', 'sepatu', 'running', 'court', 'canvas', 'suede'],
  sneaker: ['sneakers', 'shoes', 'sepatu', 'running', 'court', 'adidas', 'nike', 'puma', 'new balance'],
  sandal: ['sneakers', 'shoes', 'sepatu'],
  boot: ['sneakers', 'shoes', 'sepatu', 'converse', 'high top'],
  bag: ['bag', 'tas', 'shoulder bag', 'handbag', 'tote bag', 'waist bag', 'backpack'],
  purse: ['bag', 'tas', 'shoulder bag', 'handbag', 'cream', 'leather'],
  backpack: ['bag', 'tas', 'waist bag', 'backpack', 'sport'],
  wallet: ['bag', 'tas', 'leather'],
  shirt: ['shirt', 'kemeja', 't-shirt', 'kaos', 'top', 'baju', 'linen', 'cotton'],
  jersey: ['t-shirt', 'kaos', 'top', 'baju', 'uniqlo', 'sport'],
  sweatshirt: ['cardigan', 'knit', 'top', 'baju', 'outerwear'],
  cardigan: ['cardigan', 'knit', 'rajut', 'top', 'baju', 'colorbox'],
  coat: ['blazer', 'jacket', 'outerwear', 'jas', 'tailored'],
  suit: ['blazer', 'jacket', 'outerwear', 'tailored'],
  dress: ['dress', 'gaun', 'midi dress', 'floral', 'skirt', 'rok'],
  skirt: ['skirt', 'rok', 'pleated', 'midi', 'bottoms', 'dress'],
  cap: ['cap', 'hat', 'topi', 'accessories'],
  hat: ['cap', 'hat', 'topi', 'accessories'],
  sock: ['socks', 'kaos kaki', 'accessories', 'sport'],
  scarf: ['scarf', 'hijab', 'kerudung', 'accessories', 'voal'],
};

/**
 * Runs client-side visual search combining TensorFlow.js MobileNet classification,
 * filename/sample keyword hints, and HTML5 Canvas dominant color extraction.
 */
export async function analyzeImageAndRankProducts(params: {
  imageElement: HTMLImageElement;
  products: Product[];
  hintKeywords?: string[];
  fallbackColors?: string[];
  fileName?: string;
}): Promise<{
  results: VisualSearchResult[];
  extractedColors: string[];
  detectedLabels: string[];
  usedMobileNet: boolean;
}> {
  const { imageElement, products, hintKeywords = [], fallbackColors = [], fileName = '' } = params;

  const extractedColors =
    fallbackColors.length > 0 ? fallbackColors : extractDominantColorsFromImage(imageElement);

  const detectedTokens = new Set<string>();
  const detectedLabels: string[] = [];
  let usedMobileNet = false;

  // Add filename tokens if uploaded from local file
  if (fileName) {
    fileName
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2)
      .forEach((t) => detectedTokens.add(t));
  }

  hintKeywords.forEach((k) => detectedTokens.add(k.toLowerCase()));

  // Attempt TensorFlow.js MobileNet classification
  try {
    const model = await Promise.race([
      getMobileNetModel(),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('MobileNet load timeout')), 6500)
      ),
    ]);

    if (model) {
      const predictions = await model.classify(imageElement);
      usedMobileNet = true;

      for (const pred of predictions) {
        const rawClass = pred.className.toLowerCase();
        detectedLabels.push(pred.className.split(',')[0]);
        const words = rawClass.split(/[^a-z0-9]+/);
        for (const word of words) {
          if (word.length > 2) detectedTokens.add(word);
          for (const [key, mappedTags] of Object.entries(IMAGENET_KEYWORD_MAPPING)) {
            if (word.includes(key) || rawClass.includes(key)) {
              mappedTags.forEach((tag) => detectedTokens.add(tag));
            }
          }
        }
      }
    }
  } catch {
    usedMobileNet = false;
  }

  const tokensArray = Array.from(detectedTokens);

  const results: VisualSearchResult[] = products
    .filter((p) => p.isAvailable)
    .map((product) => {
      // 1. Color similarity score (0..1)
      const colorSim = computeColorSimilarity(extractedColors, product.dominantColors);

      // 2. Semantic & visual tag score (0..1)
      const searchableText = [
        product.name,
        product.brandName,
        product.category,
        ...product.visualTags,
      ]
        .join(' ')
        .toLowerCase();

      let tagMatches = 0;
      for (const token of tokensArray) {
        if (searchableText.includes(token)) {
          tagMatches += 1;
        }
      }

      const semanticSim =
        tokensArray.length > 0
          ? Math.min(1, tagMatches / Math.max(2, Math.min(5, tokensArray.length)))
          : 0.5;

      // Blend semantic + color similarity into a realistic percentage [68..98]
      const rawBlend =
        tokensArray.length > 0 ? semanticSim * 0.65 + colorSim * 0.35 : colorSim * 0.85 + 0.1;

      const similarityScore = Math.min(98, Math.max(64, Math.round(62 + rawBlend * 36)));

      return {
        product,
        similarityScore,
        matchedBy: usedMobileNet ? ('mobilenet+color' as const) : ('color+tags' as const),
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore);

  return {
    results,
    extractedColors,
    detectedLabels:
      detectedLabels.length > 0
        ? detectedLabels
        : hintKeywords.length > 0
        ? hintKeywords.slice(0, 3)
        : ['Fashion & Lifestyle Match'],
    usedMobileNet,
  };
}
