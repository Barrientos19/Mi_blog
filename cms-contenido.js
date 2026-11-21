/* Conecta el blog con la API del CMS (GET /exportar: solo contenido publicado).
 * Si la API no responde, se queda el contenido fijo del HTML. */
(() => {
  const API = window.CMS_API_BLOG || `http://${location.hostname || 'localhost'}:8001`;

  const el = (etiqueta, props = {}, hijos = []) => {
    const nodo = Object.assign(document.createElement(etiqueta), props);
    nodo.append(...hijos);
    return nodo;
  };

  const fechaCorta = (iso) => {
    const f = new Date(`${iso}T00:00:00`);
    if (isNaN(f)) return iso;
    const mes = f.toLocaleDateString('es-MX', { month: 'long' });
    return `${f.getDate()} de ${mes.charAt(0).toUpperCase()}${mes.slice(1)}`;
  };

  function pintarProyectos(proyectos) {
    const grid = document.querySelector('#proyectos .grid-proyectos');
    grid.replaceChildren(...proyectos.map((p) => {
      const titulo = p.enlace ? el('a', { href: p.enlace, textContent: p.titulo }) : p.titulo;
      return el('div', { className: 'tarjeta-proyecto' }, [
        ...(p.imagen ? [el('img', { src: p.imagen, alt: p.titulo })] : []),
        el('h3', {}, [titulo]),
        el('p', { textContent: p.descripcion }),
      ]);
    }));
  }

  function pintarIdeas(ideas) {
    const grid = document.querySelector('#ideas .grid-ideas');
    grid.replaceChildren(...ideas.map((i) => el('div', { className: 'tarjeta-idea' }, [
      el('span', { className: 'fecha', textContent: fechaCorta(i.fecha) }),
      el('h3', { textContent: i.titulo }),
      el('p', { textContent: i.resumen }),
    ])));
  }

  fetch(`${API}/exportar`)
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((datos) => { pintarProyectos(datos.proyectos); pintarIdeas(datos.ideas); })
    .catch(() => console.warn('API del blog no disponible: se muestra el contenido fijo.'));
})();
