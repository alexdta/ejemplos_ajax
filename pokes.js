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

        ShowPokemons2(json.results, _pokeList);

    } catch (err) {
        console.error(err);
    }

}

async function ShowPokemons(list) {

    try {
        let _figure = "";

        for (i = 0; i < list.length; i++) {
            let poke = list[i],
                res = await fetch(poke.url),
                json = await res.json();

            _figure +=
                `<figure class="figure col-3">
                <img src="${json.sprites.front_default}" class="figure-img img-fluid rounded" alt="${json.name}">
                <figcaption class="figure-caption">#${json.id} | ${json.name}</figcaption>
                </figure>`;
        }

        let _list = d.getElementById("list");
        _list.innerHTML = _figure;
    } catch (err) {
        console.error(err);
    }


}


async function ShowPokemons2(list, content) {

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
            template.querySelector("p").dataset.id = json.id;

            let clone = d.importNode(template, true);
            _fragment.appendChild(clone);
        }
        
        content.innerHTML = "";
        content.appendChild(_fragment);

    } catch (err) {
        console.error(err);
    }
}
