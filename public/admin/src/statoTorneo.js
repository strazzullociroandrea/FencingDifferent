
import { recuperaFasi,statoTorneo } from "./cache.js";
const progressBar = document.getElementById("progressBar");
const opera = document.getElementById("opera");
const url = new URL(window.location.href);
const idParam = url.searchParams.get("nomeTorneo");
const dataParam = url.searchParams.get("data");
const paginaModifica = `
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" %c data-bs-target="#chiudiTorneoConferma">
                    Chiudi il torneo
                </button>
                %m
            `;
const modalConferma = `
<div class="modal fade" id="chiudiTorneoConferma" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog" role="document">
    <div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title"></h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
        <p>Sei sicuro di voler chiudere il torneo? Una volta chiuso non sarà possibile riaprirlo</p>
    </div>
    <div class="modal-footer">
        <button type="button" id="chiudiTorneo" class="btn btn-danger">Confermo</button>
    </div>
    </div>
</div>
</div>
            `;
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
        progressBar.setAttribute('aria-valuenow', value);
    })
    statoTorneo({nomeTorneo:idParam,data:dataParam}).then(response=>{
        console.log(response);
        if(response[0].svolto == 1){
            opera.innerHTML = paginaModifica.replace("%c","").replace("%m",modalConferma);
            const modal = new bootstrap.Modal("#chiudiTorneoConferma");
            document.getElementById("chiudiTorneo").onclick = () =>{
                console.log("torneo chiuso");
                modal.hide();
            }
        }else{ 
            opera.innerHTML = paginaModifica.replace("%c","disabled").replace("%m","");
        }
    })
}