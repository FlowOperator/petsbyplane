import React, { useState } from 'react';
import { MOCK_TRIPS, StaffTrip, getStatusLabel, getStatusVariant } from './data';
import { TripDetail } from './components/TripDetail';

type View = 'trips' | 'inbox' | 'detail';

export function App() {
  const [view, setView] = useState<View>('trips');
  const [selectedTrip, setSelectedTrip] = useState<StaffTrip | null>(null);
  const [trips, setTrips] = useState(MOCK_TRIPS);

  const activeTrips = trips.filter(t => t.status === 'active' || t.status === 'in_transit');
  const pendingTrips = trips.filter(t => t.status === 'quote_requested' || t.status === 'quote_sent' || t.status === 'deposit_pending');
  const newRequests = trips.filter(t => t.status === 'quote_requested');

  const handleTripClick = (trip: StaffTrip) => {
    setSelectedTrip(trip);
    setView('detail');
  };

  const handleMilestoneComplete = (tripId: string, milestoneId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      const milestones = trip.milestones.map((ms, i, arr) => {
        if (ms.id === milestoneId) {
          return { ...ms, status: 'completed' as const, completedAt: new Date().toISOString().split('T')[0] };
        }
        // Set next milestone as current
        if (i > 0 && arr[i - 1].id === milestoneId && ms.status === 'upcoming') {
          return { ...ms, status: 'current' as const };
        }
        return ms;
      });
      return { ...trip, milestones };
    }));
    // Update selected trip too
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(prev => {
        if (!prev) return prev;
        const milestones = prev.milestones.map((ms, i, arr) => {
          if (ms.id === milestoneId) {
            return { ...ms, status: 'completed' as const, completedAt: new Date().toISOString().split('T')[0] };
          }
          if (i > 0 && arr[i - 1].id === milestoneId && ms.status === 'upcoming') {
            return { ...ms, status: 'current' as const };
          }
          return ms;
        });
        return { ...prev, milestones };
      });
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🐾</div>
          <h2>Staff Portal</h2>
        </div>
        <button className={`sidebar-nav-item ${view === 'trips' ? 'active' : ''}`} onClick={() => setView('trips')}>
          <span className="sidebar-nav-icon">📋</span> All trips
        </button>
        <button className={`sidebar-nav-item ${view === 'inbox' ? 'active' : ''}`} onClick={() => setView('inbox')}>
          <span className="sidebar-nav-icon">📥</span> Inbox
          {newRequests.length > 0 && <span style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', borderRadius: 10, padding: '2px 7px', fontSize: 11, fontWeight: 700 }}>{newRequests.length}</span>}
        </button>
      </aside>

      {/* Main */}
      <main className="main-content">
        {view === 'trips' && (
          <TripsView
            activeTrips={activeTrips}
            pendingTrips={pendingTrips}
            allTrips={trips}
            onTripClick={handleTripClick}
          />
        )}
        {view === 'inbox' && (
          <InboxView
            requests={pendingTrips}
            onTripClick={handleTripClick}
          />
        )}
        {view === 'detail' && selectedTrip && (
          <TripDetail
            trip={selectedTrip}
            onBack={() => setView('trips')}
            onMilestoneComplete={handleMilestoneComplete}
          />
        )}
      </main>
    </div>
  );
}

// ─── Trips View ──────────────────────────────────────────────────────

function TripsView({ activeTrips, pendingTrips, allTrips, onTripClick }: {
  activeTrips: StaffTrip[];
  pendingTrips: StaffTrip[];
  allTrips: StaffTrip[];
  onTripClick: (trip: StaffTrip) => void;
}) {
  return (
    <>
      <div className="page-header">
        <h1>Active trips</h1>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{activeTrips.length}</div>
          <div className="stat-label">In progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{pendingTrips.length}</div>
          <div className="stat-label">Pending action</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{allTrips.length}</div>
          <div className="stat-label">Total bookings</div>
        </div>
      </div>

      <table className="trip-table">
        <thead>
          <tr>
            <th>Pet</th>
            <th>Owner</th>
            <th>Route</th>
            <th>Travel date</th>
            <th>Status</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {allTrips.map(trip => (
            <tr key={trip.id} className="trip-row" onClick={() => onTripClick(trip)}>
              <td>
                <strong>{trip.petName}</strong>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{trip.breed}</div>
              </td>
              <td>{trip.ownerName}</td>
              <td><strong>{trip.origin} → {trip.destination}</strong></td>
              <td>{trip.travelDate || '—'}</td>
              <td>
                <span className={`status-badge ${getStatusVariant(trip.status)}`}>
                  <span className="status-dot" />
                  {getStatusLabel(trip.status)}
                </span>
              </td>
              <td><span className={`source-badge ${trip.source}`}>{trip.source}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ─── Inbox View ──────────────────────────────────────────────────────

function InboxView({ requests, onTripClick }: {
  requests: StaffTrip[];
  onTripClick: (trip: StaffTrip) => void;
}) {
  return (
    <>
      <div className="page-header">
        <h1>Quote inbox</h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
        New quote requests from the app and website. Tap to review and prepare a quote.
      </p>

      {requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>✨</p>
          <p style={{ fontWeight: 700 }}>All caught up!</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>No pending requests right now.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {requests.map(trip => (
            <div key={trip.id} className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }} onClick={() => onTripClick(trip)}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {trip.petSpecies === 'dog' ? '🐕' : trip.petSpecies === 'cat' ? '🐱' : '🐾'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{trip.petName} — {trip.breed}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{trip.ownerName} · {trip.origin} → {trip.destination}</div>
              </div>
              <span className={`source-badge ${trip.source}`}>{trip.source}</span>
              <span className={`status-badge ${getStatusVariant(trip.status)}`}>
                <span className="status-dot" />
                {getStatusLabel(trip.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
