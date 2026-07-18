const loadBitmap = async (file) => {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file, { imageOrientation: 'from-image' });
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
};

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not compress image.'))),
      type,
      quality,
    );
  });

const resizeDimensions = (width, height, maxDimension) => {
  if (Math.max(width, height) <= maxDimension) return { width, height };
  const scale = maxDimension / Math.max(width, height);
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
};

export async function compressImage(
  file,
  { maxDimension = 1920, targetBytes = 520_000, initialQuality = 0.86 } = {},
) {
  if (!file.type.startsWith('image/')) {
    throw new Error(`${file.name} is not an image.`);
  }

  const source = await loadBitmap(file);
  const sourceWidth = source.width || source.naturalWidth;
  const sourceHeight = source.height || source.naturalHeight;
  const { width, height } = resizeDimensions(sourceWidth, sourceHeight, maxDimension);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: false });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(source, 0, 0, width, height);
  source.close?.();

  const supportsWebp = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  const type = supportsWebp ? 'image/webp' : 'image/jpeg';
  let quality = initialQuality;
  let blob = await canvasToBlob(canvas, type, quality);

  while (blob.size > targetBytes && quality > 0.58) {
    quality -= 0.06;
    blob = await canvasToBlob(canvas, type, quality);
  }

  const extension = supportsWebp ? 'webp' : 'jpg';
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'vehicle';

  return new File([blob], `${safeName}.${extension}`, {
    type,
    lastModified: Date.now(),
  });
}

export async function createVehicleImageSet(file) {
  const [full, thumbnail] = await Promise.all([
    compressImage(file, { maxDimension: 1920, targetBytes: 520_000, initialQuality: 0.86 }),
    compressImage(file, { maxDimension: 720, targetBytes: 120_000, initialQuality: 0.78 }),
  ]);
  return { full, thumbnail };
}
