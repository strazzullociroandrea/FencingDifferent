//Import moduli
import { recuperaEliminazioneDiretta } from "./cache.js";
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
 * Al caricamento della pagina viene fatto il render dell'eliminazione diretta
 */
const riordinaEliminazione = (response) => {
  const riordinatiPerEliminazione = [];
  //riordina per stessa eliminazione diretta
  response.forEach(partecipante => {
      const index = riordinatiPerEliminazione.findIndex(element => {
          return element.id === partecipante.tipologia;
      });
      if (index !== -1) {
          riordinatiPerEliminazione[index].partecipanti.push(partecipante);
      } else {
          riordinatiPerEliminazione.push({
              id: partecipante.tipologia,
              partecipanti: [partecipante]
          });
      }
  });
  return riordinatiPerEliminazione;
}

const generaAccoppiamento = (array) => {
  const arrayFinale = [];
  let toltoTemp = undefined;
  if (array.length % 2 !== 0)
      toltoTemp = { primo: array.splice(array.length / 2, 1)[0], secondo: { posizione: '', cognome: '', nome: '' } };
  const arrayUno = array.slice(0, array.length / 2);
  const arrayDue = array.slice(array.length / 2, array.length);
  let contaSopra = 0;
  for (let i = 0; i < arrayUno.length; i++) {
      if (i % 2 === 0) {
          arrayFinale[contaSopra] = {
              primo: arrayUno[i],
              secondo: arrayDue[arrayDue.length - 1 - i]
          };
          // Aggiungi il vincitore del match
          arrayFinale[contaSopra].vincitore = arrayFinale[contaSopra].primo.nome;
          contaSopra++;
      } else {
          arrayFinale[arrayUno.length - contaSopra] = {
              primo: arrayUno[i],
              secondo: arrayDue[arrayDue.length - i - 1]
          };
          // Aggiungi il vincitore del match
          arrayFinale[arrayUno.length - contaSopra].vincitore = arrayFinale[arrayUno.length - contaSopra].primo.nome;
      }
  }
  if (toltoTemp !== undefined)
      arrayFinale.splice(arrayFinale.length / 2, 0, toltoTemp);
  
  // Se ci sono atleti non associati, aggiungili automaticamente alla fase successiva
  for (let i = 0; i < arrayFinale.length; i++) {
      if (arrayFinale[i].primo.nome === '') {
          arrayFinale[i].primo.nome = 'Atleta non associato';
          arrayFinale[i].primo.societa = 'Non associato';
          arrayFinale[i].vincitore = arrayFinale[i].secondo.nome;
      }
      if (arrayFinale[i].secondo.nome === '') {
          arrayFinale[i].secondo.nome = 'Atleta non associato';
          arrayFinale[i].secondo.societa = 'Non associato';
          arrayFinale[i].vincitore = arrayFinale[i].primo.nome;
      }
  }
  
  return arrayFinale;
}

window.onload = () => {
  console.log("visualizzo l'eliminazione diretta");
  recuperaEliminazioneDiretta(idParam, dataParam).then(response => {
      //riordino l'array per le eliminazioni
      const eliminazioni = riordinaEliminazione(response);
      //sistemo l'array generando l'accoppiamento
      eliminazioni.forEach(eliminazione => {
          eliminazione.partecipanti = generaAccoppiamento(eliminazione.partecipanti);
      })
      console.log(eliminazioni);
  })
}


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