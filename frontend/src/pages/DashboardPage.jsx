import { useState } from 'react';
import AppHeader from '../components/AppHeader';
import ReadingForm from '../components/ReadingForm';
import ReadingList from '../components/ReadingList';
import ReportCards from '../components/ReportCards';
import { useGetReadingsQuery, useGetReportsQuery } from '../services/api';

function getToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function formatSelectedDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [editingReading, setEditingReading] = useState(null);
  const { data: readingData, isLoading: readingsLoading, error: readingsError } = useGetReadingsQuery(selectedDate);
  const { data: reports, isLoading: reportsLoading, error: reportsError } = useGetReportsQuery(selectedDate);
  const readings = readingData?.readings || [];

  return (
    <>
      <AppHeader />
      <main className="dashboard">
        <section className="welcome-section">
          <div>
            <p className="eyebrow">GLUCOSE MANAGEMENT</p>
            <h1>Your health, <em>in clear view.</em></h1>
            <p className="welcome-copy">A clear record of your readings, patterns, and progress.</p>
          </div>
          <div className="date-picker">
            <label htmlFor="selected-date">REPORT DATE</label>
            <input id="selected-date" type="date" max={getToday()} value={selectedDate} onChange={(event) => {
              setSelectedDate(event.target.value);
              setEditingReading(null);
            }} />
          </div>
        </section>

        <div className="date-banner">
          <span className="calendar-mark" aria-hidden="true">◷</span>
          <div><span className="eyebrow">SELECTED DATE</span><strong>{formatSelectedDate(selectedDate)}</strong></div>
        </div>

        <ReportCards reports={reports} isLoading={reportsLoading} error={reportsError} />

        <section className="entries-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">GLUCOSE JOURNAL</p>
              <h2>Reading history</h2>
            </div>
            <span className="section-note">Record up to four readings per day</span>
          </div>
          <div className="entry-grid">
            <ReadingForm
              selectedDate={selectedDate}
              editingReading={editingReading}
              onCancelEdit={() => setEditingReading(null)}
            />
            <ReadingList
              readings={readings}
              isLoading={readingsLoading}
              error={readingsError}
              onEdit={setEditingReading}
            />
          </div>
        </section>
        <footer className="dashboard-footer">Small steps, steady care. <span>♡</span></footer>
      </main>
    </>
  );
}
