import { sampleVehicles } from '../data/sampleVehicles.js';

const DATABASE_NAME = 'dealer-motion-demo';
const DATABASE_VERSION = 1;
const STORE_NAME = 'vehicles';
const LEGACY_LOCAL_KEY = 'dealer-motion-vehicles-v1';

const objectUrlCache = new Map();

const requestResult = (request) => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('IndexedDB request failed.'));
});

const transactionDone = (transaction) => new Promise((resolve, reject) => {
  transaction.oncomplete = () => resolve();
  transaction.onerror = () => reject(transaction.error || new Error('IndexedDB transaction failed.'));
  transaction.onabort = () => reject(transaction.error || new Error('IndexedDB transaction was aborted.'));
});

async function openDatabase() {
  if (!('indexedDB' in window)) throw new Error('This browser does not support IndexedDB.');

  const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains(STORE_NAME)) {
      database.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  };
  return requestResult(request);
}

function legacyVehicles() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LEGACY_LOCAL_KEY));
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

async function seedIfEmpty(database) {
  const transaction = database.transaction(STORE_NAME, 'readonly');
  const done = transactionDone(transaction);
  const count = await requestResult(transaction.objectStore(STORE_NAME).count());
  await done;
  if (count > 0) return;

  const seed = legacyVehicles() || sampleVehicles;
  const writeTransaction = database.transaction(STORE_NAME, 'readwrite');
  const writeDone = transactionDone(writeTransaction);
  const store = writeTransaction.objectStore(STORE_NAME);
  seed.forEach((vehicle) => store.put({ ...vehicle }));
  await writeDone;
}

function cachedObjectUrl(key, blob) {
  if (!blob) return '';
  if (objectUrlCache.has(key)) return objectUrlCache.get(key);
  const url = URL.createObjectURL(blob);
  objectUrlCache.set(key, url);
  return url;
}

function clearVehicleObjectUrls(vehicleId) {
  for (const [key, url] of objectUrlCache.entries()) {
    if (key.startsWith(`${vehicleId}:`)) {
      URL.revokeObjectURL(url);
      objectUrlCache.delete(key);
    }
  }
}

function hydrateVehicle(record) {
  const assets = Array.isArray(record.demoImageAssets) ? record.demoImageAssets : [];
  if (!assets.length) return record;

  const version = record.updatedAt || record.createdAt || 0;
  return {
    ...record,
    images: assets.map((asset, index) => cachedObjectUrl(`${record.id}:${version}:full:${index}`, asset.full)),
    thumbnails: assets.map((asset, index) => cachedObjectUrl(`${record.id}:${version}:thumb:${index}`, asset.thumbnail)),
  };
}

export async function listDemoVehicles() {
  const database = await openDatabase();
  await seedIfEmpty(database);
  const transaction = database.transaction(STORE_NAME, 'readonly');
  const done = transactionDone(transaction);
  const records = await requestResult(transaction.objectStore(STORE_NAME).getAll());
  await done;
  database.close();

  return records
    .map(hydrateVehicle)
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
}

export async function getDemoVehicle(id) {
  const database = await openDatabase();
  await seedIfEmpty(database);
  const transaction = database.transaction(STORE_NAME, 'readonly');
  const done = transactionDone(transaction);
  const record = await requestResult(transaction.objectStore(STORE_NAME).get(id));
  await done;
  database.close();
  return record || null;
}

export async function saveDemoVehicle(vehicle) {
  const database = await openDatabase();
  await seedIfEmpty(database);
  clearVehicleObjectUrls(vehicle.id);
  const transaction = database.transaction(STORE_NAME, 'readwrite');
  const done = transactionDone(transaction);
  transaction.objectStore(STORE_NAME).put(vehicle);
  await done;
  database.close();
}

export async function removeDemoVehicle(id) {
  const database = await openDatabase();
  await seedIfEmpty(database);
  clearVehicleObjectUrls(id);
  const transaction = database.transaction(STORE_NAME, 'readwrite');
  const done = transactionDone(transaction);
  transaction.objectStore(STORE_NAME).delete(id);
  await done;
  database.close();
}

export async function resetDemoVehicles() {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, 'readwrite');
  const done = transactionDone(transaction);
  transaction.objectStore(STORE_NAME).clear();
  await done;
  database.close();
  objectUrlCache.forEach((url) => URL.revokeObjectURL(url));
  objectUrlCache.clear();
  localStorage.removeItem(LEGACY_LOCAL_KEY);
  const seeded = await openDatabase();
  await seedIfEmpty(seeded);
  seeded.close();
}
