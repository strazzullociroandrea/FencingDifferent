
import { recuperaFasi } from "./cache.js";
const progressBar = document.getElementById("progressBar");
const url = new URL(window.location.href);
const idParam = url.searchParams.get("nomeTorneo");
const dataParam = url.searchParams.get("data");

window.onload = () =>{
    recuperaFasi({nomeTorneo:idParam,data:dataParam}).then(response=>{
        let posizione = "Inziale";
        let conta = 20;
        response.map(fase =>{
          if(fase.tipologia.toLowerCase().includes('girone') && fase.svolta === 0 && conta < 20){
            posizione = "Gironi";
            conta += 20;
          }
          if(fase.tipologia.toLowerCase().includes('girone') && fase.svolta === 1 && conta < 40){
            posizione = "Classifica girone";
            conta += 20;
          }
          if(fase.tipologia.toLowerCase().includes('eliminazione diretta')&& fase.svolta === 1 && conta < 60){
            posizione = "Eliminazione diretta";
            conta += 20;
          }
          if(fase.tipologia.toLowerCase().includes('eliminazione diretta') && fase.svolta === 1 && conta < 100){
            posizione = "Classifica Finale";
            conta += 20;
          }
        })
        const value = progressBar.style.width = conta+"%";
        console.log(value);
        progressBar.setAttribute('aria-valuenow', value);
    })
}