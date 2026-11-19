const express = require("express");
const cors = require("cors");
const datos = require("./data.json");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const normalizar = (t) =>
  String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

app.get("/api/recursos", (req, res) => {
  const q = normalizar(req.query.q || "");
  const resultado = q
    ? datos.filter((r) =>
        normalizar(`${r.titulo} ${r.categoria} ${r.nivel} ${r.descripcion}`).includes(q)
      )
    : datos;

  res.json({ total: resultado.length, data: resultado });
});

app.get("/api/recursos/:id", (req, res) => {
  const item = datos.find((r) => r.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Recurso no encontrado" });
  res.json(item);
});

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}/api/recursos`));
