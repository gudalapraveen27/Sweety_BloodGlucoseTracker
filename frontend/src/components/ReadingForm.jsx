import { useEffect, useState } from 'react';
import {
  useCreateReadingMutation,
  useUpdateReadingMutation
} from '../services/api';

export const readingSlots = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner'
];

function getLocalDate() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export default function ReadingForm({ selectedDate, editingReading, onCancelEdit }) {
  const [date, setDate] = useState(selectedDate);
  const [slot, setSlot] = useState(readingSlots[0]);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [createReading, createState] = useCreateReadingMutation();
  const [updateReading, updateState] = useUpdateReadingMutation();
  const isEditing = Boolean(editingReading);
  const isSaving = createState.isLoading || updateState.isLoading;

  useEffect(() => {
    if (editingReading) {
      setDate(editingReading.date.slice(0, 10));
      setSlot(editingReading.slot);
      setValue(String(editingReading.value));
      setError('');
      return;
    }
    setDate(selectedDate);
    setSlot(readingSlots[0]);
    setValue('');
  }, [editingReading, selectedDate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      if (isEditing) {
        await updateReading({ id: editingReading._id, date, slot, value: Number(value) }).unwrap();
        onCancelEdit();
      } else {
        await createReading({ date, slot, value: Number(value) }).unwrap();
        setValue('');
      }
    } catch (requestError) {
      setError(requestError.data?.message || 'Could not save your reading. Please try again.');
    }
  }

  return (
    <form className="panel reading-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{isEditing ? 'UPDATE RECORD' : 'ADD TO JOURNAL'}</p>
          <h2>{isEditing ? 'Edit reading' : 'New reading'}</h2>
        </div>
        <span className="heading-icon" aria-hidden="true">＋</span>
      </div>

      <label htmlFor="reading-date">Date</label>
      <input
        id="reading-date"
        type="date"
        value={date}
        max={getLocalDate()}
        onChange={(event) => setDate(event.target.value)}
        required
      />

      <label htmlFor="reading-slot">Time slot</label>
      <select id="reading-slot" value={slot} onChange={(event) => setSlot(event.target.value)}>
        {readingSlots.map((timeSlot) => <option key={timeSlot} value={timeSlot}>{timeSlot}</option>)}
      </select>

      <label htmlFor="reading-value">Blood glucose <span className="unit">(mg/dL)</span></label>
      <div className="value-input-wrap">
        <input
          id="reading-value"
          type="number"
          min="40"
          max="600"
          step="1"
          placeholder="Enter value"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required
        />
        <span>mg/dL</span>
      </div>
      <p className="helper-text">Use a whole number between 40 and 600 mg/dL.</p>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-actions">
        <button className="button button-primary full-button" disabled={isSaving}>
          {isSaving ? 'Saving…' : isEditing ? 'Save changes' : 'Save reading'}
        </button>
        {isEditing && <button type="button" className="button button-secondary full-button" onClick={onCancelEdit}>Cancel</button>}
      </div>
    </form>
  );
}
