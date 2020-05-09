const apiQuartos = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72";
const cardsContainer = document.querySelector("#cards");
let data = [];
const periods = ["mês", "noite", "semana"];
const qtd = ["", "2", "3", "4"];
const options = [
    "hóspedes",
    "quartos",
    "camas",
    "banheiros",
    "Ar-Condicionado",
    "Wifi",
    "Cozinha",
    "Piscina",
    "Aquecimento Central",
];
const PAGE_SIZE = 5;

function updateLocation() {
    const city = document.getElementById("city-name").value;
    console.log("CITY = ", city);

    var geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById("googleMap"), {
        center: {
            lat: 0,
            lng: 0,
        },
        zoom: 14,
    });

    geocoder.geocode({
            address: city,
        },
        function (results, status) {
            if (status === "OK") {
                map.setCenter(results[0].geometry.location);
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        }
    );
}

function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(-7.15, -34.873),
        zoom: 14,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

async function fetchCards() {
    return await fetch(apiQuartos).then(async (r) => await r.json());
}

function renderCards(cards, page) {
    cardsContainer.innerHTML = "";
    let i = 0;
    page = page - 1;

    for (
        i = page * PAGE_SIZE; i < cards.length && i < page * PAGE_SIZE + PAGE_SIZE; i++
    )
        renderCard(cards[i], i);
}

function renderCard(card) {
    let conveniences = "";
    let selected = [];
    for (i = 0; i < 4; i++) {
        if (i > 0) conveniences += " · ";
        let pos;
        do {
            pos = Math.floor(Math.random() * options.length);
        } while (selected.includes(pos));
        selected.push(pos);
        conveniences +=
            qtd[Math.floor(Math.random() * qtd.length)] + " " + options[pos];
    }

    const div = document.createElement("div");
    div.style.margin = "2rem";
    div.className = "row cards";
    div.innerHTML = `
    <div class="col-md-6">
        <img src="${card.photo}" class = "card-img-top" alt=""/>
    </div>
    <div class = "col-md-6 card-body ">
        <p class = "card-text">
            ${card.property_type}
        </p>
        <h5 class = "card-title">${card.name}</h5>
        <p class = "card-text">
            ${conveniences}
        </p>
        <br><br><br>
        <p id="card-price">
            <span id="card-price-value">R$ ${card.price},00</span>/${
    periods[Math.floor(Math.random() * periods.length)]
  }
        </p>
    </div>
    `;

    cardsContainer.appendChild(div);
}
async function navegatePage(page) {
    data = await fetchCards();
    if (data[0]) {
        renderCards(data, page);
        console.log(data);
    }
}

navegatePage(1);