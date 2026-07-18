import { useEffect, useMemo, useState } from 'react';
import { business } from '../config/business';

const emptyVehicle = {
  title: '', make: '', model: '', year: new Date().getFullYear(), price: '', mileage: '',
  fuel: 'Diesel', transmission: 'Automatic', bodyType: 'Saloon', colour: '',
  status: 'Available', featured: false, description: '',
};

export function VehicleForm({ vehicle, onSave, onClose }) {
  const options = business.inventoryOptions;
  const [values, setValues] = useState(() => ({ ...emptyVehicle, ...(vehicle || {}) }));
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setValues({ ...emptyVehicle, ...(vehicle || {}) });
    setFiles([]);
    setError('');
    setProgress(null);
  }, [vehicle]);

  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);
  useEffect(() => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)), [previews]);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!values.make.trim() || !values.model.trim() || !values.price || !values.year) {
      setError('Make, model, year and price are required.');
      return;
    }
    if (!vehicle && !files.length) {
      setError('Add at least one vehicle image.');
      return;
    }

    const payload = {
      title: values.title.trim() || `${values.year} ${values.make} ${values.model}`,
      make: values.make.trim(),
      model: values.model.trim(),
      year: Number(values.year),
      price: Number(values.price),
      mileage: Number(values.mileage || 0),
      fuel: values.fuel,
      transmission: values.transmission,
      bodyType: values.bodyType,
      colour: values.colour.trim(),
      status: values.status,
      featured: Boolean(values.featured),
      description: values.description.trim(),
    };

    setBusy(true);
    try {
      await onSave(payload, files, setProgress);
      onClose();
    } catch (nextError) {
      console.error(nextError);
      setError(nextError?.message || 'Could not save this vehicle.');
    } finally {
      setBusy(false);
    }
  };

  const currentImages = previews.length
    ? previews.map(({ url }) => url)
    : (vehicle?.thumbnails?.length ? vehicle.thumbnails : vehicle?.images) || [];

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}>
      <aside className="vehicle-drawer" role="dialog" aria-modal="true" aria-label={vehicle ? 'Edit vehicle' : 'Add vehicle'}>
        <div className="vehicle-drawer__header">
          <div><p className="eyebrow">Inventory record</p><h2>{vehicle ? 'Edit vehicle' : 'Add vehicle'}</h2></div>
          <button type="button" className="icon-button" onClick={onClose} disabled={busy} aria-label="Close">×</button>
        </div>

        <form className="vehicle-form" onSubmit={submit}>
          <section>
            <h3>Vehicle identity</h3>
            <div className="form-grid">
              <label><span>Make *</span><input name="make" value={values.make} onChange={update} placeholder="Audi" /></label>
              <label><span>Model *</span><input name="model" value={values.model} onChange={update} placeholder="A3" /></label>
              <label><span>Year *</span><input type="number" name="year" min="1950" max="2100" value={values.year} onChange={update} /></label>
              <label><span>Display title</span><input name="title" value={values.title} onChange={update} placeholder="Generated automatically if empty" /></label>
            </div>
          </section>

          <section>
            <h3>Pricing and specification</h3>
            <div className="form-grid">
              <label><span>Price ({business.regional.currencySymbol}) *</span><input type="number" name="price" min="0" value={values.price} onChange={update} /></label>
              <label><span>Mileage ({business.regional.distanceUnit})</span><input type="number" name="mileage" min="0" value={values.mileage} onChange={update} /></label>
              <label><span>Fuel</span><select name="fuel" value={values.fuel} onChange={update}>{options.fuels.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>Transmission</span><select name="transmission" value={values.transmission} onChange={update}>{options.transmissions.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>Body type</span><select name="bodyType" value={values.bodyType} onChange={update}>{options.bodyTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>Colour</span><input name="colour" value={values.colour} onChange={update} placeholder="Glacier White" /></label>
              <label><span>Status</span><select name="status" value={values.status} onChange={update}>{options.statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="checkbox-field"><input type="checkbox" name="featured" checked={values.featured} onChange={update} /><span>Feature on home page</span></label>
            </div>
          </section>

          <section>
            <h3>Images</h3>
            <label className="upload-zone">
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, options.maxImages))} />
              <strong>{files.length ? `${files.length} new image${files.length > 1 ? 's' : ''} selected` : vehicle ? 'Choose new images to replace the current gallery' : `Choose up to ${options.maxImages} images`}</strong>
              <span>Large photos are resized and compressed before upload. Original files never leave the browser.</span>
            </label>
            {!!currentImages.length && <div className="form-previews">{currentImages.map((url, index) => <img key={`${url}-${index}`} src={url} alt={`Vehicle preview ${index + 1}`} />)}</div>}
          </section>

          <section>
            <h3>Description</h3>
            <label><span>Vehicle description</span><textarea name="description" rows="6" value={values.description} onChange={update} placeholder="Condition, history, standout features and anything the buyer should know." /></label>
          </section>

          {progress && <div className="upload-progress"><i /><span>{progress.stage === 'compressing' ? 'Optimising' : 'Uploading'} image {progress.current} of {progress.total}</span></div>}
          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="vehicle-form__actions">
            <button className="button button--ghost" type="button" onClick={onClose} disabled={busy}>Cancel</button>
            <button className="button button--primary" type="submit" disabled={busy}>{busy ? 'Saving…' : vehicle ? 'Save changes' : 'Create listing'}</button>
          </div>
        </form>
      </aside>
    </div>
  );
}
