import { Trip, Stop, Note } from "@/types";
import { STOP_TYPE_CONFIG, NOTE_TYPE_CONFIG, BRAND_PHRASE } from "@/lib/constants";
import { formatDate, formatDuration, tripDays } from "@/lib/utils";

interface PrintLayoutProps {
  trip: Trip;
  stops: Stop[];
  notes: Note[];
}

export default function PrintLayout({ trip, stops, notes }: PrintLayoutProps) {
  const days = tripDays(trip.start_date, trip.end_date);
  const checklists = notes.filter((n) => n.type === "checklist");
  const reminders = notes.filter((n) => n.type === "reminder");
  const ideas = notes.filter((n) => n.type === "idea");

  return (
    <div className="print-layout">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; background: white; }
          .print-layout { padding: 24px; max-width: 800px; margin: 0 auto; font-family: 'Inter', sans-serif; color: #2B2B2B; }
          .no-print { display: none !important; }
          @page { margin: 20mm; }
        }
        @media screen {
          .print-layout { padding: 40px; max-width: 800px; margin: 0 auto; font-family: 'Inter', sans-serif; color: #2B2B2B; background: white; min-height: 100vh; }
        }
        .print-layout * { box-sizing: border-box; }
        .print-layout h1 { font-size: 28px; font-weight: 800; margin: 0 0 4px 0; }
        .print-layout h2 { font-size: 16px; font-weight: 700; margin: 24px 0 12px 0; border-bottom: 2px solid #F4C430; padding-bottom: 6px; }
        .print-layout h3 { font-size: 14px; font-weight: 600; margin: 0 0 4px 0; }
        .print-layout p { margin: 0; }
        .header { margin-bottom: 28px; border-bottom: 3px solid #F4C430; padding-bottom: 20px; }
        .header-sub { color: #8A8A8A; font-size: 14px; margin-top: 4px; }
        .route { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; margin-top: 12px; }
        .route-arrow { color: #F4C430; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
        .summary-item { text-align: center; border: 1px solid #EBEBEB; border-radius: 12px; padding: 12px 8px; }
        .summary-value { font-size: 22px; font-weight: 800; }
        .summary-label { font-size: 11px; color: #8A8A8A; margin-top: 2px; }
        .stop-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F0F0F0; }
        .stop-number { width: 28px; height: 28px; border-radius: 50%; background: #FFF3B0; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
        .stop-content { flex: 1; }
        .stop-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; font-size: 12px; color: #8A8A8A; }
        .stop-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; padding: 2px 8px; border-radius: 8px; background: #F5F5F5; }
        .stop-detail { margin-top: 6px; font-size: 12px; color: #555; font-style: italic; }
        .note-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; font-size: 13px; }
        .checkbox { width: 16px; height: 16px; border: 2px solid #EBEBEB; border-radius: 4px; flex-shrink: 0; margin-top: 1px; }
        .annotation-block { border: 1px solid #EBEBEB; border-radius: 12px; padding: 12px; margin-top: 8px; }
        .annotation-lines { border-bottom: 1px solid #F0F0F0; margin-top: 8px; height: 24px; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 2px solid #F4C430; text-align: center; color: #8A8A8A; font-size: 12px; font-style: italic; }
      `}</style>

      <div className="header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1>{trip.name}</h1>
            <p className="header-sub">
              {trip.start_date ? formatDate(trip.start_date) : ""}
              {trip.start_date && trip.end_date ? " → " : ""}
              {trip.end_date ? formatDate(trip.end_date) : ""}
              {days > 1 ? ` · ${days} dias` : ""}
            </p>
          </div>
          <div style={{ fontSize: "40px" }}>✈️</div>
        </div>
        <div className="route">
          <span>{trip.origin}</span>
          <span className="route-arrow">→</span>
          <span>{trip.destination}</span>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-item">
          <div className="summary-value">{stops.length}</div>
          <div className="summary-label">paradas</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{days}</div>
          <div className="summary-label">dias</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">
            {stops.filter((s) => s.duration_minutes).reduce((a, s) => a + (s.duration_minutes ?? 0), 0) > 0
              ? formatDuration(stops.reduce((a, s) => a + (s.duration_minutes ?? 0), 0))
              : "—"}
          </div>
          <div className="summary-label">tempo total</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{notes.length}</div>
          <div className="summary-label">notas</div>
        </div>
      </div>

      {stops.length > 0 && (
        <>
          <h2>🗺️ Roteiro</h2>
          <div style={{ marginBottom: "24px" }}>
            <div className="stop-item" style={{ borderBottom: "2px solid #F4C430" }}>
              <div className="stop-number" style={{ background: "#F4C430" }}>🟡</div>
              <div className="stop-content">
                <h3>{trip.origin}</h3>
                <div className="stop-meta">Ponto de partida</div>
              </div>
            </div>

            {stops.map((stop, i) => {
              const cfg = STOP_TYPE_CONFIG[stop.type];
              return (
                <div key={stop.id} className="stop-item">
                  <div className="stop-number">{i + 1}</div>
                  <div className="stop-content">
                    <h3>{stop.name}</h3>
                    <div className="stop-meta">
                      <span className="stop-badge">
                        {cfg.emoji} {cfg.label}
                      </span>
                      {stop.arrival_time && <span>⏰ {stop.arrival_time}</span>}
                      {stop.duration_minutes && (
                        <span>🕐 {formatDuration(stop.duration_minutes)}</span>
                      )}
                      {stop.address && <span>📍 {stop.address}</span>}
                    </div>
                    {stop.comment && (
                      <p className="stop-detail">{stop.comment}</p>
                    )}
                    {stop.expected_moment && (
                      <p className="stop-detail">
                        💛 "{stop.expected_moment}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="stop-item" style={{ borderBottom: "none" }}>
              <div className="stop-number" style={{ background: "#7FB77E" }}>🟢</div>
              <div className="stop-content">
                <h3>{trip.destination}</h3>
                <div className="stop-meta">Destino final</div>
              </div>
            </div>
          </div>
        </>
      )}

      {checklists.length > 0 && (
        <>
          <h2>✅ Checklist</h2>
          <div style={{ marginBottom: "20px" }}>
            {checklists.map((note) => (
              <div key={note.id} className="note-item">
                <div className="checkbox" />
                <span>{note.content}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {reminders.length > 0 && (
        <>
          <h2>🔔 Lembretes</h2>
          <div style={{ marginBottom: "20px" }}>
            {reminders.map((note) => (
              <div key={note.id} className="note-item">
                <span>•</span>
                <span>{note.content}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {ideas.length > 0 && (
        <>
          <h2>💡 Ideias</h2>
          <div style={{ marginBottom: "20px" }}>
            {ideas.map((note) => (
              <div key={note.id} className="note-item">
                <span>•</span>
                <span>{note.content}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <h2>✏️ Anotações no caminho</h2>
      <div className="annotation-block">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="annotation-lines" />
        ))}
      </div>

      {trip.observations && (
        <>
          <h2>📌 Observações</h2>
          <p style={{ fontSize: "13px", color: "#555" }}>{trip.observations}</p>
        </>
      )}

      <div className="footer">
        <p>{BRAND_PHRASE}</p>
        <p style={{ marginTop: "4px", fontSize: "11px" }}>
          Birk&apos;s Trip · Lucas & Rox
        </p>
      </div>
    </div>
  );
}
