//Import moduli
import { renderStorico } from "./render.js";

/**
 * Al caricamento della pagina viene fatto il render dei tornei
 */
window.onload = () => {
  renderStorico(document.getElementById("storico-tornei-container"));
};
