import { useEffect, useState } from 'react';
import { business } from '../config/business';
import { Mark, SmartLink } from '../components/SiteShell';
import { VehicleForm } from '../components/VehicleForm';
import { formatMileage, formatPrice } from '../components/VehicleCard';
import { navigate } from '../hooks/usePathname';
import { createVehicle, deleteVehicle, updateVehicle } from '../lib/vehicles';

export function DashboardPage({ authState, vehiclesState }) {
  const { user, loading, logout, firebaseEnabled } = authState;
  const { vehicles, counts } = vehiclesState;
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => { if (!loading && !user) navigate('/dealer-login'); }, [loading, user]);
  if (loading || !user) return <main className="dashboard-loading"><i /></main>;

  const displayed = vehicles.filter((vehicle) => `${vehicle.title} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(search.toLowerCase()));
  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (vehicle) => { setEditing(vehicle); setFormOpen(true); };
  const save = (values, files, progress) => editing
    ? updateVehicle(editing.id, values, files, editing, progress)
    : createVehicle(values, files, progress);

  const remove = async (vehicle) => {
    if (!window.confirm(`Delete “${vehicle.title}”? This cannot be undone.`)) return;
    setActionError('');
    try { await deleteVehicle(vehicle); } catch (error) { setActionError(error?.message || 'Could not delete the listing.'); }
  };

  const quickStatus = async (vehicle, status) => {
    setActionError('');
    try { await updateVehicle(vehicle.id, { status }, [], vehicle); } catch (error) { setActionError(error?.message || 'Could not update status.'); }
  };

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Mark />
        <nav><a href="#overview" className="is-active"><span>⌂</span>Overview</a><a href="#inventory"><span>▤</span>Inventory</a><SmartLink href="/"><span>↗</span>View website</SmartLink></nav>
        <div className="dashboard-sidebar__user"><span>{user.email?.slice(0, 1).toUpperCase()}</span><div><strong>{user.email}</strong><small>{firebaseEnabled ? 'Firebase admin' : 'Local demo'}</small></div><button onClick={async () => { await logout(); navigate('/dealer-login'); }} aria-label="Sign out">↪</button></div>
      </aside>
      <section className="dashboard-main" id="overview">
        <header className="dashboard-header"><div><p className="eyebrow">{business.dashboard.subtitle}</p><h1>{business.dashboard.title}</h1></div><div><SmartLink href="/" className="button button--ghost">Open site ↗</SmartLink><button className="button button--primary" onClick={openCreate}>+ Add vehicle</button></div></header>
        {!firebaseEnabled && <div className="dashboard-banner"><strong>Local demo database active.</strong><span>Listings and compressed images persist in this browser. Connect Firebase when you need multi-device syncing and live production storage.</span></div>}
        <div className="dashboard-stats">{[['Total stock', counts.total, '▦'], ['Available', counts.available, '✓'], ['Reserved', counts.reserved, '◌'], ['Sold', counts.sold, '●']].map(([label, value, icon]) => <article key={label}><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></article>)}</div>
        <section className="dashboard-inventory" id="inventory">
          <div className="dashboard-inventory__head"><div><p className="eyebrow">Listing management</p><h2>Inventory</h2></div><label className="search-field"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a vehicle" /></label></div>
          {actionError && <p className="form-error">{actionError}</p>}
          <div className="inventory-table">
            <div className="inventory-table__header"><span>Vehicle</span><span>Year</span><span>Price</span><span>Status</span><span>Actions</span></div>
            {displayed.map((vehicle) => <article key={vehicle.id} className="inventory-row"><div className="inventory-row__vehicle">{(vehicle.thumbnails?.[0] || vehicle.images?.[0]) ? <img src={vehicle.thumbnails?.[0] || vehicle.images?.[0]} alt="" /> : <div className="image-placeholder" />}<div><strong>{vehicle.title}</strong><small>{formatMileage(vehicle.mileage)} {business.regional.distanceUnit} · {vehicle.fuel}</small></div></div><span>{vehicle.year}</span><strong>{formatPrice(vehicle.price)}</strong><select value={vehicle.status} onChange={(event) => quickStatus(vehicle, event.target.value)} className={`status-select status-select--${vehicle.status.toLowerCase()}`}>{business.inventoryOptions.statuses.map((item) => <option key={item}>{item}</option>)}</select><div className="inventory-row__actions"><button onClick={() => openEdit(vehicle)} aria-label="Edit">✎</button><button onClick={() => remove(vehicle)} aria-label="Delete">×</button></div></article>)}
            {!displayed.length && <div className="empty-state"><h3>No listings found</h3><button className="button button--primary" onClick={openCreate}>Create first listing</button></div>}
          </div>
        </section>
      </section>
      {formOpen && <VehicleForm vehicle={editing} onSave={save} onClose={() => setFormOpen(false)} />}
    </main>
  );
}
