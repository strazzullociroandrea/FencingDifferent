/**
 * Funzione di fetching per recuperare i tornei salvati su database mysql usando il servizio nodejs apposito
 * @returns promise
 */
export const recuperaTornei = async () => {
  return await fetch("/scherma/tornei")
    .then((response) => response.json())
    .then((response) => response.response)
    .catch((error) => error);
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

export const creaTorneo = (dizionario) =>{
  return new Promise((resolve,reject)=>{
    fetch("/scherma/creaTorneo", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(dizionario),
    })
      .then((response) => response.json())
      .then((response) => {
        resolve(response.result);
      })
      .catch((error) => reject(error));
  });
}

export const eliminaTorneo = (dizionario) =>{
  return new Promise((resolve,reject)=>{
    fetch("/scherma/eliminaTorneo",{
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(dizionario),
    }).then(response => response.json())
    .then(response => resolve(response.result))
    .catch(error => reject(error));
  });
}
export const recuperaFasi = (dizionario) =>{
  return new Promise((resolve,reject)=>{
    fetch("/scherma/selectFasi",{
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(dizionario),
    }).then(response => response.json())
    .then(response => resolve(response.response))
    .catch(error => reject(error));
  });
}
export const statoTorneo = (dizionario) =>{
  return new Promise((resolve,reject)=>{
    fetch("/scherma/statoTorneo",{
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(dizionario),
    }).then(response => response.json())
    .then(response => resolve(response.response))
    .catch(error => reject(error));
  });
}

export const chiudiTorneo = (dizionario) =>{
  return new Promise((resolve,reject)=>{
    fetch("/scherma/chiudiTorneo",{
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(dizionario),
    }).then(response => response.json())
    .then(response => resolve(response.response))
    .catch(error => reject(error));
  });
}