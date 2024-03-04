/**
 * Funzione di fetching per recuperare i tornei salvati su database mysql usando il servizio nodejs apposito
 * @returns promise
 */
export const recuperaTornei = () => {
  return new Promise((resolve, reject) => {
    fetch("/scherma/tornei")
      .then((response) => response.json())
      .then((response) => resolve(response.response))
      .catch((error) => reject(error));
  });
};

/**
 * Funzione di fetching per recuperare gli atleti salvati su database mysql usando il servizio nodejs apposito
 * @returns promise
 */
export const recuperaAtleta = (nometorneo, data) => {
  return new Promise((resolve, reject) => {
    fetch("/scherma/atleti", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nomeTorneo: nometorneo,
        data: data,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        resolve(response.response);
      })
      .catch((error) => reject(error));
  });
};

/**
 * Funzione per recuperare i dati per comporre la tabella dell'eliminazione diretta
 */
export const recuperaEliminazioneDiretta = (nometorneo, data) =>{
  return new Promise((resolve, reject) => {
    fetch("/scherma/eliminazineDiretta", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nomeTorneo: nometorneo,
        data: data,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        resolve(response.response);
      })
      .catch((error) => reject(error));
  });
}
/**
 * Funzione di fetching per recuperare i gironi salvati su database mysql usando il servizio nodejs apposito
 * @returns promise
 */
export const recuperaGironi = (nometorneo, data) => {
  return new Promise((resolve, reject) => {
    fetch("/scherma/gironi", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nomeTorneo: nometorneo,
        data: data
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        resolve(response.response);
      })
      .catch((error) => reject(error));
  });
};
