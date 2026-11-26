/**
 * ADVIENTO CERO — EXPEDIENTE BASE DEL CASO (CERO SPOILERS)
 * ---------------------------------------------------------
 * Premisa oficial del Hotel El Mirador del Ventisquero (Benasque, Huesca).
 */

window.CASE_LORE = {
  caseCode: "D.P. 24-12/2026 · VALLE DEL VENTISQUERO",
  hotelName: "Hotel El Mirador del Ventisquero",
  location: "Pirineo Aragonés · Cota 1.940 m",
  victim: {
    name: "Arturo Valdivieso y Monreal",
    age: 59,
    role: "Copropietario y Presidente del Grupo Valdivieso",
    foundAt: "30 de noviembre · 23:55 h · Salón Mirador (junto al abeto central)",
    initialFinding: "Aparente colapso súbito tras un apagón eléctrico de cuatro minutos (23:38–23:42). Copa de ponche especiado volcada sobre la mesa de pizarra y signos de intoxicación aguda."
  },
  incidentSummary: [
    "Una ciclogénesis explosiva ha sepultado la carretera de acceso y bloqueado el teleférico desde las 19:00 h del 30 de noviembre.",
    "Nadie puede entrar ni salir del complejo hasta que amaine la ventisca. En el hotel permanecen exactamente 25 personas entre huéspedes VIP y plantilla.",
    "Del 1 al 24 de diciembre analizaréis juntos los indicios diarios combinando las terminales de Miguel y Patri: resolveréis 22 descartes únicos y 2 diligencias abiertas hasta enfrentar a los 3 sospechosos finalistas en el Careo Final de Nochebuena."
  ],
  scenes: [
    {
      id: "cover",
      title: "Fachada del Hotel bajo la ventisca",
      caption: "Cota 1.940 m · Teleférico detenido y carreteras cortadas desde las 19:00 h.",
      src: "imagenes/cover-hotel.jpg"
    },
    {
      id: "lobby",
      title: "Salón Mirador · Escena 01",
      caption: "Abeto central y mesa de pizarra donde se halló a Arturo Valdivieso a las 23:55 h.",
      src: "imagenes/scene-lobby.jpg"
    },
    {
      id: "balcony",
      title: "Terraza Acristalada y Estación del Teleférico",
      caption: "Acceso exterior al Ala Norte con huellas recientes sobre la nieve acumulada.",
      src: "imagenes/scene-balcony.jpg"
    }
  ],
  hotelZones: [
    { floor: "Planta 3", zone: "Suites Presidenciales (301–305)", note: "Cinco suites panorámicas de alta privacidad, galería superior, ascensor VIP y acceso a la terraza norte." },
    { floor: "Planta 2", zone: "Habitaciones Sur & Biblioteca (201–208)", note: "Ala de huéspedes VIP, Sala de Lectura silenciosa, Biblioteca de madera y Archivo Histórico del complejo." },
    { floor: "Planta 1", zone: "Salón Mirador, Recepción, Spa y Capilla (101–108)", note: "Escena del hallazgo (23:55 h), mostrador de Recepción, zona termal y pasillo técnico del apagón (23:38–23:42 h)." },
    { floor: "Sótano / Anexo", zone: "Cocina, Bodega, Calderas y Ala Servicio", note: "Fogones y cámara fría, sala de calderas, dormitorios de plantilla (Ala A–E) y Cabaña Norte junto al teleférico." }
  ]
};
