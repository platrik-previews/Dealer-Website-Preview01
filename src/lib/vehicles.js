import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore/lite';
import { app, db, firebaseEnabled } from './firebase';
import { sampleVehicles } from '../data/sampleVehicles';
import { createVehicleImageSet } from './images';
import {
  getDemoVehicle,
  listDemoVehicles,
  removeDemoVehicle,
  saveDemoVehicle,
} from './demoDatabase';

const VEHICLES_EVENT = 'dealer-motion-vehicles-updated';

const announceChange = () => window.dispatchEvent(new CustomEvent(VEHICLES_EVENT));
const makeId = () => crypto.randomUUID?.() || `vehicle-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const timestampValue = (value) => {
  if (typeof value === 'number') return value;
  if (value?.toMillis) return value.toMillis();
  if (value?.seconds) return value.seconds * 1000;
  return 0;
};

async function fetchFirebaseVehicles() {
  const snapshot = await getDocs(query(collection(db, 'vehicles'), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
    createdAt: timestampValue(item.data().createdAt),
    updatedAt: timestampValue(item.data().updatedAt),
  }));
}

export function subscribeToVehicles(callback, onError) {
  let active = true;
  const emit = async () => {
    try {
      const vehicles = firebaseEnabled ? await fetchFirebaseVehicles() : await listDemoVehicles();
      if (active) callback(vehicles);
    } catch (error) {
      if (active) onError?.(error);
    }
  };

  emit();
  window.addEventListener(VEHICLES_EVENT, emit);
  window.addEventListener('storage', emit);

  return () => {
    active = false;
    window.removeEventListener(VEHICLES_EVENT, emit);
    window.removeEventListener('storage', emit);
  };
}

const uniquePath = (vehicleId, variant, file) => {
  const extension = file.name.split('.').pop() || 'webp';
  return `vehicles/${vehicleId}/${makeId()}-${variant}.${extension}`;
};

async function createCompressedImageAssets(files, onProgress, uploadToFirebase = false, vehicleId = '') {
  if (!files.length) return uploadToFirebase ? { images: [], thumbnails: [] } : [];

  if (!uploadToFirebase) {
    const assets = [];
    for (let index = 0; index < files.length; index += 1) {
      onProgress?.({ stage: 'compressing', current: index + 1, total: files.length });
      const { full, thumbnail } = await createVehicleImageSet(files[index]);
      assets.push({ full, thumbnail });
    }
    return assets;
  }

  const { getStorage, getDownloadURL, ref, uploadBytes } = await import('firebase/storage');
  const storage = getStorage(app);
  const images = [];
  const thumbnails = [];

  for (let index = 0; index < files.length; index += 1) {
    onProgress?.({ stage: 'compressing', current: index + 1, total: files.length });
    const { full, thumbnail } = await createVehicleImageSet(files[index]);

    onProgress?.({ stage: 'uploading', current: index + 1, total: files.length });
    const fullRef = ref(storage, uniquePath(vehicleId, 'full', full));
    const thumbRef = ref(storage, uniquePath(vehicleId, 'thumb', thumbnail));

    const [fullSnapshot, thumbSnapshot] = await Promise.all([
      uploadBytes(fullRef, full, { contentType: full.type, cacheControl: 'public,max-age=31536000,immutable' }),
      uploadBytes(thumbRef, thumbnail, { contentType: thumbnail.type, cacheControl: 'public,max-age=31536000,immutable' }),
    ]);

    const [imageUrl, thumbnailUrl] = await Promise.all([
      getDownloadURL(fullSnapshot.ref),
      getDownloadURL(thumbSnapshot.ref),
    ]);
    images.push(imageUrl);
    thumbnails.push(thumbnailUrl);
  }

  return { images, thumbnails };
}

async function removeStorageUrls(urls = []) {
  const validUrls = urls.filter((url) => typeof url === 'string' && url.includes('firebasestorage'));
  if (!validUrls.length) return;
  const { deleteObject, getStorage, ref } = await import('firebase/storage');
  const storage = getStorage(app);
  await Promise.allSettled(validUrls.map((url) => deleteObject(ref(storage, url))));
}

export async function createVehicle(values, files = [], onProgress) {
  if (!firebaseEnabled) {
    const now = Date.now();
    const demoImageAssets = await createCompressedImageAssets(files, onProgress);
    const fallback = sampleVehicles[0];
    const vehicle = {
      ...values,
      id: makeId(),
      images: demoImageAssets.length ? [] : fallback.images,
      thumbnails: demoImageAssets.length ? [] : fallback.thumbnails,
      demoImageAssets,
      createdAt: now,
      updatedAt: now,
    };
    await saveDemoVehicle(vehicle);
    announceChange();
    return vehicle.id;
  }

  const record = await addDoc(collection(db, 'vehicles'), {
    ...values,
    images: [],
    thumbnails: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  try {
    const uploaded = await createCompressedImageAssets(files, onProgress, true, record.id);
    await updateDoc(doc(db, 'vehicles', record.id), {
      ...uploaded,
      updatedAt: serverTimestamp(),
    });
    announceChange();
    return record.id;
  } catch (error) {
    await deleteDoc(doc(db, 'vehicles', record.id));
    throw error;
  }
}

export async function updateVehicle(id, values, files = [], previous = {}, onProgress) {
  if (!firebaseEnabled) {
    const current = await getDemoVehicle(id);
    if (!current) throw new Error('Vehicle not found.');

    let demoImageAssets = current.demoImageAssets || [];
    let images = current.images || [];
    let thumbnails = current.thumbnails || [];
    if (files.length) {
      demoImageAssets = await createCompressedImageAssets(files, onProgress);
      images = [];
      thumbnails = [];
    }

    await saveDemoVehicle({
      ...current,
      ...values,
      images,
      thumbnails,
      demoImageAssets,
      updatedAt: Date.now(),
    });
    announceChange();
    return;
  }

  let imageFields = {
    images: previous.images || [],
    thumbnails: previous.thumbnails || [],
  };
  if (files.length) imageFields = await createCompressedImageAssets(files, onProgress, true, id);

  await updateDoc(doc(db, 'vehicles', id), {
    ...values,
    ...imageFields,
    updatedAt: serverTimestamp(),
  });
  announceChange();

  if (files.length) {
    await removeStorageUrls([...(previous.images || []), ...(previous.thumbnails || [])]);
  }
}

export async function deleteVehicle(vehicle) {
  if (!firebaseEnabled) {
    await removeDemoVehicle(vehicle.id);
    announceChange();
    return;
  }

  await deleteDoc(doc(db, 'vehicles', vehicle.id));
  announceChange();
  await removeStorageUrls([...(vehicle.images || []), ...(vehicle.thumbnails || [])]);
}
