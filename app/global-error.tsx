"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "monospace", padding: "40px", background: "#f5ecd9", color: "#2b1f12" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "16px" }}>Erro no app</h1>
        <pre style={{ background: "#fff", padding: "16px", borderRadius: "4px", overflow: "auto", fontSize: "13px", marginBottom: "16px" }}>
          {error?.message || "Erro desconhecido"}
          {"\n\n"}
          {error?.stack || ""}
        </pre>
        {error?.digest && (
          <p style={{ fontSize: "12px", color: "#8b7350" }}>digest: {error.digest}</p>
        )}
        <button
          onClick={reset}
          style={{ marginTop: "16px", padding: "8px 16px", background: "#2b1f12", color: "#f5ecd9", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          tentar novamente
        </button>
      </body>
    </html>
  );
}
