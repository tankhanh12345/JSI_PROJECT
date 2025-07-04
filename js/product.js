

// Hàm format giá tiền VND
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Hàm tạo HTML cho một sản phẩm
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image || 'https://via.placeholder.com/300x200'}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description || ''}</p>
                <div class="product-price">${formatPrice(product.price || 0)}</div>
                <button class="btn-cart" onclick="addToCart('${product.id}')">
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    `;
}

// Hàm render sản phẩm từ Firebase
async function renderProductsFromFirebase() {
    const container = document.querySelector('.filterable_cards');

    if (!container) {
        console.error('Container .filterable_cards không tồn tại');
        return;
    }

    try {
        const products = [];

        db.collection("products")
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const product = {
                        id: doc.id,
                        name: data.name,
                        price: data.price || 0,
                        image: data.image || '',
                        categoryName: data.categoryName || 'Không rõ',
                        status: data.status || 'inactive'
                    };
                    products.push(product);
                });

                // Kiểm tra có sản phẩm không
                if (products.length === 0) {
                    container.innerHTML = '<div class="no-products">Không có sản phẩm nào</div>';
                    return;
                }

                // Render sản phẩm
                const productsHTML = products.map(product => createProductCard(product)).join('');
                container.innerHTML = productsHTML;

                console.log(`Đã render ${products.length} sản phẩm từ Firebase`);
            })
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ Firebase:', error);
        container.innerHTML = '<div class="error">Lỗi khi tải sản phẩm</div>';
    }
}

// Mobile navigation handler
document.addEventListener('DOMContentLoaded', function () {
    renderProductsFromFirebase();

});
