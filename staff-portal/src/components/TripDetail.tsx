import React from 'react';
import { StaffTrip, getStatusLabel, getStatusVariant } from '../data';

interface TripDetailProps {
  trip: StaffTrip;
  onBack: () => void;
  onMilestoneComplete: (tripId: string, milestoneId: string) => void;
}

export function TripDetail({ trip, onBack, onMilestoneComplete }: TripDetailProps) {
  const pendingDocs = trip.documents.filter(d => d.status === 'missing');
  const uploadedDocs = trip.documents.filter(d => d.status === 'uploaded');

  return (
    <>
      {/* Back link */}
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 16, padding: 0 }}>
        ← Back to trips
      </button>

      {/* Header */}
      <div className="detail-header">
        <div className="detail-avatar">🐾</div>
        <div className="detail-meta">
          <div className="detail-name">{trip.petName}</div>
          <div className="detail-route">{trip.breed} · {trip.origin} → {trip.destination}</div>
        </div>
        <span className={`status-badge ${getStatusVariant(trip.status)}`}>
          <span className="status-dot" />
          {getStatusLabel(trip.status)}
        </span>
      </div>

      {/* Info grid */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="detail-grid">
          <div>
            <div className="detail-field-label">Owner</div>
            <div className="detail-field-value">{trip.ownerName}</div>
          </div>
          <div>
            <div className="detail-field-label">Contact</div>
            <div className="detail-field-value">{trip.ownerPhone}</div>
          </div>
          <div>
            <div className="detail-field-label">Travel date</div>
            <div className="detail-field-value">{trip.travelDate || 'TBC'}</div>
          </div>
          <div>
            <div className="detail-field-label">Source</div>
            <div className="detail-field-value"><span className={`source-badge ${trip.source}`}>{trip.source}</span></div>
          </div>
          <div>
            <div className="detail-field-label">Consultant</div>
            <div className="detail-field-value">{trip.consultant}</div>
          </div>
          {trip.quote && (
            <div>
              <div className="detail-field-label">Quote total</div>
              <div className="detail-field-value">£{trip.quote.amount.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout: milestones + documents */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Milestones */}
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Journey milestones</h3>
          {trip.milestones.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No milestones yet — quote needs to be accepted first.</p>
          ) : (
            <div className="milestone-list">
              {trip.milestones.map(ms => (
                <div key={ms.id} className={`milestone-item ${ms.status}`}>
                  <div className="milestone-dot">
                    {ms.status === 'completed' ? '✓' : ms.status === 'current' ? '●' : ms.order}
                  </div>
                  <div className="milestone-content">
                    <div className="milestone-title">{ms.title}</div>
                    <div className="milestone-desc">{ms.description}</div>
                    {ms.completedAt && <div className="milestone-date">Completed {ms.completedAt}</div>}
                    {ms.plannedDate && ms.status !== 'completed' && <div className="milestone-date">Planned: {ms.plannedDate}</div>}
                  </div>
                  {ms.status === 'current' && (
                    <button
                      className="milestone-action mark-done"
                      onClick={() => onMilestoneComplete(trip.id, ms.id)}
                    >
                      Mark done ✓
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Documents</h3>
          {trip.documents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No documents required yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {trip.documents.map(doc => (
                <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg)', borderRadius: 'var(--radius)', fontSize: 13 }}>
                  <span style={{ fontSize: 16 }}>
                    {doc.status === 'verified' ? '✅' : doc.status === 'uploaded' ? '📄' : doc.status === 'expiring_soon' ? '⚠️' : '⬜'}
                  </span>
                  <span style={{ flex: 1, fontWeight: 600 }}>{doc.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: doc.status === 'missing' ? 'var(--primary)' : doc.status === 'verified' ? 'var(--success)' : 'var(--text-muted)' }}>
                    {doc.status === 'missing' ? 'Missing' : doc.status === 'uploaded' ? 'Needs review' : doc.status === 'verified' ? 'Verified' : 'Expiring'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {trip.documents.length > 0 && (
            <div style={{ marginTop: 16, padding: '10px 12px', background: pendingDocs.length > 0 ? 'rgba(232, 98, 61, 0.08)' : 'var(--success-light)', borderRadius: 'var(--radius)', fontSize: 12, fontWeight: 700, color: pendingDocs.length > 0 ? 'var(--primary)' : 'var(--success)' }}>
              {pendingDocs.length > 0
                ? `${pendingDocs.length} document${pendingDocs.length > 1 ? 's' : ''} still needed`
                : uploadedDocs.length > 0
                ? `${uploadedDocs.length} uploaded, pending your review`
                : 'All documents verified ✓'}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button className="btn btn-primary">📱 Message owner</button>
        <button className="btn" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>📋 Copy details</button>
        <button className="btn" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>📅 Add to calendar</button>
      </div>
    </>
  );
}
