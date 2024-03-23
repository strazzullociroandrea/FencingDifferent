//Lettura url
const url = new URL(window.location.href);
const idParam = url.searchParams.get("nomeTorneo");
const dataParam = url.searchParams.get("data");
//Dom - button
const eliminazioneDiretta = document.getElementById("eliminazioneDiretta");
const gironiMenu = document.getElementById("gironiMenu");
const classificaIniziale = document.getElementById("classificaIniziale");
const classificaGironi = document.getElementById("classificaGironi");
const classificaFinale = document.getElementById("classificaFinale");


/**
 * Gestione button cambio pagina da eliminazione diretta a classifica iniziale
 */
classificaIniziale.onclick = () => {
  window.location.href =
    "./classificaIniziale.html?nomeTorneo=" + idParam + "&data=" + dataParam;
};

/**
 * Gestione button cambio pagina da eliminazione diretta a pagina dei gironi
 */
gironiMenu.onclick = () => {
  window.location.href =
    "./gironi.html?nomeTorneo=" + idParam + "&data=" + dataParam;
};

/**
 * Gestione button cambio pagina da eliminazione diretta a se stessa
 */
eliminazioneDiretta.onclick = () => {
  window.location.href =
    "./elimDiretta.html?nomeTorneo=" + idParam + "&data=" + dataParam;
};

/**
 * Gestione button cambio pagina da eliminazione diretta a pagina classifica gironi
 */
classificaGironi.onclick = () => {
  window.location.href =
    "./classificaGironi.html?nomeTorneo=" + idParam + "&data=" + dataParam;
};

/**
 * Gestione button cambio pagina da eliminazione diretta a classifica finale
 */
classificaFinale.onclick = () => {
  window.location.href =
    "./classificaFinale.html?nomeTorneo=" + idParam + "&data=" + dataParam;
};