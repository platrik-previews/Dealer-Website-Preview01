import { useMemo, useState } from 'react';
import { business } from '../config/business';
import { SiteShell } from '../components/SiteShell';
import { VehicleCard } from '../components/VehicleCard';

export function InventoryPage({ vehicles, loading, error }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [fuel, setFuel] = useState('All');
  const [sort, setSort] = useState('newest');
  const page = business.inventoryPage;

  const fuels = useMemo(() => ['All', ...new Set(vehicles.map((vehicle) => vehicle.fuel).filter(Boolean))], [vehicles]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return [...vehicles]
      .filter((vehicle) => status === 'All' || vehicle.status === status)
      .filter((vehicle) => fuel === 'All' || vehicle.fuel === fuel)
      .filter((vehicle) => !term || `${vehicle.title} ${vehicle.make} ${vehicle.model} ${vehicle.year}`.toLowerCase().includes(term))
      .sort((a, b) => {
        if (sort === 'price-low') return a.price - b.price;
        if (sort === 'price-high') return b.price - a.price;
        if (sort === 'mileage') return a.mileage - b.mileage;
        return (b.createdAt || b.year) - (a.createdAt || a.year);
      });
  }, [vehicles, search, status, fuel, sort]);

  return (
    <SiteShell>
      <section className="page-hero page-hero--inventory">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.titleLines[0]}<br /><em>{page.titleLines[1]}</em></h1>
        <p>{page.intro}</p>
      </section>
      <section className="inventory-section">
        <div className="inventory-toolbar reveal">
          <label className="search-field"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={page.searchPlaceholder} /></label>
          <div className="filter-row">
            <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{business.inventoryOptions.statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Fuel</span><select value={fuel} onChange={(event) => setFuel(event.target.value)}>{fuels.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="mileage">Lowest mileage</option></select></label>
          </div>
        </div>
        <div className="results-line"><strong>{filtered.length}</strong><span>vehicle{filtered.length === 1 ? '' : 's'} found</span></div>
        {error && <p className="form-error">{error}</p>}
        {loading ? <div className="loading-grid"><i /><i /><i /></div> : filtered.length ? <div className="vehicle-grid vehicle-grid--inventory">{filtered.map((vehicle, index) => <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index < 2} />)}</div> : <div className="empty-state"><h2>No matching vehicles</h2><p>Try clearing one of the filters or use a broader search.</p></div>}
      </section>
    </SiteShell>
  );
}
