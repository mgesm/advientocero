/**
 * ADVIENTO CERO — CONFIGURACIÓN DEL REGALO (CERO SPOILERS)
 * ---------------------------------------------------------
 * Puedes editar libremente este archivo para personalizar tu dedicatoria
 * del 1 de diciembre y el mensaje/vale secreto del 24 de diciembre.
 * Este archivo NO contiene ningún spoiler de la investigación.
 */

window.GIFT_CONFIG = {
  recipientName: "Patri",
  senderName: "Miguel",
  editionLabel: "Edición Especial · 24 Días en el Ventisquero",

  // Mensaje desbloqueado desde el 1 de diciembre (en la pestaña Expediente y bienvenida)
  openingDedication: {
    badge: "PARA PATRI · 1 DE DICIEMBRE",
    title: "Feliz Adviento!!!",
    body: [
      "En lugar de chocolate, chuches, cremas o cualquier cosa aburrida que se nos pueda ocurrir para un calendario de adviento, este diciembre nos hemos quedado atrapados en una tormenta de nieve con un crimen por resolver.",
      "Cada día se abrirá una nueva puerta. Tú tendrás pistas que yo no puedo ver, y yo tendré datos que tú necesitas. Tendremos que hablar, cruzar pruebas y tachar sospechosos cada día hasta Nochebuena. Es decir, en vez de tener cada día de adviento un nuevo trozo de chocolate, vamos a tener una pista nueva para encontrar al culpable del crimen."
    ],
    signature: "Con todo mi cariño, Miguel"
  },

  // Sobre secreto que SOLO se desbloquea al atrapar al culpable el 24 de diciembre
  finalGiftReveal: {
    badge: "SOBRE SECRETO · 24 DE DICIEMBRE",
    title: "Caso Cerrado — Y tu regalo real de Navidad",
    message: [
      "Enhorabuena, inspectora. Has resuelto el misterio del Ventisquero paso a paso conmigo.",
      "Ahora que la tormenta ha pasado, el verdadero regalo te espera fuera de la pantalla:"
    ],
    // Personaliza aquí tu vale o pista física (ej. "Una escapada sorpresa...", "Mira debajo del árbol...")
    voucherTitle: "VALE POR UNA SORPRESA DE NOCHEBUENA",
    voucherDescription: "Edita este texto en config/gift-config.js con el regalo real, plan o pista donde hayas escondido el paquete físico para Patri.",
    footerNote: "Feliz Navidad, Patri. Gracias por ser mi mejor compañera de equipo."
  }
};
