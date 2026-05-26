// логотип
const headerTitle = document.querySelector('.logo h1');
headerTitle.addEventListener('click', function() {
    const messages = [
        'вы официально еврей',
        'вы официально цыган',
        'вы официально чурка'
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    this.textContent = messages[randomIndex];
});

let logoClickCount = 0;
headerTitle.addEventListener('click', function(e) {
    logoClickCount++;
    console.log(`логотип был нажат: ${logoClickCount} раз`);
    if (logoClickCount === 7) {
        alert('вы официально еврециганчурка 3 отцов');
        logoClickCount = 0;
    }
}, true);

// данные для кнопки "подробнее"
const productDetails = [
    ["пин с гоблином для клешки только для аморальных ушлепков"],
    ["скин на авп только для русских ушлепков"],
    ["скин на маску в пей дай2 для истиных петухов(всей зоной петушили)"],
    ["геймпад розовый для истиных мужин"],
    ["сноуборд для фрирайда Arbor Terrapin 18/19 украден(не уверен но наверное отмыт)"]
];

// генерация кнопки "подробнее"
document.querySelectorAll('.product-card').forEach(function(card, i) {
    const info = card.querySelector('.product-info');
    const footer = card.querySelector('.product-footer');
    if (!info || !footer) return;

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'product-details';
    detailsDiv.style.display = 'none';
    detailsDiv.innerHTML = '<div>' + (productDetails[i] || productDetails[0]).map(item => `<div>${item}</div>`).join('') + '</div>';
    info.insertBefore(detailsDiv, footer);

    const btn = document.createElement('button');
    btn.className = 'details-btn';
    btn.textContent = 'подробнее';
    const addToCartBtn = footer.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        footer.insertBefore(btn, addToCartBtn);
    } else {
        footer.appendChild(btn);
    }

    let isVisible = false;
    btn.addEventListener('click', function() {
        isVisible = !isVisible;
        detailsDiv.style.display = isVisible ? 'block' : 'none';
        btn.textContent = isVisible ? 'скрыть подробности' : 'подробнее';
    });
});

// кнопка "наверх"
const scrollTopBtn = document.createElement('button');
scrollTopBtn.textContent = '⬆';
scrollTopBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:50px;height:50px;border-radius:50%;background-color:rgb(46, 101, 14);color:white;font-size:24px;display:none;z-index:999;transition:all 0.3s;';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', function() {
    scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// фильтр
function filterProducts(filterType) {
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    filterButtons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${filterType}'`)) {
            btn.classList.add('active');
        }
    });

    productCards.forEach(function(card) {
        const priceElement = card.querySelector('.price');
        if (!priceElement) return;
        const priceText = priceElement.textContent;
        const price = parseInt(priceText.replace(/\D/g, ''));
        let showProduct = false;

        if (filterType === 'all') {
            showProduct = true;
        } else if (filterType === 'low') {
            showProduct = price < 10000;
        } else if (filterType === 'high') {
            showProduct = price >= 100000;
        } else if (filterType === 'medium') {
            showProduct = price >= 10000 && price < 100000;
        }
        card.style.display = showProduct ? '' : 'none';
    });
}

// корзина
let cart = [];

function addToCart(productName, price) {
    const item = cart.find(i => i.name === productName);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    updateCart();
    alert(`✔ ${productName} добавлен в корзину за ${price} рублей`);
}

function removeFromCart(productName) {
    cart = cart.filter(i => i.name !== productName);
    updateCart();
}

function changeQuantity(productName, delta) {
    const item = cart.find(i => i.name === productName);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productName);
    } else {
        updateCart();
    }
}

function clearCart() {
    cart = [];
    updateCart();
    alert('✔ Корзина очищена');
}

function checkout() {
    if (!cart.length) {
        alert('Корзина пуста');
        return;
    }
    const totalQuantity = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    alert(`Вы купили\nтоваров: ${totalQuantity}\nна сумму ${totalPrice} рублей`);
    clearCart();
}

function updateCart() {
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');

    if (!itemsEl || !totalEl) return;

    itemsEl.innerHTML = '';

    if (cart.length === 0) {
        itemsEl.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        totalEl.style.display = 'none';
        if (countEl) countEl.textContent = '0';
        return;
    }

    totalEl.style.display = 'block';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="item-name">${item.name}</div>
            <div class="item-price">${item.price} руб.</div>
            <div class="item-quantity">
                <button onclick="changeQuantity('${item.name}', -1)" class="quantity-btn">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.name}', 1)" class="quantity-btn">+</button>
            </div>
            <div class="item-total">${itemTotal} руб.</div>
            <button onclick="removeFromCart('${item.name}')" class="remove-btn">✖</button>
        `;
        itemsEl.appendChild(row);
    });

    //   исправлено: id total-price (раньше было cart-total-price)
    document.getElementById('total-price').textContent = total;
    if (countEl) countEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

// инициализация
updateCart();

document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.product-card');
       if (!card) return;
       const name = card.querySelector('h3')?.textContent;
        if (!name) return;
        const priceEl = card.querySelector('.price');
        if (!name || !priceEl) return;
        const price = parseInt(priceEl.textContent.replace(/\D/g, ''));
        addToCart(name, price);
    });
    
})
// переключение темы
const themeSwitcher = document.getElementById('theme-switcher');
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        if (themeSwitcher) themeSwitcher.textContent = '🌞';
    } else {
        document.body.classList.remove('dark');
        if (themeSwitcher) themeSwitcher.textContent = '🌜';
    }
    localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

if (themeSwitcher) {
    themeSwitcher.addEventListener('click', function() {
        const isDark = document.body.classList.contains('dark');
        setTheme(isDark ? 'light' : 'dark');
    });
}

const modal = document.getElementById('order-modal');
const closeModal = document.getElementById('close-modal');
const cancelModal = document.getElementById('cancel-modal');
const orderForm = document.getElementById('order-form');

function showOrderModal() {
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeOrderModal() {
    if (modal) {
        modal.style.display = 'none';
        orderForm.reset();
    }
}

if (closeModal) closeModal.addEventListener('click', closeOrderModal);
    

if (cancelModal) cancelModal.addEventListener('click', closeOrderModal);
    
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeOrderModal();
    }

})