let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = Number(localStorage.getItem('total')) || 0;

function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.toggle('open');
}

function addToCart(productName, productPrice, sizeSelectId) {
    const size = document.getElementById(sizeSelectId).value;
    const existingProduct = cart.find(item => item.name === productName && item.size === size);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, size: size, quantity: 1 });
    }

    total += productPrice;
    updateCart();
    saveCart();
    updateItemCount();
}

function removeFromCart(productName, size) {
    const itemToRemove = cart.find(item => item.name === productName && item.size === size);
    if (itemToRemove) {
        total -= itemToRemove.price * itemToRemove.quantity;
    }
    cart = cart.filter(item => !(item.name === productName && item.size === size));
    updateCart();
    saveCart();
    updateItemCount();

    if (cart.length === 0) {
        localStorage.removeItem('cart');
        localStorage.removeItem('total');
        total = 0;
    }
}

function decreaseQuantity(productName, size) {
    const existingProduct = cart.find(item => item.name === productName && item.size === size);

    if (existingProduct) {
        total -= existingProduct.price;
        existingProduct.quantity--;

        if (existingProduct.quantity <= 0) {
            removeFromCart(productName, size);
        } else {
            updateCart();
            saveCart();
        }
    }
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');
    cartItemsDiv.innerHTML = '';

    const groupedItems = cart.reduce((acc, item) => {
        if (!acc[item.size]) {
            acc[item.size] = [];
        }
        acc[item.size].push(item);
        return acc;
    }, {});

    for (const size in groupedItems) {
        const items = groupedItems[size];
        cartItemsDiv.innerHTML += `<h4>Size: ${size}</h4>`;
        items.forEach((item) => {
            cartItemsDiv.innerHTML += 
                `<div class="cart-item">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price.toFixed(2)} | Quantity: ${item.quantity}</p>
                    <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="decrease-qty-btn" onclick="decreaseQuantity('${item.name}', '${item.size}')">-</button>
                    <button class="remove-item-btn" onclick="removeFromCart('${item.name}', '${item.size}')">Remove</button>
                </div>`;
        });
    }

    cartTotalDiv.innerHTML = `Total: $${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('total', total);
}

function updateItemCount() {
    const itemCountElement = document.getElementById('item-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    itemCountElement.textContent = totalItems;
    
    if (totalItems === 0) {
        itemCountElement.style.display = 'none';
    } else {
        itemCountElement.style.display = 'flex';
    }
}

window.onload = function() {
    updateCart();
    updateItemCount();
    if (cart.length === 0) {
        localStorage.removeItem('cart');
        localStorage.removeItem('total');
        total = 0;
    } else {
        total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
}
// JavaScript Document