//Import moduli
import {
  recuperaTornei,
  recuperaAtleta,
  recuperaEliminazioneDiretta,
  recuperaGironi,
  iscriviUtenteReg,
  recuperaStorico,
} from "./cache.js";

//------------------------- INIZIO PAGINA PRINCIPALE TORNEI ---------------------------------------
//Dom
const torneiTable = document.getElementById("tornei-container");

// template tornei - template
const templateFirstTornei = `<div class="row mt-5"><div class="col-12">%value</div></div>`;
const templateTdTornei = `<div class="col-6 mt-2" >%value</div>`;
const templateDivTornei = `
  <div class="card designInput rounded-pill %DIM torneo" id="%ID">
    <div class="card-body">
      <div class="row justify-content-between fs-3 text-white">
        <div class="col-auto">
          <svg height="40" width="40">
            <circle cx="20" cy="20" r="20" fill="%STATUS" />
          </svg>
          <p class="badge text-wrap">%TITOLO</p>
        </div>
        <div class="col-auto"> <button class="bottoni-barra elimina" id="%COUNT" type="button">
          <img src="../person_add.svg" class="pedi-icon" />
      </button></div>
      </div>
    </div>
  </div>
`;

/**
 * Funzione per il rendering in finestra dei tornei
 */
export const renderTornei = () => {
  recuperaTornei().then((tornei) => {
    if (tornei) {
      let row = "";
      if (tornei.length > 0) {
        const { nome, data, svolto } = tornei[0];
        // prendo il primo valore
        row = templateFirstTornei.replace(
          "%value",
          templateDivTornei
            .replace("%DIM", "w-100")
            .replace("%ID", nome + "_" + data)
            .replace("%TITOLO", nome)
            .replace("%COUNT", nome + "_" + data)
            .replace("%STATUS", svolto ? "green" : "red")
        );

        if (tornei.length > 1) {
          row += `<div class="row mt-2">`;
          for (let i = 1; i < tornei.length; i++) {
            const { nome, data, svolto } = tornei[i];
            row += templateTdTornei.replace(
              "%value",
              templateDivTornei
                .replace("%DIM", "w-100")
                .replace("%ID", nome + "_" + data)
                .replace("%TITOLO", nome)
                .replace("%COUNT", nome + "_" + data)
                .replace("%STATUS", svolto ? "green" : "red")
            );
            if (i % 2 === 0) {
              row += `</div><div class="row mt-2">`;
            }
          }
          row += `</div>`;
        }
        torneiTable.innerHTML = row;
        document.querySelectorAll(".torneo").forEach((div) => {
          div.addEventListener("click", (event) => {
            const id = event.currentTarget.id.split("_");
            window.location.href =
              "./classificaIniziale.html?nomeTorneo=" +
              id[0] +
              "&data=" +
              id[1];
          });
        });
        document.querySelectorAll(".elimina").forEach((div) => {
          div.addEventListener("click", (event) => {
            event.stopPropagation(); //evita di considerare ulteriori click, come quello sulla card
            const id = event.currentTarget.id.split("_");
            iscriviUtenteReg(
              id[0],
              id[1],
              sessionStorage.getItem("username"),
              sessionStorage.getItem("password")
            ).then((result) => {
              console.log(result);
            });
          });
        });
      }
    }
  });
};
//------------------------- FINE PAGINA PRINCIPALE TORNEI ---------------------------------------
//------------------------- INIZIO PAGINA CLASSIFICA INIZIALE ---------------------------------------

//table - DOM
const classificaIniziale = document.getElementById("classificaInizialeTabella");
//template
const templateIniziale = `<tr><th>INDICE</th><th>COGNOME NOME</th><th>RANK</th><th>SOCIETA</th></tr>`;

/**
 * Funzione per il rendering in finestra della pagina iniziale - la pagina della classifica iniziale
 * @param {*} nometorneo
 * @param {*} data
 */
export const renderIniziale = (nometorneo, data) => {
  recuperaAtleta(nometorneo, data).then((response) => {
    //sorting dell'array per ranking dal minore al maggiore
    if (response) {
      response = response.sort((a, b) => a.ranking - b.ranking);
      let html = "";
      html = templateIniziale;
      response.forEach((element, index) => {
        const { societa, ranking, nome, cognome } = element;
        html += templateIniziale
          .replaceAll("th>", "td>")
          .replace("INDICE", index + 1)
          .replace("COGNOME NOME", nome + " " + cognome)
          .replace("RANK", ranking)
          .replace("SOCIETA", societa);
      });
      classificaIniziale.innerHTML = html;
    }
  });
};

//------------------------- FINE PAGINA CLASSIFICA INIZIALE  ---------------------------------------
//------------------------- INIZIO PAGINA GIRONI ---------------------------------------
//Dom
const tableGironi = document.getElementById("tableGironi");
/**
 * Funzione per distribuire i giocatori in un determinato girone in modo circolare
 * @param {*} numeroGironi
 * @param {*} listaGiocatori
 * @returns
 */
function distribuisciGiocatori(numeroGironi, listaGiocatori) {
  const numeroGiocatori = listaGiocatori.length;
  const gironi = new Array(numeroGironi).fill(null).map(() => []);
  //Inizializza un array vuoto per ciascun girone
  listaGiocatori.sort((a, b) => b.ranking - a.ranking);
  // Distribuisci i giocatori nei gironi
  for (let i = 0; i < numeroGiocatori; i++) {
    const giocatore = listaGiocatori[i];
    const indiceGirone = i % numeroGironi;
    gironi[indiceGirone].push(giocatore);
  }
  return gironi;
}

/**
 * Funzione per generare gli incontri dei vari sfidanti nei gironi
 * @param {*} lunghezza
 * @returns
 */
function roundRobin(lunghezza) {
  let players = [];
  for (let index = 0; index < lunghezza; index++) {
    players.push(index + 1);
  }
  let rounds = [];
  if (players.length % 2 !== 0) {
    players.push(null);
  }
  let numRounds = players.length - 1;
  let half = players.length / 2;
  for (let round = 0; round < numRounds; round++) {
    let matches = [];
    for (let i = 0; i < half; i++) {
      let player1 = players[i];
      let player2 = players[numRounds - i];
      if (player1 !== null && player2 !== null) {
        matches.push([player1, player2]);
      }
    }
    rounds.push(matches);
    players.splice(1, 0, players.pop());
  }
  return rounds;
}

/**
 * Funzione per visualizzare in tabella gli incontri nei vari gironi
 * @param {*} lista
 * @param {*} div
 * @param {*} roundRobin
 */
export function renderincontri(lista) {
  let rounds = roundRobin(lista.length);
  let table = `<table class="table table-bordered text-white text-center pedi-tabella mt-5">`;
  rounds.forEach((element) => {
    element.forEach((element2) => {
      let y =
        `<tr><td>` +
        lista[element2[0] - 1].cognome +
        ` ` +
        lista[element2[0] - 1].nome +
        `</td><td>` +
        element2[0] +
        ` vs ` +
        element2[1] +
        `</td><td>` +
        lista[element2[1] - 1].cognome +
        ` ` +
        lista[element2[1] - 1].nome +
        `</td></tr>`;
      table += y;
    });
  });
  table += `</table>`;
  return table;
}

/**
 * Funzione per dividere l'array di response della promise in un array di dizionari, dove ogni dizionario contiene
 * le informazioni dei singoli gironi. L'array restituito sarà messo in ordine di inserimento
 * @param {*} array
 * @returns
 */
const dividiPerGirone = (response) => {
  const array = [];
  response.forEach((element) => {
    const index = array.findIndex((girone) => girone.id === element.idFase);
    if (index !== -1) {
      array[index].partecipanti.push(element);
    } else {
      array.push({
        id: element.idFase,
        partecipanti: [element],
      });
    }
  });
  array.sort(function (a, b) {
    return a.id - b.id;
  });
  return array;
};

/**
 * Funzione per accoppiare ad ogni Sfidante l'atleta Sfidato in base all'assalto
 * @param {*} array
 */
const accoppiaPerAssalto = (array) => {
  const divisiPerAssalto = [];
  array.forEach((girone) => {
    const jsonTemp = { id: girone.id };
    const arrayTempAccoppiamenti = [];
    const partecipantiCopia = [...girone.partecipanti];
    partecipantiCopia.forEach((primo) => {
      const secondoIndex = partecipantiCopia.findIndex((partecipante) => {
        return (
          primo.idAssalto === partecipante.idAssalto &&
          primo.codiceFis !== partecipante.codiceFis
        );
      });
      if (secondoIndex !== -1) {
        const secondo = partecipantiCopia.splice(secondoIndex, 1)[0];
        arrayTempAccoppiamenti.push({
          partecipanteUno: primo,
          partecipanteDue: secondo,
        });
      }
    });
    jsonTemp["partecipanti"] = arrayTempAccoppiamenti;
    divisiPerAssalto.push(jsonTemp);
  });
  return divisiPerAssalto;
};

/**
 * Funzione per la visualizzazione in finestra dei gironi
 * @param {*} nomeTorneo
 * @param {*} data
 */
export const renderGironi = (nomeTorneo, data, numeroGir) => {
  recuperaGironi(nomeTorneo, data)
    .then((response) => {
      if (response) {
        //Divisione per gironi
        let divisiPerGirone = dividiPerGirone(response);
        //Accoppiamento atleti con stesso assalto (Sfidante vs Sfidato)
        const divisiPerAssalto = accoppiaPerAssalto(divisiPerGirone);
        //Visualizzazione in finestra
        divisiPerGirone.forEach((girone) => {
          const partecipanti = girone.partecipanti;
          const partecipantiRedux = partecipanti.filter(
            (elem, index, self) =>
              index ===
              self.findIndex((t) => {
                return (
                  t.nome === elem.nome &&
                  t.cognome === elem.cognome &&
                  t.codiceFis === elem.codiceFis &&
                  t.societa === elem.societa &&
                  t.ranking === elem.ranking
                );
              })
          );
          distribuisciGiocatori(numeroGir, partecipantiRedux).forEach(
            (result) => {
              let html = `
              <div class="col-auto">
            <table class="table table-bordered text-white text-center pedi-tabella mt-5">
              <thead>
               <tr>
                <th>COGNOME</th>
                <th>NOME</th>
                <th>RANK</th>
                <th>SOCIETÀ</th>
                `;
              for (let index = 0; index < result.length; index++) {
                let g = `<th>` + (index + 1) + `</th>`;
                html += g;
              }
              html += `
              </tr>
            </thead>
            <tbody>
          `;
              result.forEach((partecipante, index) => {
                const assaltiInComune = [];
                divisiPerAssalto.forEach((girone) => {
                  girone.partecipanti.forEach((assalto) => {
                    if (
                      assalto.partecipanteUno.codiceFis ===
                        partecipante.codiceFis ||
                      assalto.partecipanteDue.codiceFis ===
                        partecipante.codiceFis
                    ) {
                      assaltiInComune.push(assalto);
                    }
                  });
                });

                html +=
                  "<tr><td>" +
                  partecipante.cognome +
                  "</td><td>" +
                  partecipante.nome +
                  "</td><td>" +
                  partecipante.ranking +
                  "</td><td>" +
                  partecipante.societa +
                  "</td>";
                result.forEach((altroPartecipante, indexAltro) => {
                  if (index !== indexAltro) {
                    let punteggioTemp = "-";
                    assaltiInComune.forEach((assalto) => {
                      if (
                        (assalto.partecipanteUno.codiceFis ===
                          partecipante.codiceFis &&
                          assalto.partecipanteDue.codiceFis ===
                            altroPartecipante.codiceFis) ||
                        (assalto.partecipanteDue.codiceFis ===
                          partecipante.codiceFis &&
                          assalto.partecipanteUno.codiceFis ===
                            altroPartecipante.codiceFis)
                      ) {
                        punteggioTemp =
                          assalto.partecipanteUno.codiceFis ===
                          partecipante.codiceFis
                            ? assalto.partecipanteUno.punteggio
                            : assalto.partecipanteDue.punteggio;
                      }
                    });
                    html += "<td>" + punteggioTemp + "</td>";
                  } else {
                    html += "<td></td>";
                  }
                });
                html += "</tr>";
              });

              html += `</tbody></table></div>
              <div class="col-auto">
              <!-- Button trigger modal -->
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
              </button>
              </div>
              <!-- Modal -->
              <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      ...
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
              `;
              html += renderincontri(result);
              tableGironi.innerHTML += html;
            }
          );
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//------------------------- FINE PAGINA GIRONI  --------------------------------------------
//------------------------- INIZIO CLASSIFICA GIRONI ---------------------------------------
export const creaClassificaGironi = (
  nomeTorneo,
  data,
  percentualeElim,
  numeroGir
) => {
  recuperaGironi(nomeTorneo, data)
    .then((response) => {
      if (response) {
        let contaGirone = 1;
        const listaGir = [];
        //Divisione per gironi
        let divisiPerGirone = dividiPerGirone(response);
        //Accoppiamento atleti con stesso assalto (Sfidante vs Sfidato)
        const divisiPerAssalto = accoppiaPerAssalto(divisiPerGirone);
        //Visualizzazione in finestra
        divisiPerGirone.forEach((girone) => {
          const partecipanti = girone.partecipanti;
          const partecipantiRedux = partecipanti.filter(
            (elem, index, self) =>
              index ===
              self.findIndex((t) => {
                return (
                  t.nome === elem.nome &&
                  t.cognome === elem.cognome &&
                  t.codiceFis === elem.codiceFis &&
                  t.societa === elem.societa &&
                  t.ranking === elem.ranking
                );
              })
          );
          distribuisciGiocatori(numeroGir, partecipantiRedux).forEach(
            (result) => {
              const tot = {};
              tot["girone"] = contaGirone++;
              const lista = [];
              result.forEach((partecipante, index) => {
                let obj = {};
                const assaltiInComune = [];
                divisiPerAssalto.forEach((girone) => {
                  girone.partecipanti.forEach((assalto) => {
                    if (
                      assalto.partecipanteUno.codiceFis ===
                        partecipante.codiceFis ||
                      assalto.partecipanteDue.codiceFis ===
                        partecipante.codiceFis
                    ) {
                      assaltiInComune.push(assalto);
                    }
                  });
                });

                obj["cognome"] = partecipante.cognome;
                obj["nome"] = partecipante.nome;
                obj["ranking"] = partecipante.ranking;
                obj["societa"] = partecipante.societa;
                obj["assalti"] = [];

                result.forEach((altroPartecipante, indexAltro) => {
                  if (index !== indexAltro) {
                    let punteggioTemp = "-";
                    assaltiInComune.forEach((assalto) => {
                      if (
                        (assalto.partecipanteUno.codiceFis ===
                          partecipante.codiceFis &&
                          assalto.partecipanteDue.codiceFis ===
                            altroPartecipante.codiceFis) ||
                        (assalto.partecipanteDue.codiceFis ===
                          partecipante.codiceFis &&
                          assalto.partecipanteUno.codiceFis ===
                            altroPartecipante.codiceFis)
                      ) {
                        punteggioTemp =
                          assalto.partecipanteUno.codiceFis ===
                          partecipante.codiceFis
                            ? assalto.partecipanteUno.punteggio
                            : assalto.partecipanteDue.punteggio;
                      }
                    });
                    obj.assalti.push(punteggioTemp);
                  } else {
                    obj.assalti.push(" ");
                  }
                });
                lista.push(obj);
              });
              tot["atleti"] = lista;
              listaGir.push(tot);
            }
          );
        });
        renderClassificaGironi(
          riordinaLista(
            creaClassGir(listaGir, creaMatrici(listaGir)),
            percentualeElim
          )
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const creaMatrici = (lista) => {
  const output = [];
  lista.forEach((element) => {
    const matrix = [];
    element.atleti.forEach((element2) => {
      const row = [];
      element2.assalti.forEach((element3) => {
        row.push(element3);
      });
      matrix.push(row);
    });
    output.push(matrix);
  });
  return output;
};

const creaClassGir = (listaGironi, listaMatrix) => {
  const output = [];
  listaGironi.forEach((gir, countMatrix) => {
    gir.atleti.forEach((atl, index) => {
      let countWin = 0;
      let sum = 0;
      listaMatrix[countMatrix][index].forEach((stoccate) => {
        if (stoccate !== " " && stoccate !== "-" && stoccate !== "") {
          if (stoccate == "V") {
            sum += 5;
            countWin++;
          } else {
            sum += Number.parseInt(stoccate, 10);
          }
        }
      });

      let sumDif = 0;
      for (let k = 0; k < listaMatrix[countMatrix].length; k++) {
        if (
          listaMatrix[countMatrix][k][index] !== "" &&
          listaMatrix[countMatrix][k][index] !== "-" &&
          listaMatrix[countMatrix][k][index] !== " "
        ) {
          if (listaMatrix[countMatrix][k][index] == "V") {
            sumDif += 5;
          } else {
            sumDif += Number.parseInt(listaMatrix[countMatrix][k][index], 10);
          }
        }
      }
      let obj = {
        cognome: atl.cognome,
        nome: atl.nome,
        societa: atl.societa,
        date: sum,
        subite: sumDif,
        differenza: sum - sumDif,
        aliquota: Number.parseFloat(
          (countWin / (listaMatrix[countMatrix][index].length - 1)).toFixed(2)
        ),
      };
      output.push(obj);
    });
  });
  return output;
};

const riordinaLista = (lista, percentualeElim) => {
  const output = [];
  lista.sort((a, b) => b.aliquota - a.aliquota);

  const listaDiff = [];
  lista.forEach(function (oggetto) {
    listaDiff.push(oggetto.differenza);
  });
  listaDiff.sort((a, b) => b - a);
  const listaDiffFiltrata = Array.from(new Set(listaDiff));
  const appoggioTotal = [];
  listaDiffFiltrata.forEach((differen) => {
    const appoggio = [];
    lista.forEach((plebeo) => {
      if (differen === plebeo.differenza) {
        appoggio.push(plebeo);
      }
    });
    appoggioTotal.push(appoggio);
  });

  appoggioTotal.forEach((gruppo) => {
    gruppo.sort((a, b) => b.date - a.date);
  });

  appoggioTotal.forEach((riga) => {
    riga.forEach((tipo) => {
      output.push(tipo);
    });
  });
  let numElim = Math.floor((output.length / 100) * percentualeElim);
  for (let z = output.length - 1; z >= 0; z--) {
    if (numElim !== 0) {
      output[z]["stato"] = "Eliminato";
      numElim--;
    } else {
      output[z]["stato"] = "Qualificato";
    }
  }
  return output;
};

/**
 * Funzione per il rendering in finestra della pagina iniziale - la pagina della classifica iniziale
 * @param {*} nometorneo
 * @param {*} data
 */
const renderClassificaGironi = (classifica) => {
  //table - DOM
  const classificaGironiTabella = document.getElementById(
    "classificaGironiTabella"
  );
  //template
  const templateClassGir = `<tr><th>POS</th><th>COGNOME</th><th>NOME</th><th>SOCIETA</th><th>V/A</th><th>DIFF.</th><th>DATE</th><th>STATO</th></tr>`;
  let html = "";
  html = templateClassGir;
  classifica.forEach((element, index) => {
    html += templateClassGir
      .replaceAll("th>", "td>")
      .replace("POS", index + 1)
      .replace("COGNOME", element.cognome)
      .replace("NOME", element.nome)
      .replace("SOCIETA", element.societa)
      .replace("V/A", element.aliquota)
      .replace("DIFF.", element.differenza)
      .replace("DATE", element.date)
      .replace("STATO", element.stato);
  });
  classificaGironiTabella.innerHTML = html;
};
//------------------------- FINE CLASSIFICA GIRONI  ----------------------------------------
export const renderStorico = (div) => {
  recuperaStorico(sessionStorage.getItem("username")).then((tornei) => {
    if (tornei) {
      //template
      const templateStorico = `<tr><th>POS</th><th>NOME TORNEO</th><th>DATA TORNEO</th></tr>`;
      let html = "";
      html = templateStorico;
      tornei.forEach((element, index) => {
        html += templateStorico
          .replaceAll("th>", "td>")
          .replace("POS", index + 1)
          .replace("NOME TORNEO", element.nomeTorneo)
          .replace("DATA TORNEO", element.dataTorneo);
      });
      div.innerHTML = html;
    }
  });
};
