import { useEffect, useState } from "react";
import useDebounce from "./useDebounce.js";

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const [recursos, setRecursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const q = useDebounce(busqueda, 300);

  useEffect(() => {
    const controlador = new AbortController();
    setCargando(true);
    setError(null);

    fetch(`/api/recursos?q=${encodeURIComponent(q)}`, { signal: controlador.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((json) => setRecursos(json.data))
      .catch((err) => {
        if (err.name !== "AbortError") setError("No se pudo conectar con la API. ¿Está encendido el backend?");
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });
    return () => controlador.abort();
  }, [q]);

  return (
    <main className="pagina">
      <header>
        <h1>Recursos de JavaScript avanzado</h1>
        <p className="sub">Escribe para filtrar por tema, categoría o nivel.</p>
      </header>

      <input
        className="buscador"
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Prueba con “asincronía”, “react” o “avanzado”"
        aria-label="Buscar recursos"
        autoFocus
      />

      <p className="estado" aria-live="polite">
        {error ? error : cargando ? "Buscando…" : `${recursos.length} resultado${recursos.length === 1 ? "" : "s"}`}
      </p>

      {!error && !cargando && recursos.length === 0 && (
        <p className="vacio">Prueba con otra palabra.</p>
      )}

      <ul className="lista">
        {recursos.map((r) => (
          <li key={r.id} className="item">
            <div className="item-top">
              <h2>{r.titulo}</h2>
              <span className={`nivel nivel-${r.nivel.toLowerCase()}`}>{r.nivel}</span>
            </div>
            <p>{r.descripcion}</p>
            <span className="cat">{r.categoria}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
