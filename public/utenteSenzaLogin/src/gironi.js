import { renderGironi } from "./render.js";
import { recuperaGironi } from "./cache.js";

const url = new URL(window.location.href);
const classificaIniziale = document.getElementById("classificaIniziale");
const eliminazioneDiretta = document.getElementById("eliminazioneDiretta");
const gironiMenu = document.getElementById("gironiMenu");

const idParam = url.searchParams.get("nomeTorneo");
const dataParam = url.searchParams.get("data");
window.onload = () => {
  renderGironi(idParam, dataParam);
};

classificaIniziale.onclick = () => {
  window.location.href =
    "./classificaIniziale.html?nomeTorneo=" + idParam + "&data=" + dataParam;
};

gironiMenu.onclick = () => {
  window.location.href =
    "./gironi.html?nomeTorneo=" + idParam + "&data=" + dataParam;
};
eliminazioneDiretta.onclick = () => {
  window.location.href =
    "./elimDiretta.html?nomeTorneo=" + idParam + "&data=" + dataParam;
};
