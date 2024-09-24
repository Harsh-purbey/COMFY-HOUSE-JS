// VARIABLES START
const cartBtn = document.querySelector('.cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const productsDOM = document.querySelector('.products-center') /* FOR SHOWING ALL PRODUCTS */
// VARIABLES END


//CART START
let cart = []  /* FOR CONTAINS PRODUCTS THAT IS IN CARTS */
// CART END


// FOR GETTING PRODUCTS
class Products {

    async getProducts() {
        try {
            const res = await fetch('./products.json');
            const data = await res.json();
            let products = data.items;
            products = products.map((item) => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            })
            return products;
        } catch (error) {
            console.log(error);

        }
    }

}

// FOR DISPLAY PRODUCTS
class UI {
 
    // SHOWING ALL PRODUCTS
    displayProducts(products) {
        let result = '';
        products.forEach(products => {
            result += `<arcticle class="product">
            <div class="img-container">
                <img src=${products.image} alt="product" class="product-img">
                <button class="bag-btn" data-id=${products.id}> 
                    <i class="bi bi-cart3"></i>
                    add to bag
                </button>
            </div>
            <h3>${products.title}</h3>
            <h4>$${products.price}</h4>
        </arcticle>`
        });
        productsDOM.innerHTML = result;
    };

    // AFTER SHOWING ALL PRODUCTS WE CAN GET BUTTON FROM THAT PRODUCT
    getBagButtons(){
        const btns = [...document.querySelectorAll('.bag-btn')];
        btns.forEach((button) => {
        
                button.addEventListener('click',()=>{
                    button.innerHTML='IN CART';
                    button.disabled=true;
                })    
                
               
                

        })
    };

}

// FOR STORE CART IN LOCALSTORAGE
class Storage {

    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

}


// AFTER LOADED ALL DOM CONTENT IT WILL EXECUTE
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();   /* INSTANCE OF UI CLASS */
    const products = new Products();   /* INSTANCE OF PRODUCTS CLASS */

    // GET ALL PRODUCTS IT IS CHANABLE BECAUSE IT IS ASYNC / PROMISE
    products.getProducts()
        .then((products) => {
            ui.displayProducts(products); //SHOWING ALL PRODCUTS DYNAMICALLY
            Storage.saveProducts(products); //STORE PRODUCTS INTO LOCAL STORAGE
        })
        .then(() => {
            ui.getBagButtons()
        });


})
