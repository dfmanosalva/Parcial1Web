/* eslint-disable indent */
const URL = "./Assets/menu.json";
const request = new XMLHttpRequest();
let respuesta = null;
const navbar = document.getElementById("navbar");
const cards = document.getElementById("div-principal");
const categoryName = document.getElementById("category-name");
let itemsInCart = document.getElementById("item-numbers");
itemsInCart.onclick = showCart;

let cart = [];
let elementsInCart = 0;
let total = 0.0;

request.open("GET", URL);
request.onload = function () {
    if (request.status === 200) {
        respuesta = JSON.parse(request.response);
        for (let i = 0; i < respuesta.length; i++) {
            const element = respuesta[i];
            navbar.innerHTML += `<a class="nav-link" id="${element.name}">  ${element.name} </a>`;
        }
        navbar.childNodes.forEach((element) => {
            element.onclick = callCards;
        });
        callCards();
    }
};
request.send();

//Crear las cartas con la información de cada producto
function callCards() {
    cards.classList.add(
        "row",
        "row-cols-auto",
        "g-4",
        "margin-bottom-10",
        "justify-content-evenly"
    );
    let llamador =
        this.innerText === undefined ? respuesta[0].name : this.innerText;
    categoryName.innerText = llamador;
    for (let index = 0; index < respuesta.length; index++) {
        if (respuesta[index].name == llamador) {
            cards.innerHTML = "";
            respuesta[index].products.forEach((element) => {
                cards.innerHTML += `<div class="col">
                    <div class="card h-100" style="width: 18rem">
                        <img src="${element.image}" class="card-img-top" alt="Image-${element.name}" />
                        <div class="card-body d-flex flex-column ">
                            <h5 class="card-title">${element.name}</h5>
                            <p class="card-text">
                                ${element.description}
                            </p>
                            <div class="mt-auto" >
                                <h6><strong>$ ${element.price}</strong></h6>
                                <button class="btn btn-dark" id="button-${element.name}">Add to cart</button>
                            </div>
                        </div>
                    </div>
               </div>`;
            });
        }
    }
    cards.childNodes.forEach((element) => {
        element.onclick = addToCart;
    });
}

//Añadir un elemento al carrito
function addToCart() {
    let exit = false;
    elementsInCart += 1;
    itemsInCart.textContent = `${elementsInCart} items`;
    let info = this.innerText.split("\n");
    cart.forEach((element) => {
        if (element.description === info[0]) {
            element.quantity += 1;
            (total += parseFloat(info[4].split("$ ")[1])), (exit = true);
            return;
        }
    });
    if (exit) {
        return;
    }

    let item = {
        item: cart.length + 1,
        description: info[0],
        quantity: 1,
        unitPrice: parseFloat(info[4].split("$ ")[1]),
    };
    total += parseFloat(info[4].split("$ ")[1]);
    cart.push(item);
}

function showCart() {
    let htmlToInsert = "";
    cards.classList.remove(
        "row",
        "row-cols-auto",
        "g-4",
        "margin-bottom-10",
        "justify-content-evenly"
    );
    cards.classList.add();
    cards.innerHTML = "";
    categoryName.innerText = "Cart";
    htmlToInsert = `
    <table class="table table-striped">
        <thead>
            <tr>
                <th scope="col">Item</th>
                <th scope="col">Quantity</th>
                <th scope="col">Description</th>
                <th scope="col">Unit Price</th>
                <th scope="col">Amount</th>
                <th scope="col">Modify</th>
            </tr>
        </thead>
        <tbody>`;
    for (let index = 0; index < cart.length; index++) {
        const element = cart[index];
        htmlToInsert += `
        <tr>
            <th scope="row">${element.item}</th>
            <td>${element.quantity}</td>
            <td>${element.description}</td>
            <td>$ ${element.unitPrice.toFixed(2)}</td>
            <td>$ ${(element.quantity * element.unitPrice).toFixed(2)}</td>
            <td>
                <button class="btn btn-secondary btn-sm" id="add-${index}">
                    +
                </button>
                &nbsp
                <button class="btn btn-secondary btn-sm"id="remove-${index}">
                    -
                </button>
            </td>
        </tr>
        `;
    }
    htmlToInsert += `
        </tbody>
    </table>
    <div class="d-flex justify-content-between container-fluid">
        <span>Total: $${total.toFixed(2)}</span>
        <div>
            <button class="btn btn-danger" id="cancel">Cancel</button>
            <button class="btn btn-outline-success" id="confirm">
                Confirm Order
            </button>
        </div>
    </div>`;
    cards.innerHTML = htmlToInsert;
    for (let i = 0; i < cart.length; i++) {
        document.querySelector(`#remove-${i}`).onclick = removeOneQty;
        document.querySelector(`#add-${i}`).onclick = addOneQty;
    }
    document.querySelector("#cancel").onclick = cancelOrder;
    document.querySelector("#confirm").onclick = confirmOrder;
}

function removeOneQty() {
    let index = parseInt(this.id[this.id.length - 1]);
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        total -= cart[index].unitPrice;
        elementsInCart -= 1;
        itemsInCart.textContent = `${elementsInCart} items`;
    } else {
        total -= cart[index].unitPrice;
        cart.splice(index, 1);
        elementsInCart -= 1;
        itemsInCart.textContent = `${elementsInCart} items`;
    }
    showCart();
}

function addOneQty() {
    cart[parseInt(this.id[this.id.length - 1])].quantity += 1;
    total += cart[parseInt(this.id[this.id.length - 1])].unitPrice;
    elementsInCart += 1;
    itemsInCart.textContent = `${elementsInCart} items`;
    showCart();
}

function cancelOrder() {
    Console.log("confirm");
}

function confirmOrder() {
    Console.log(cart);
}
