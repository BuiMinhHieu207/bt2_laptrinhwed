// Dữ liệu sản phẩm mẫu
const products = [
    { id: 1, name: "Tai nghe Bluetooth", price: 350000, category: "Phụ kiện", image: "images/sp01.jpg", description: "Tai nghe không dây nhỏ gọn, dễ sử dụng." },
    { id: 2, name: "Chuột không dây", price: 220000, category: "Phụ kiện", image: "images/sp02.jpg", description: "Chuột không dây phù hợp học tập và làm việc." },
    { id: 3, name: "Bàn phím cơ", price: 690000, category: "Phụ kiện", image: "images/sp03.jpg", description: "Bàn phím gõ êm, thiết kế chắc chắn." },
    { id: 4, name: "Loa mini", price: 280000, category: "Âm thanh", image: "images/sp04.jpg", description: "Loa mini tiện lợi khi mang đi." },
    { id: 5, name: "Đồng hồ thông minh", price: 850000, category: "Thiết bị", image: "images/sp05.jpg", description: "Theo dõi thời gian và hoạt động hằng ngày." },
    { id: 6, name: "Đế tản nhiệt laptop", price: 320000, category: "Phụ kiện", image: "images/sp06.jpg", description: "Hỗ trợ tản nhiệt cho laptop." }
];

function formatMoney(number) {
    return number.toLocaleString("vi-VN") + " đ";
}

function getCart() {
    return JSON.parse(localStorage.getItem("minishopCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("minishopCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const countElement = document.querySelector("#cart-count");
    if (countElement) {
        const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = total;
    }
}

function getProduct(id) {
    return products.find(product => product.id === Number(id));
}

function addToCart(id) {
    const product = getProduct(id);
    if (!product) return;

    const cart = getCart();
    const item = cart.find(item => item.id === product.id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ id: product.id, quantity: 1 });
    }

    saveCart(cart);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
}

function renderProducts(list, elementId = "product-list") {
    const container = document.getElementById(elementId);
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp.</p>";
        return;
    }

    container.innerHTML = list.map(product => `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}"
                 onerror="this.src='https://placehold.co/600x400?text=MiniShop'">
            <div class="product-info">
                <span class="tag">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="price">${formatMoney(product.price)}</p>
                <p class="muted">${product.description}</p>
                <div class="product-actions">
                    <a class="button secondary" href="product.html?id=${product.id}">Chi tiết</a>
                    <button type="button" onclick="addToCart(${product.id})">Thêm giỏ</button>
                </div>
            </div>
        </article>
    `).join("");
}

function searchProducts(keyword) {
    const key = keyword.trim().toLowerCase();
    const result = products.filter(product =>
        product.name.toLowerCase().includes(key) ||
        product.category.toLowerCase().includes(key)
    );
    renderProducts(result);
}

function renderCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    const cart = getCart();
    if (cart.length === 0) {
        container.innerHTML = '<tr><td colspan="5">Giỏ hàng đang trống.</td></tr>';
        document.getElementById("cart-total").textContent = formatMoney(0);
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const product = getProduct(item.id);
        if (!product) return "";

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return `
            <tr>
                <td>
                    <div class="cart-product">
                        <img src="${product.image}" alt="${product.name}"
                             onerror="this.src='https://placehold.co/100x100?text=SP'">
                        <span>${product.name}</span>
                    </div>
                </td>
                <td>${formatMoney(product.price)}</td>
                <td><input class="quantity-input" type="number" min="1" value="${item.quantity}"
                    onchange="changeQuantity(${product.id}, this.value)"></td>
                <td>${formatMoney(subtotal)}</td>
                <td><button class="danger" onclick="removeFromCart(${product.id})">Xóa</button></td>
            </tr>
        `;
    }).join("");

    document.getElementById("cart-total").textContent = formatMoney(total);
}

function changeQuantity(id, value) {
    const quantity = Number(value);
    if (!Number.isInteger(quantity) || quantity < 1) {
        alert("Số lượng phải từ 1 trở lên.");
        renderCart();
        return;
    }

    const cart = getCart();
    const item = cart.find(item => item.id === Number(id));
    if (item) item.quantity = quantity;

    saveCart(cart);
    renderCart();
}

function removeFromCart(id) {
    const cart = getCart().filter(item => item.id !== Number(id));
    saveCart(cart);
    renderCart();
}

function renderProductDetail() {
    const container = document.getElementById("product-detail");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const product = getProduct(params.get("id"));

    if (!product) {
        container.innerHTML = "<p>Không tìm thấy sản phẩm.</p>";
        return;
    }

    container.innerHTML = `
        <div class="two-columns">
            <img src="${product.image}" alt="${product.name}"
                 onerror="this.src='https://placehold.co/600x400?text=MiniShop'">
            <div>
                <span class="tag">${product.category}</span>
                <h1>${product.name}</h1>
                <p class="price">${formatMoney(product.price)}</p>
                <p>${product.description}</p>
                <button onclick="addToCart(${product.id})">Thêm vào giỏ hàng</button>
            </div>
        </div>
    `;
}

function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = message;
    element.className = isError ? "error" : "message";
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();

    // Trang chủ
    renderProducts(products);

    // Tìm kiếm sản phẩm
    const searchForm = document.getElementById("search-form");
    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            searchProducts(document.getElementById("search-input").value);
        });
    }

    // Trang chi tiết
    renderProductDetail();

    // Trang giỏ hàng
    renderCart();

    // Form đăng ký
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("register-name").value.trim();
            const email = document.getElementById("register-email").value.trim();
            const password = document.getElementById("register-password").value;
            const confirmPassword = document.getElementById("register-confirm").value;

            if (!name || !email || !password || !confirmPassword) {
                showMessage("register-message", "Vui lòng nhập đầy đủ thông tin.", true);
                return;
            }
            if (password.length < 6) {
                showMessage("register-message", "Mật khẩu phải có ít nhất 6 ký tự.", true);
                return;
            }
            if (password !== confirmPassword) {
                showMessage("register-message", "Mật khẩu nhập lại không khớp.", true);
                return;
            }

            const users = JSON.parse(localStorage.getItem("minishopUsers")) || [];
            if (users.some(user => user.email === email)) {
                showMessage("register-message", "Email này đã được đăng ký.", true);
                return;
            }

            users.push({ name, email, password });
            localStorage.setItem("minishopUsers", JSON.stringify(users));
            showMessage("register-message", "Đăng ký thành công! Bạn có thể đăng nhập.");
            registerForm.reset();
        });
    }

    // Form đăng nhập
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;
            const users = JSON.parse(localStorage.getItem("minishopUsers")) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem("minishopCurrentUser", JSON.stringify({
                    name: user.name,
                    email: user.email
                }));
                showMessage("login-message", "Đăng nhập thành công. Xin chào " + user.name + "!");
            } else {
                showMessage("login-message", "Email hoặc mật khẩu không đúng.", true);
            }
        });
    }

    // Form liên hệ
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("contact-name").value.trim();
            const email = document.getElementById("contact-email").value.trim();
            const content = document.getElementById("contact-content").value.trim();

            if (!name || !email || !content) {
                showMessage("contact-message", "Vui lòng điền đủ thông tin.", true);
                return;
            }

            showMessage("contact-message", "Cảm ơn bạn! Tin nhắn đã được ghi nhận trên giao diện demo.");
            contactForm.reset();
        });
    }
});
