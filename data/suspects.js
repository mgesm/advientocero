/**
 * ADVIENTO CERO — REGISTRO DE LOS 25 SOSPECHOSOS
 * -----------------------------------------------
 * Todos los nombres, habitaciones, coartadas y día de descubrimiento progresivo.
 */

window.SUSPECTS_DATA = [
  {
    id: "s01", num: "01", name: "Beatriz Valdivieso", age: 52, discoveredDay: 21,
    role: "Hermana y socia minoritaria", room: "Suite 301", group: "Huésped",
    motiveHint: "Se oponía frontalmente a la venta del hotel familiar.",
    alibiClaim: "Asegura haber bajado a la Sala de Lectura de la Planta 2 antes del apagón.",
    portrait: "imagenes/suspects/s01.jpg"
  },
  {
    id: "s02", num: "02", name: "Héctor Salgado", age: 44, discoveredDay: 17,
    role: "Chef ejecutivo", room: "Ala Servicio A", group: "Personal",
    motiveHint: "Arturo rechazó su presupuesto y amenazó con externalizar la cocina.",
    alibiClaim: "Afirma no haber salido de los fogones preparando los postres de gala.",
    portrait: "imagenes/suspects/s02.jpg"
  },
  {
    id: "s03", num: "03", name: "Carmen Ibáñez", age: 53, discoveredDay: 7,
    role: "Directora del hotel", room: "Hab. 102", group: "Personal",
    motiveHint: "Lleva 12 años dirigiendo el complejo y temía ser relevada tras la venta.",
    alibiClaim: "Declara que revisaba la lista de llegadas en el despacho de Dirección.",
    portrait: "imagenes/suspects/s03.jpg"
  },
  {
    id: "s04", num: "04", name: "Mateo Soler", age: 36, discoveredDay: 9,
    role: "Guía alpino y jefe de teleférico", room: "Cabaña Norte", group: "Personal",
    motiveHint: "Discutió con Arturo esa tarde por abrir el teleférico pese al temporal.",
    alibiClaim: "Sostiene que estaba retirando hielo de la polea exterior con la ventisca.",
    portrait: "imagenes/suspects/s04.jpg"
  },
  {
    id: "s05", num: "05", name: "Lucía Montalvo", age: 31, discoveredDay: 5,
    role: "Periodista de viajes", room: "Hab. 204", group: "Huésped",
    motiveHint: "Investigaba en secreto irregularidades urbanísticas del hotel.",
    alibiClaim: "Dice que se retiró a la Biblioteca a redactar su crónica nocturna.",
    portrait: "imagenes/suspects/s05.jpg"
  },
  {
    id: "s06", num: "06", name: "Ricardo Peña", age: 58, discoveredDay: 15,
    role: "Constructor y acreedor", room: "Suite 302", group: "Huésped",
    motiveHint: "Arturo le retenía una factura impagada de 240.000 euros por la reforma.",
    alibiClaim: "Asegura haber firmado un pagaré de urgencia en la recepción anexa.",
    portrait: "imagenes/suspects/s06.jpg"
  },
  {
    id: "s07", num: "07", name: "Nora Echevarría", age: 39, discoveredDay: 20,
    role: "Sumiller jefe", room: "Ala Servicio B", group: "Personal",
    motiveHint: "Discrepaba por la falsificación de añadas en la carta privada.",
    alibiClaim: "Mantiene que estaba catalogando botellas de reserva en la cava inferior.",
    portrait: "imagenes/suspects/s07.jpg"
  },
  {
    id: "s08", num: "08", name: "Tomás Bermúdez", age: 61, discoveredDay: 3,
    role: "Conserje nocturno", room: "Recepción / Sótano", group: "Personal",
    motiveHint: "Su pensión interna dependía de un acuerdo verbal nunca firmado.",
    alibiClaim: "Indica que bajó al almacén del sótano a recoger mantas térmicas.",
    portrait: "imagenes/suspects/s08.jpg"
  },
  {
    id: "s09", num: "09", name: "Valeria Domínguez", age: 49, discoveredDay: 19,
    role: "Exmujer y abogada mercantil", room: "Suite 304", group: "Huésped",
    motiveHint: "Su convenio de divorcio y reparto de acciones expiraba el 1 de diciembre.",
    alibiClaim: "Afirma que estuvo al teléfono con su bufete desde su suite.",
    portrait: "imagenes/suspects/s09.jpg"
  },
  {
    id: "s10", num: "10", name: "Julián Prieto", age: 47, discoveredDay: 10,
    role: "Técnico de mantenimiento", room: "Ala Servicio C", group: "Personal",
    motiveHint: "Fue amonestado por Arturo por averías en la calefacción del ala oeste.",
    alibiClaim: "Dice haber estado purgando las válvulas de las calderas durante el apagón.",
    portrait: "imagenes/suspects/s10.jpg"
  },
  {
    id: "s11", num: "11", name: "Sofía Navarro", age: 29, discoveredDay: 16,
    role: "Prometida de Arturo", room: "Suite 305", group: "Huésped",
    motiveHint: "Acababa de descubrir que Arturo la dejó fuera del nuevo testamento.",
    alibiClaim: "Declara que subió a su suite para hacer una llamada por satélite.",
    portrait: "imagenes/suspects/s11.jpg"
  },
  {
    id: "s12", num: "12", name: "Diego Aranda", age: 27, discoveredDay: 1,
    role: "Sobrino y diseñador gráfico", room: "Hab. 201", group: "Huésped",
    motiveHint: "Arturo bloqueó su estudio creativo exigiéndole devolver un préstamo.",
    alibiClaim: "Mantiene que trabajaba con su portátil en el estudio del hotel.",
    portrait: "imagenes/suspects/s12.jpg"
  },
  {
    id: "s13", num: "13", name: "Inés Casado", age: 42, discoveredDay: 22,
    role: "Botánica pirenaica", room: "Hab. 206", group: "Huésped",
    motiveHint: "Experta en flora tóxica alpina; guardaba muestras vegetales en su equipaje.",
    alibiClaim: "Sostiene que permaneció en la zona termal del spa antes de la cena tardía.",
    portrait: "imagenes/suspects/s13.jpg"
  },
  {
    id: "s14", num: "14", name: "Álvaro Roldán", age: 45, discoveredDay: 1,
    role: "Banquero de inversiones", room: "Suite 303", group: "Huésped",
    motiveHint: "Negociaba la compra hostil del hotel y tuvo un roce privado con Arturo.",
    alibiClaim: "Asegura haber cerrado una transferencia internacional desde su suite.",
    portrait: "imagenes/suspects/s14.jpg"
  },
  {
    id: "s15", num: "15", name: "Marta Quiroga", age: 55, discoveredDay: 4,
    role: "Gobernanta de pisos", room: "Ala Servicio D", group: "Personal",
    motiveHint: "Tenía acceso a todas las llaves maestras de las habitaciones.",
    alibiClaim: "Indica que se encontraba cerrando el casillero de lavandería.",
    portrait: "imagenes/suspects/s15.jpg"
  },
  {
    id: "s16", num: "16", name: "Óscar Llorente", age: 34, discoveredDay: 1,
    role: "Fotógrafo del evento", room: "Hab. 108", group: "Huésped",
    motiveHint: "Arturo le requisó una tarjeta de memoria tras una foto comprometedora.",
    alibiClaim: "Afirma haber salido al porche exterior Este para retratar la tormenta.",
    portrait: "imagenes/suspects/s16.jpg"
  },
  {
    id: "s17", num: "17", name: "Paula Mendoza", age: 33, discoveredDay: 8,
    role: "Fisioterapeuta del spa", room: "Hab. 105", group: "Personal",
    motiveHint: "Preparaba aceites e infusiones herbales personalizadas para los socios.",
    alibiClaim: "Dice haber atendido una sesión de masaje nocturno en la Cabina 2.",
    portrait: "imagenes/suspects/s17.jpg"
  },
  {
    id: "s18", num: "18", name: "Gabriel Serrano", age: 41, discoveredDay: 13,
    role: "Piloto de helicóptero", room: "Hab. 208", group: "Huésped",
    motiveHint: "Culpa a Arturo de obligarle a volar en condiciones límite días atrás.",
    alibiClaim: "Mantiene que estaba en el hangar asegurando el rotor contra el hielo.",
    portrait: "imagenes/suspects/s18.jpg"
  },
  {
    id: "s19", num: "19", name: "Elena Valls", age: 57, discoveredDay: 12,
    role: "Anticuaria y tasadora", room: "Hab. 203", group: "Huésped",
    motiveHint: "Descubrió que uno de los cuadros del Salón Mirador era una copia.",
    alibiClaim: "Sostiene que se encontraba inventariando piezas en el Archivo Histórico.",
    portrait: "imagenes/suspects/s19.jpg"
  },
  {
    id: "s20", num: "20", name: "Nicolás Ferrer", age: 32, discoveredDay: 2,
    role: "Barman del Salón Mirador", room: "Ala Servicio E", group: "Personal",
    motiveHint: "Sirvió personalmente las copas del brindis de Adviento.",
    alibiClaim: "Afirma que salió diez minutos al almacén de hielo antes del apagón.",
    portrait: "imagenes/suspects/s20.jpg"
  },
  {
    id: "s21", num: "21", name: "Claudia Benítez", age: 35, discoveredDay: 6,
    role: "Cantante de la gala", room: "Hab. 106", group: "Huésped",
    motiveHint: "Tuvo un fuerte desencuentro contractual con Arturo tras el primer pase.",
    alibiClaim: "Dice que vocalizaba a puerta cerrada en su camerino del ala sur.",
    portrait: "imagenes/suspects/s21.jpg"
  },
  {
    id: "s22", num: "22", name: "Raúl Cuesta", age: 51, discoveredDay: 14,
    role: "Auditor fiscal", room: "Hab. 205", group: "Huésped",
    motiveHint: "Había detectado una caja B vinculada a la sociedad del hotel.",
    alibiClaim: "Asegura no haberse movido de su escritorio subiendo informes por Wi-Fi.",
    portrait: "imagenes/suspects/s22.jpg"
  },
  {
    id: "s23", num: "23", name: "Teresa Alarcón", age: 64, discoveredDay: 1,
    role: "Viuda del antiguo socio", room: "Hab. 202", group: "Huésped",
    motiveHint: "Su marido murió en un accidente de obra en el hotel en 2019.",
    alibiClaim: "Declara que rezaba con velas en la pequeña capilla alpina.",
    portrait: "imagenes/suspects/s23.jpg"
  },
  {
    id: "s24", num: "24", name: "Marcos Tejada", age: 38, discoveredDay: 11,
    role: "Escolta privado", room: "Hab. 101", group: "Personal",
    motiveHint: "Arturo planeaba despedirlo esa misma semana por pérdida de confianza.",
    alibiClaim: "Sostiene que vigilaba la puerta principal tomando un café en barra.",
    portrait: "imagenes/suspects/s24.jpg"
  },
  {
    id: "s25", num: "25", name: "Adriana Orozco", age: 68, discoveredDay: 18,
    role: "Farmacéutica jubilada", room: "Hab. 107", group: "Huésped",
    motiveHint: "Posee conocimientos avanzados de alcaloides y dosis letales.",
    alibiClaim: "Afirma haber dejado sus botas mojadas en recepción antes de acostarse.",
    portrait: "imagenes/suspects/s25.jpg"
  }
];
