/* ============================================================
   MenteActiva · app.js — Arranque del núcleo (Fase 1)
   Carga los datos centralizados, aplica la configuración
   guardada y registra las vistas del shell. Los juegos llegan
   en las Fases 2 y 3 mediante el sistema de plugins (§6).
   ============================================================ */

(function () {
  "use strict";

  window.MA = window.MA || {};
  MA.datos = { areas: [], mensajes: {} };

  var C = null; // atajo a MA.componentes (se asigna al iniciar)

  /* ---------- Configuración: aplicar en vivo lo guardado ---------- */

  /**
   * Aplica tamaño de texto y reducción de movimiento al documento.
   * @param {Object} config - { tamanoTexto, reducirMovimiento }
   */
  function aplicarConfig(config) {
    document.documentElement.setAttribute("data-tamano", config.tamanoTexto || "normal");
    document.documentElement.classList.toggle("reducir-movimiento", !!config.reducirMovimiento);
  }

  /* ---------- Vistas ---------- */

  /** Pantalla principal: saludo + 4 tarjetas de menú. */
  function vistaInicio() {
    var raiz = document.createElement("div");
    raiz.style.display = "contents";

    var saludo = document.createElement("header");
    saludo.className = "saludo";
    var h1 = document.createElement("h1");
    var hora = new Date().getHours();
    h1.textContent = hora < 12 ? "¡Buen día! ☀️" : (hora < 19 ? "¡Buenas tardes! 🌤️" : "¡Buenas noches! 🌙");
    var p = document.createElement("p");
    p.textContent = "¿Qué te gustaría hacer hoy?";
    saludo.appendChild(h1);
    saludo.appendChild(p);
    raiz.appendChild(saludo);

    var menu = [
      { icono: "🌅", nombre: "Entrenar hoy",     detalle: "El desafío del día, a tu ritmo",      ruta: "desafio" },
      { icono: "🎲", nombre: "Todos los juegos", detalle: "Elegí por área lo que más te guste",  ruta: "juegos" },
      { icono: "🌱", nombre: "Mi progreso",      detalle: "Tu constancia, día a día",            ruta: "progreso" },
      { icono: "⚙️", nombre: "Configuración",    detalle: "Tamaño de letra y preferencias",      ruta: "config" }
    ];

    var lista = document.createElement("div");
    lista.className = "lista";
    menu.forEach(function (item) {
      var tarjeta = document.createElement("button");
      tarjeta.className = "tarjeta";
      tarjeta.innerHTML = "";
      var icono = document.createElement("span");
      icono.className = "icono";
      icono.setAttribute("aria-hidden", "true");
      icono.textContent = item.icono;
      var textos = document.createElement("span");
      textos.className = "textos";
      var nombre = document.createElement("span");
      nombre.className = "nombre";
      nombre.textContent = item.nombre;
      var detalle = document.createElement("span");
      detalle.className = "detalle";
      detalle.textContent = item.detalle;
      textos.appendChild(nombre);
      textos.appendChild(detalle);
      tarjeta.appendChild(icono);
      tarjeta.appendChild(textos);
      tarjeta.addEventListener("click", function () { MA.nav.ir(item.ruta); });
      lista.appendChild(tarjeta);
    });
    raiz.appendChild(lista);

    return raiz;
  }

  /** Todos los juegos: las 7 áreas cognitivas. */
  function vistaJuegos() {
    var raiz = document.createElement("div");
    raiz.style.display = "contents";
    raiz.appendChild(C.encabezado("Todos los juegos", "inicio"));

    var lista = document.createElement("div");
    lista.className = "lista";
    MA.datos.areas.forEach(function (area) {
      /* La cantidad real saldrá de games/registry.json (Fase 2). */
      lista.appendChild(C.tarjetaArea(area, 0));
    });
    raiz.appendChild(lista);
    return raiz;
  }

  /** Un área: lista de juegos (vacía con calidez hasta la Fase 3). */
  function vistaArea(idArea) {
    var area = MA.datos.areas.find(function (a) { return a.id === idArea; });
    var raiz = document.createElement("div");
    raiz.style.display = "contents";
    raiz.appendChild(C.encabezado(area ? area.emoji + " " + area.nombre : "Juegos", "juegos"));

    var vacio = document.createElement("div");
    vacio.className = "estado-vacio";
    var icono = document.createElement("div");
    icono.className = "icono";
    icono.textContent = "🌱";
    var texto = document.createElement("p");
    texto.textContent = "Los juegos de esta área están en camino. ¡Muy pronto vas a poder jugarlos acá!";
    vacio.appendChild(icono);
    vacio.appendChild(texto);
    raiz.appendChild(vacio);
    return raiz;
  }

  /** Entrenar hoy: el desafío llega en la Fase 4; invitación amable. */
  function vistaDesafio() {
    var raiz = document.createElement("div");
    raiz.style.display = "contents";
    raiz.appendChild(C.encabezado("🌅 Entrenar hoy", "inicio"));

    var vacio = document.createElement("div");
    vacio.className = "estado-vacio";
    var icono = document.createElement("div");
    icono.className = "icono";
    icono.textContent = "🌅";
    var texto = document.createElement("p");
    texto.textContent = "El desafío del día se está preparando. Mientras tanto, podés recorrer la app con tranquilidad.";
    vacio.appendChild(icono);
    vacio.appendChild(texto);
    raiz.appendChild(vacio);

    var zona = document.createElement("div");
    zona.className = "zona-accion";
    zona.appendChild(C.botonGrande("Volver al inicio", function () { MA.nav.ir("inicio"); }, "secundario"));
    raiz.appendChild(zona);
    return raiz;
  }

  /** Mi progreso: espejo amable de la constancia (§3.6). */
  function vistaProgreso() {
    var datos = MA.almacenamiento.leer();
    var raiz = document.createElement("div");
    raiz.style.display = "contents";
    raiz.appendChild(C.encabezado("🌱 Mi progreso", "inicio"));

    if (datos.diasJugados.length === 0) {
      var vacio = document.createElement("div");
      vacio.className = "estado-vacio";
      var icono = document.createElement("div");
      icono.className = "icono";
      icono.textContent = "🌱";
      var texto = document.createElement("p");
      texto.textContent = "Tu jardín está listo para crecer. Cada día que juegues, esta pantalla lo va a recordar con vos.";
      vacio.appendChild(icono);
      vacio.appendChild(texto);
      raiz.appendChild(vacio);
      return raiz;
    }

    var grupo = document.createElement("div");
    grupo.className = "grupo-config";
    [
      ["Días compartidos", String(datos.diasJugados.length) + " ☀️"],
      ["Racha actual", String(datos.rachaActual) + (datos.rachaActual === 1 ? " día" : " días")],
      ["Mejor racha", String(datos.mejorRacha) + (datos.mejorRacha === 1 ? " día" : " días")],
      ["Desafíos completados", String(datos.desafios.completados)]
    ].forEach(function (par) {
      var fila = document.createElement("div");
      fila.className = "dato-progreso";
      var etiqueta = document.createElement("span");
      etiqueta.textContent = par[0];
      var valor = document.createElement("span");
      valor.className = "valor";
      valor.textContent = par[1];
      fila.appendChild(etiqueta);
      fila.appendChild(valor);
      grupo.appendChild(fila);
    });
    raiz.appendChild(grupo);
    return raiz;
  }

  /** Configuración: tamaño de texto, animaciones y borrado de datos. */
  function vistaConfig() {
    var raiz = document.createElement("div");
    raiz.style.display = "contents";
    raiz.appendChild(C.encabezado("⚙️ Configuración", "inicio"));

    var datos = MA.almacenamiento.leer();

    /* --- Tamaño del texto (aplica en vivo y se guarda) --- */
    var grupoTexto = document.createElement("div");
    grupoTexto.className = "grupo-config";
    var tituloTexto = document.createElement("div");
    tituloTexto.className = "titulo-grupo";
    tituloTexto.textContent = "Tamaño del texto";
    grupoTexto.appendChild(tituloTexto);

    var opciones = document.createElement("div");
    opciones.className = "opciones-tamano";
    opciones.setAttribute("role", "group");
    opciones.setAttribute("aria-label", "Tamaño del texto");

    [["normal", "Normal"], ["grande", "Grande"], ["muy-grande", "Muy grande"]].forEach(function (par) {
      var boton = document.createElement("button");
      boton.className = "opcion-tamano";
      boton.textContent = par[1];
      boton.setAttribute("aria-pressed", String(datos.config.tamanoTexto === par[0]));
      boton.addEventListener("click", function () {
        var nuevo = MA.almacenamiento.actualizar(function (d) {
          d.config.tamanoTexto = par[0];
          return d;
        });
        aplicarConfig(nuevo.config);
        opciones.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
        });
        boton.setAttribute("aria-pressed", "true");
        C.mensajeAmable("guardado");
      });
      opciones.appendChild(boton);
    });
    grupoTexto.appendChild(opciones);
    raiz.appendChild(grupoTexto);

    /* --- Reducir animaciones --- */
    var grupoMov = document.createElement("div");
    grupoMov.className = "grupo-config";
    var interruptor = document.createElement("button");
    interruptor.className = "interruptor";
    interruptor.setAttribute("aria-pressed", String(!!datos.config.reducirMovimiento));
    var etiqueta = document.createElement("span");
    etiqueta.textContent = "Reducir animaciones";
    var estado = document.createElement("span");
    estado.className = "estado";
    estado.textContent = datos.config.reducirMovimiento ? "Activado" : "Desactivado";
    interruptor.appendChild(etiqueta);
    interruptor.appendChild(estado);
    interruptor.addEventListener("click", function () {
      var nuevo = MA.almacenamiento.actualizar(function (d) {
        d.config.reducirMovimiento = !d.config.reducirMovimiento;
        return d;
      });
      aplicarConfig(nuevo.config);
      interruptor.setAttribute("aria-pressed", String(nuevo.config.reducirMovimiento));
      estado.textContent = nuevo.config.reducirMovimiento ? "Activado" : "Desactivado";
      C.mensajeAmable("guardado");
    });
    grupoMov.appendChild(interruptor);
    raiz.appendChild(grupoMov);

    /* --- Borrar mis datos: confirmación amable en línea, sin ventanas --- */
    var grupoBorrar = document.createElement("div");
    grupoBorrar.className = "grupo-config confirmacion";
    var botonBorrar = C.botonGrande("Borrar mis datos", function () {
      grupoBorrar.replaceChildren();
      var pregunta = document.createElement("p");
      pregunta.textContent = "¿Querés borrar todo tu progreso? Podés empezar de nuevo cuando quieras.";
      grupoBorrar.appendChild(pregunta);
      grupoBorrar.appendChild(C.botonGrande("Sí, borrar todo", function () {
        MA.almacenamiento.borrarTodo();
        aplicarConfig(MA.almacenamiento.leer().config);
        MA.nav.ir("inicio");
        C.mensajeAmable("bienvenida");
      }, "primario"));
      grupoBorrar.appendChild(C.botonGrande("No, conservar mis datos", function () {
        MA.nav.pintar(); /* vuelve a dibujar Configuración intacta */
      }, "secundario"));
    }, "secundario");
    grupoBorrar.appendChild(botonBorrar);
    raiz.appendChild(grupoBorrar);

    return raiz;
  }

  /* ---------- Arranque ---------- */

  function iniciar() {
    C = MA.componentes;
    aplicarConfig(MA.almacenamiento.leer().config);

    MA.nav.registrar("inicio",   vistaInicio);
    MA.nav.registrar("juegos",   vistaJuegos);
    MA.nav.registrar("area",     vistaArea);
    MA.nav.registrar("desafio",  vistaDesafio);
    MA.nav.registrar("progreso", vistaProgreso);
    MA.nav.registrar("config",   vistaConfig);

    /* Datos centralizados. Requiere servirse por HTTP (§6.6.4):
       en local, `npx serve`; publicado, GitHub Pages. */
    Promise.all([
      fetch("data/areas.json").then(function (r) { return r.json(); }),
      fetch("data/mensajes.json").then(function (r) { return r.json(); })
    ]).then(function (resultados) {
      MA.datos.areas = resultados[0].areas;
      MA.datos.mensajes = resultados[1];
      MA.nav.pintar();
    }).catch(function () {
      /* Si los datos no cargan (ej. abierto como archivo suelto),
         la app avisa con calma en lugar de quedarse en blanco. */
      var app = document.getElementById("app");
      var aviso = document.createElement("div");
      aviso.className = "estado-vacio";
      aviso.innerHTML = "<div class='icono'>🌤️</div><p>Para ver la aplicación, abrila desde un pequeño servidor local (por ejemplo <strong>npx serve</strong>) o desde su dirección publicada.</p>";
      app.replaceChildren(aviso);
    });
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();
