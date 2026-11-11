import { useDeleteReadingMutation } from '../services/api';

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function ReadingList({ readings, isLoading, error, onEdit }) {
  const [deleteReading, { isLoading: isDeleting }] = useDeleteReadingMutation();

  async function handleDelete(reading) {
    if (!window.confirm(`Delete your ${reading.slot} reading of ${reading.value} mg/dl?`)) {
      return;
    }
    try {
      await deleteReading(reading._id).unwrap();
    } catch {
      window.alert('Could not delete this reading. Please try again.');
    }
  }

  return (
    <section className="panel readings-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">SELECTED DAY</p>
          <h2>Recorded readings <span className="count-pill">{readings.length}/4</span></h2>
        </div>
      </div>
      {isLoading ? <p className="muted-message">Loading your readings…</p> : null}
      {error ? <p className="form-error" role="alert">Could not load readings. Check that the API is running and try again.</p> : null}
      {!isLoading && !error && readings.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">♡</span>
          <strong>No readings recorded</strong>
          <span>Add a reading to begin your daily record.</span>
        </div>
      ) : null}
      {readings.length > 0 && (
        <div className="reading-list">
          {readings.map((reading) => (
            <article className="reading-row" key={reading._id}>
              <span className="reading-dot" aria-hidden="true" />
              <div className="reading-description">
                <strong>{reading.slot}</strong>
                <span>{formatTime(reading.createdAt)}</span>
              </div>
              <div className="reading-result">
                <strong>{reading.value}</strong>
                <span>mg/dL</span>
              </div>
              <div className="row-actions">
                <button className="icon-button" aria-label={`Edit ${reading.slot} reading`} onClick={() => onEdit(reading)}>Edit</button>
                <button className="icon-button danger-text" aria-label={`Delete ${reading.slot} reading`} disabled={isDeleting} onClick={() => handleDelete(reading)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
