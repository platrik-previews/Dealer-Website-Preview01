import { useEffect, useMemo, useState } from 'react';
import { subscribeToVehicles } from '../lib/vehicles';

export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => subscribeToVehicles((nextVehicles) => { setVehicles(nextVehicles); setLoading(false); }, (nextError) => { console.error(nextError); setError(nextError?.message || 'Could not load inventory.'); setLoading(false); }), []);
  const counts = useMemo(() => ({ total: vehicles.length, available: vehicles.filter((v) => v.status === 'Available').length, reserved: vehicles.filter((v) => v.status === 'Reserved').length, sold: vehicles.filter((v) => v.status === 'Sold').length }), [vehicles]);
  return { vehicles, loading, error, counts };
}
