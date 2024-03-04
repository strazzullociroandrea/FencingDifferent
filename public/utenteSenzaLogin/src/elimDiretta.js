import {renderEliminazioneDiretta} from "./render.js";
const url = new URL(window.location.href);
const idParam = url.searchParams.get("nomeTorneo");
const dataParam = url.searchParams.get("data");

renderEliminazioneDiretta(idParam, dataParam);

const eliminazioneDiretta = document.getElementById("eliminazioneDiretta");
const gironiMenu = document.getElementById("gironiMenu");
const classificaIniziale = document.getElementById("classificaIniziale");

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