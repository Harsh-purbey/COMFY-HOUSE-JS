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
let buttonsDOM = []
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
    getBagButtons() {
        const btns = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = btns;
        btns.forEach((button) => {
            let id = button.dataset.id;
            let inCart = cart.find((item) => item.id === id)
            // IT USED WHEN WE STORE PRODUCTS IN CART & STORE CART INTO LOCALSTORAGE
            if (inCart) {
                button.innerHTML = 'In Cart';
                button.disabled = true;
            }
            // FOR FIRST TIME CLICK ON ADD TO CART BUTTON
            button.addEventListener('click', (event) => {
                // BECAUSE WE WANT AFTER 1 CLICK THAT BUTTON DON'T DO ANY THING SO WE ADD EVENTLISTNER IN CLICK
                event.target.innerHTML = 'In Cart';
                event.target.disabled = true;
                // GET PRODUCT  FROM PRODUCTS
                let cartItem = { ...Storage.getProduct(id), amount: 1 };
                // ADD PRODUCT TO THE CART
                cart = [...cart, cartItem];
                // SAVE SART IN LOCAL STORAGE
                Storage.saveCart(cart);
                // SET CART VALUES
                this.setCartValue(cart);
                // DISPLAY CART ITEMS
                this.addCartItem(cartItem);
                // SHOW THE CART
                this.showCart();
            })
        })
    };
    // FOR SET HOW MANY VALUES IN CART & TOTAL AMOUNT
    setCartValue(cart) {
        let tempTotal = 0; //FOR TOTAL PRICE
        let itemsTotal = 0; // FOR TOTAL NO OF ITEMS TO SHOW IN CART ICON ON NAVBAR
        cart.map((item) => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })


        cartItems.innerText = itemsTotal;
        cartTotal.innerText = Number(tempTotal.toFixed(2));
    };
    addCartItem(item) {
        let div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<img src=${item.image} alt="product">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>${item.price}</h5>
                        <span class="remove-item" data-id=${item.id}>remove</span>
                    </div>
                    <div>   
                        <i class="bi bi-chevron-up" data-id=${item.id}></i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="bi bi-chevron-down" data-id=${item.id}></i>
                    </div>`
        cartContent.appendChild(div);
        console.log(cartContent);

    }
    // FOR SHOWING CART ON DISPLAY AFTER ADDING THE PRODUCTS INTO THE CART
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    };

    hiddenCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    setupAPP() {
        cart = Storage.getCart();
        this.setCartValue(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hiddenCart)
    }

    populateCart() {
        cart.forEach((item) => {
            this.addCartItem(item)
        })
    }

    // FOR CLEAR CART BUTTON
    cartLogic() {

        clearCartBtn.addEventListener('click', () => {
            this.clearCart()
        })

        cartContent.addEventListener('click',(event)=>{

            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target;
                let id = removeItem.dataset.id; 
                cartContent.removeChild(removeItem.parentElement.parentElement)
                this.removeItem(id)    
            }
            else if(event.target.classList.contains("bi-chevron-up")){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                
                
                tempItem.amount = tempItem.amount +1;
                console.log(tempItem.amount);
                Storage.saveCart(cart);
                this.setCartValue(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains("bi-chevron-down")){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                
                
                tempItem.amount = tempItem.amount === 1 ? 1 :tempItem.amount -1;
                console.log(tempItem.amount);
                Storage.saveCart(cart);
                this.setCartValue(cart);
                addAmount.previousElementSibling.innerText = tempItem.amount;
            }
            
        })


    }

    // REMOVE ONE BY ONE SO THAT WE CAN USE FUNCTION TO  A SINGLE ITEM ALSO
    clearCart() {
        let cartItems = cart.map((item) => item.id);
        console.log(cartItems);
        
        cartItems.forEach(id => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
    }

    // THIS METHOD REMOVES ITEM FROM CART ACTUALLY
    removeItem(id) {
        cart = cart.filter((item) => item.id !== id);
        this.setCartValue(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="bi bi-cart3"></i> add to bag`
    }

    getSingleButton(id) {
            return buttonsDOM.find((item) => item.dataset.id === id)
    }
}

// FOR STORE CART IN LOCALSTORAGE
class Storage {

    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find((item) => item.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }

}


// AFTER LOADED ALL DOM CONTENT IT WILL EXECUTE
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();   /* INSTANCE OF UI CLASS */
    const products = new Products();   /* INSTANCE OF PRODUCTS CLASS */

    // SETUP APP AT TIME OF LOADING PAGE CHEECK CART ARE PRESENT IN LOCAL STORAGE OR NOT
    ui.setupAPP()

    // GET ALL PRODUCTS IT IS CHANABLE BECAUSE IT IS ASYNC / PROMISE
    products.getProducts()
        .then((products) => {
            ui.displayProducts(products); //SHOWING ALL PRODCUTS DYNAMICALLY
            Storage.saveProducts(products); //STORE PRODUCTS INTO LOCAL STORAGE
        })
        .then(() => {
            ui.getBagButtons();
            ui.cartLogic();
        });


})
