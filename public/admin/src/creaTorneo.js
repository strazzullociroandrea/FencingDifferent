import { creaTorneo } from "./cache.js";
const data = document.getElementById("data");
const nome = document.getElementById("nome");
const provincia = document.getElementById("provincia");
const luogo = document.getElementById("luogo");
const pel = document.getElementById("pel");
const ngir = document.getElementById("ngir");
const invia = document.getElementById("invia");

invia.onclick = () =>{
    creaTorneo({data: data.value, nome: nome.value, provincia: provincia.value, luogo: luogo.value, pel: pel.value, ngir:ngir.value}).then(response=>{
        if(response === 'ok'){
            if(data.classList.contains("border-danger")){
                data.classList.remove("border-danger");
                nome.classList.remove("border-danger");
                provincia.classList.remove("border-danger");
                luogo.classList.remove("border-danger");
                pel.classList.remove("border-danger");
                ngir.classList.remove("border-danger");
            }
            data.value = nome.value = provincia.value = luogo.value = pel.value = ngir.value =  "";
        }else{
            data.classList.add("border-danger");
            nome.classList.add("border-danger");
            provincia.classList.add("border-danger");
            luogo.classList.add("border-danger");
            pel.classList.add("border-danger");
            ngir.classList.add("border-danger");
        }
       
    })
    
}