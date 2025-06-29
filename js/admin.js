

let nextId = 2;
let imageOption = 'none';

const categoryMap = {
    1: "Cà phê",
    2: "Trà",
    3: "Nước ép",
    4: "Bánh ngọt",
    5: "Khác"
};

// Toggle image upload option
function toggleImageOption(option) {
    imageOption = option;
    const btnChooseFile = document.getElementById('btnChooseFile');
    const btnNoImage = document.getElementById('btnNoImage');
    const imageFile = document.getElementById('imageFile');

    btnChooseFile.classList.remove('active');
    btnNoImage.classList.remove('active');

    if (option === 'file') {
        btnChooseFile.classList.add('active');
        imageFile.click();
    } else {
        btnNoImage.classList.add('active');
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Render products
function renderProducts() {
    const tableBody = document.getElementById('productTableBody');
    const mobileList = document.getElementById('mobileProductList');

    // Clear existing content
    tableBody.innerHTML = '';
    mobileList.innerHTML = '';

    const products = []; // Khởi tạo mảng sản phẩm ở đây

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

        // Gọi render UI sau khi đã có dữ liệu
        renderUI(products);
      })
      .catch((error) => {
        console.error("Lỗi khi load dữ liệu từ Firebase:", error);
      });
}

function renderUI(products) {
    const tableBody = document.getElementById('productTableBody');
    const mobileList = document.getElementById('mobileProductList');

    products.forEach((product, index) => {
        // Render bảng desktop
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="product-image">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '📷'}
                </div>
            </td>
            <td>${product.name}</td>
            <td>${product.categoryName}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>
                <span class="status-badge ${product.status === 'active' ? 'status-active' : 'status-inactive'}">
                    ${product.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-edit" onclick="editProduct('${product.id}')">✏️ Sửa</button>
                    <button class="action-btn btn-delete" onclick="deleteProduct('${product.id}')">🗑️ Xóa</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);

        // Render thẻ mobile
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-card-header">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p><strong>Giá:</strong> ${formatCurrency(product.price)}</p>
                    <p><strong>Loại:</strong> ${product.categoryName}</p>
                    <p><strong>Trạng thái:</strong>
                        <span class="status-badge ${product.status === 'active' ? 'status-active' : 'status-inactive'}">
                            ${product.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                    </p>
                </div>
                <div class="product-actions">
                    <button class="action-btn btn-edit" onclick="editProduct('${product.id}')">✏️</button>
                    <button class="action-btn btn-delete" onclick="deleteProduct('${product.id}')">🗑️</button>
                </div>
            </div>
        `;
        mobileList.appendChild(card);
    });
}


// Add product
document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const category = parseInt(document.getElementById('productCategory').value);
    const imageFile = document.getElementById('imageFile').files[0];

    let imageUrl = null;
    if (imageFile && imageOption === 'file') {
        imageUrl = URL.createObjectURL(imageFile);
    }

    const newProduct = {
        id: nextId++,
        name: name,
        price: price,
        category: category,
        categoryName: categoryMap[category],
        image: imageUrl,
        status: 'active'
    };

    db.collection("products")
        .add(newProduct)
        .then(() => {
            alert("Thêm sản phẩm thành công!");
            
        })
        .catch((error) => console.error("Lỗi khi thêm sản phẩm:", error));
    renderProducts();
    resetForm();
    showToast('Thêm sản phẩm thành công!');
});

// Reset form
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('btnChooseFile').classList.remove('active');
    document.getElementById('btnNoImage').classList.add('active');
    imageOption = 'none';
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCategory').value = product.category;

    document.getElementById('editModal').style.display = 'block';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Update product
document.getElementById('editForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('editProductId').value);
    const name = document.getElementById('editProductName').value;
    const price = parseInt(document.getElementById('editProductPrice').value);
    const category = parseInt(document.getElementById('editProductCategory').value);

    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            name: name,
            price: price,
            category: category,
            categoryName: categoryMap[category]
        };

        renderProducts();
        closeEditModal();
        showToast('Cập nhật sản phẩm thành công!');
    }
});

// Delete product
function deleteProduct(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        db.collection("products")
          .doc(id)
          .delete()
          .then(() => {
              showToast('🗑️ Xóa sản phẩm thành công!');
              renderProducts(); // Tải lại danh sách sau khi xoá
          })
          .catch((error) => {
              console.error("Lỗi khi xoá sản phẩm:", error);
              showToast('⚠️ Có lỗi xảy ra khi xoá sản phẩm!');
          });
    }
}
 
// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
}

// Logout function
function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        showToast('Đăng xuất thành công!', 'success');
        setTimeout(() => {
            // Redirect to login page
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Mobile navigation handler
document.addEventListener('DOMContentLoaded', function () {
    renderProducts();
    // Set default image option
    document.getElementById('btnNoImage').classList.add('active');
});

