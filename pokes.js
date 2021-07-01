let d = document;
let url = "https://pokeapi.co/api/v2/pokemon/";

let _previous = d.getElementById("previous");
let _next = d.getElementById("next");

d.addEventListener("DOMContentLoaded", (e) => PokemonList(url));

d.addEventListener("click", (e) => {

    if (e.target === _previous || e.target === _next) {
        PokemonList(e.target.dataset.url);
    }
});

async function PokemonList(url) {

    try {
        let _pokeList = d.getElementById("pokeList");
        _pokeList.innerHTML = "<img src='./load.gif' alt='loading . . . '>";

        let res = await fetch(url),
            json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText }

        if (json.next != null) {
            _next.classList.remove("d-none");
            _next.dataset.url = json.next;
        } else {
            _next.classList.add("d-none");
        }

        if (json.previous != null) {
            _previous.classList.remove("d-none");
            _previous.dataset.url = json.previous;
        } else {
            _previous.classList.add("d-none");
        }

        ShowPokemons(json.results, _pokeList);

    } catch (err) {
        console.error(err);
    }

}

async function ShowPokemons(list, content) {

    try {

        let template = d.getElementById("template").content;
        let _fragment = d.createDocumentFragment();

        for (i = 0; i < list.length; i++) {
            let poke = list[i],
                res = await fetch(poke.url),
                json = await res.json();

            template.querySelector("img").setAttribute("src", json.sprites.front_default);
            template.querySelector("img").setAttribute("alt", json.name);

            template.querySelector("h5").textContent = json.name;
            template.querySelector("p").textContent = `Pokémon #${json.id}`;
            template.querySelector("a").dataset.id = json.id;

            let clone = d.importNode(template, true);
            _fragment.appendChild(clone);
        }

        content.innerHTML = "";
        content.appendChild(_fragment);

    } catch (err) {
        console.error(err);
    }
}

let detailsModal = d.getElementById("detailsModal");
if (detailsModal != null) {
    detailsModal.addEventListener('show.bs.modal', function (e) {

        let button = e.relatedTarget;
        let urlDetail = `${url}${button.dataset.id}`;

        fetch(urlDetail)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then(json => {
                this.querySelector("#detailsModalLabel").textContent = json.name;
                this.querySelector("#imgNormal").innerHTML =
                    `<figure class="figure">
                <img src="${json.sprites.front_default}" class="figure-img img-fluid rounded" alt="${json.name}" width="192px">
                <figcaption class="figure-caption">Normal</figcaption>
                </figure>`;

                this.querySelector("#imgShiny").innerHTML =
                    `<figure class="figure">
                <img src="${json.sprites.front_shiny}" class="figure-img img-fluid rounded" alt="${json.name}" width="192px">
                <figcaption class="figure-caption">Shiny</figcaption>
                </figure>`;

                let _fragment = d.createDocumentFragment();

                json.types.forEach(type => {
                    let li = d.createElement("li");
                    li.textContent = type.type.name;
                    li.classList.add("capitalLetter", "list-group-item");

                    _fragment.appendChild(li);
                });

                let types = this.querySelector("#types");
                types.innerHTML = "";
                types.appendChild(_fragment);

            })
            .catch(err => {
                console.error("El Error al listar los datos!", err);
            });

    });
}