function formatShortDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC'
  });
}

function formatRange(start, end) {
  const startMonth = new Date(`${start}T00:00:00`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
  const endMonth = new Date(`${end}T00:00:00`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
  if (startMonth === endMonth && start.slice(0, 4) === end.slice(0, 4)) {
    return `${formatShortDate(start)} – ${new Date(`${end}T00:00:00`).getUTCDate()} ${endMonth} ${end.slice(0, 4)}`;
  }
  return `${formatShortDate(start)} ${start.slice(0, 4)} – ${formatShortDate(end)} ${end.slice(0, 4)}`;
}

function ReportCard({ title, report, period, className = '' }) {
  return (
    <article className={`report-card ${className}`}>
      <div className="report-card-title">
        <div>
          <p className="eyebrow">{title}</p>
          <span className="report-period">{period}</span>
        </div>
        <span className="report-count">{report.count} {report.count === 1 ? 'reading' : 'readings'}</span>
      </div>
      {report.count === 0 ? (
        <p className="report-empty">No readings recorded in this period.</p>
      ) : (
        <div className="stat-grid">
          <div className="stat">
            <span>Highest</span><strong>{report.highest}</strong><small>mg/dl</small>
          </div>
          <div className="stat">
            <span>Lowest</span><strong>{report.lowest}</strong><small>mg/dl</small>
          </div>
          <div className="stat stat-average">
            <span>Average</span><strong>{Number(report.average).toFixed(1)}</strong><small>mg/dl</small>
          </div>
        </div>
      )}
    </article>
  );
}

export default function ReportCards({ reports, isLoading, error }) {
  if (isLoading) return <p className="muted-message">Updating your reports…</p>;
  if (error || !reports) return <p className="form-error" role="alert">Could not load reports. Please try again.</p>;

  return (
    <section className="reports-section">
      <div className="section-heading report-heading">
        <div>
          <p className="eyebrow">PERIOD SUMMARY</p>
          <h2>Glucose overview</h2>
        </div>
      </div>
      <div className="report-grid">
        <ReportCard title="Daily summary" period={formatShortDate(reports.daily.start)} report={reports.daily} className="daily-card" />
        <ReportCard title="This month" period={formatRange(reports.monthToDate.start, reports.monthToDate.end)} report={reports.monthToDate} />
        <ReportCard title="Last month" period={formatRange(reports.monthly.start, reports.monthly.end)} report={reports.monthly} />
      </div>
    </section>
  );
}
