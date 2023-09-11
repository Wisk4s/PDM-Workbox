import { indexDB } from 'idb';

let db;

async function createDB(){
    try {
        db = await openDB('banco', 1, {
            uograde(db, oldVersion, newVersion, transaction){
                switch(oldVersion){
                    case 0:
                    case 1:
                        const store = db.createObjetStore('pessoas', {
                            //A propriedade nome será o campo chave
                            keyPath:'nome'
                        });
                        //criando um indice id na store,deveestar contido no objeto do banco
                        store.createIndex('id', 'id');
                        showResult("Banco de dados criado")
                }
            }
        });
        showResult("banco de dados aberto");
    }catch(e){
        showResult("Erro ao criar banco de dados: " + e.message)
    }
}


window.addEventListener("DOMContentLoaded", async event => {
    createDB();
    document.getElementById("input");
    document.getElementById("Salvar").addEventListener("click", addData);
    document.getElementById("Listar").addEventListener("click", getData);;


})    

async function addData(){
    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    store.add({nome:'Victor'});
    await tx.done;
}

async function getData(){
    if(db == undefined){
        showResult("O banco de dados está fechado!")
        return;
    }

    const tx = await db.transaction('pessoas','readonly');
    const store = tx.objectStore('pessoas');
    const selection = await store.getAll();
    if(selection){
        showResult("Dados do banco: " + JSON.stringify(selection))
    }else{
        showResult("Não há nenhum dado no banco!")
    }
}

function showResult (text) {
    document.querySelector("output").innerHTML = text;
}