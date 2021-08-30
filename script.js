function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}



ready(() => {

    function newList(list) {

        this.listElement.style.display = 'block';
        this.listsElement.style.display = 'none';

        const numberOfItems = 20;

        let rows = `
        <tr>
            <td>
                Svenska
            </td>
            <td>
                Espanol
            </td>
        </tr>
        `;
    
        for(var i = 0; i < numberOfItems; i++) {

            const currentRow = (list && i < list.words.length) ? { swe: list.words[i].swe, esp: list.words[i].esp} : {swe: "", esp: ""}

            rows += `<tr>
                    <td>
                        <input type="text" value="${currentRow.swe}"> 
                    </td>
                    <td>
                        <input type="text"  value="${currentRow.esp}"> 
                    </td>
                </tr>`
        }
    
        rows += `
        <tr>
            <td>
                <input type="text" name="listName" value="${list ? list.name : new Date().toISOString()}"> 
            </td>
            <td>
                <button type="button" id="saveList">Spara</button>
            </td>
        </tr>
        `
    
        this.table.innerHTML = rows;


        document.getElementById("saveList").addEventListener("click", () => {
            const newList = {
                name: document.forms[0][numberOfItems*2].value,
            }

            const words = [];

            for(var i = 0; i < numberOfItems; i++) {
                let swe = document.forms[0][i*2].value;
                let esp = document.forms[0][i*2+1].value;
                if(swe.length > 0 && esp.length > 0) {
                    words.push({swe, esp})
                }
            }

            newList.words = words;

            this.lists[newList.name] = newList;

            localStorage.setItem('lists', JSON.stringify(this.lists));

            showLists();
        })
    }

    function runList(list) {

        this.listElement.style.display = 'block';
        this.listsElement.style.display = 'none';

        let rows = `
        <tr>
            <td>
                Svenska
            </td>
            <td>
                Espanol
            </td>
        </tr>
        `;

        const wordsRandom = list.words.sort(() => 0.5 - Math.random());
    
        for(var i = 0; i < wordsRandom.length; i++) {

            const currentRow = {swe: wordsRandom[i].swe, esp: wordsRandom[i].esp};

            rows += `<tr>
                    <td>
                        ${currentRow.swe}
                    </td>
                    <td>
                        <input type="text" data-correct="${currentRow.esp}"> 
                    </td>
                </tr>`
        }
    
        rows += `
        <tr>
            <td style="width: 280px">
                ${list.name}
            </td>
            <td>
                <button type="button" id="correctList">Rätta</button>
            </td>
        </tr>
        <tr>
            <td>
                <button type="button" id="back" style="margin-top: 3%">Tillbaka</button>
            </td>
            <td>
                
            </td>
        </tr>
        `
    
        this.table.innerHTML = rows;

        const numberOfItems = wordsRandom.length;

        document.getElementById("back").addEventListener("click", () => {
            showLists();
        });

        document.getElementById("correctList").addEventListener("click", () => {

            for(var i = 0; i < numberOfItems; i++) {
                let espElement = document.forms[0][i];

                if(espElement.value === espElement.dataset.correct) {
                    espElement.style.border = "solid 2px green"
                    espElement.style.background = "rgb(206 251 154)";
                } else {
                    espElement.style.border = "solid 2px red";
                    espElement.style.background = "rgb(255 190 190)";
                    espElement.value = `${espElement.value} (${espElement.dataset.correct})`
                }
            }
        })
    }

    function showLists() {
        
        this.listElement.style.display = 'none';
        this.listsElement.style.display = 'block';

        let listItems = Object.keys(this.lists).map((l) => `<p>${l} <a href="#" data-list-task="run" data-list-name="${l}">🤔</a> <a href="#" data-list-task="edit" data-list-name="${l}">✏️</a> <a href="#" data-list-task="delete"  data-list-name="${l}">🗑️</a></p>`)
        listItems = listItems.join("") + `<p>Ny lista <a href="#" data-list-task="edit" data-list-name="Ny lista">✏️</a> </p>`
        listsElement.innerHTML = listItems

        document.querySelectorAll("a[data-list-name]").forEach((e) => {
            e.addEventListener("click", () => {
                
                switch(e.dataset.listTask) {
                    case "delete":
                        delete this.lists[e.dataset.listName];
                        localStorage.setItem('lists', JSON.stringify(this.lists));
                        showLists();
                        break;
                    case "edit":
                        newList(this.lists[e.dataset.listName]);
                        break;
                    case "run":
                        runList(this.lists[e.dataset.listName]);
                        break;
                }
                
            })
        });

    }

    this.table = document.getElementById("table");
    this.listElement = document.getElementById("list");
    this.listsElement = document.getElementById("lists");

    this.lists = JSON.parse(localStorage.getItem('lists')) ?? {};

    console.log(this.lists);

    showLists();
});