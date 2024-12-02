const form = document.getElementById('p-form');
const addProductBtn = document.getElementById('add-product');
const productTable = document.getElementById('p-table');
const searchInput = document.getElementById('search');

let productList = [];
let editIndex = -1;

function renderTable(products = productList) {
    productTable.innerHTML = '';
    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.category}</td>
            <td>${product.description}</td>
            <td><button class="update-btn" onclick="editProduct(${index})">Update</button></td>
            <td><button class="delete-btn" onclick="deleteProduct(${index})">Delete</button></td>
        `;
        productTable.appendChild(row);
    });
}

function validateFields(name, price, category, description) {
    if (typeof name !== "string" || name.length < 3 || name.length > 100) {
        alert("Name must be a string with 3 to 100 characters.");
        return false;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 1 || priceNum > 1000000000) {
        alert("Price must be a number between 1 and 1,000,000,000.");
        return false;
    }

    if (typeof category !== "string" || category.length < 3 || category.length > 100) {
        alert("Category must be a string with 3 to 100 characters.");
        return false;
    }

    if (typeof description !== "string" || description.length < 3 || description.length > 255) {
        alert("Description must be a string with 3 to 255 characters.");
        return false;
    }

    return true;
}

function addProduct() {
    const name = document.getElementById('p-name').value.trim();
    const price = document.getElementById('p-price').value.trim();
    const category = document.getElementById('p-category').value.trim();
    const description = document.getElementById('p-description').value.trim();

    if (!validateFields(name, price, category, description)) {
        return; 
    }

    if (editIndex === -1) {
        productList.push({ name, price, category, description });
    } else {

        productList[editIndex] = { name, price, category, description };
        editIndex = -1;
        addProductBtn.textContent = "Add Product";
        addProductBtn.classList.remove('update-btn');
        addProductBtn.classList.add('add-btn');
    }

    form.reset();
    renderTable();
}


function deleteProduct(index) {
    productList.splice(index, 1);
    renderTable();
}

function editProduct(index) {
    const product = productList[index];
    document.getElementById('p-name').value = product.name;
    document.getElementById('p-price').value = product.price;
    document.getElementById('p-category').value = product.category;
    document.getElementById('p-description').value = product.description;

    editIndex = index; 
    addProductBtn.textContent = "Update Product";
    addProductBtn.classList.remove('add-btn');
    addProductBtn.classList.add('update-btn');
}

function searchProducts() {
    const query = searchInput.value.toLowerCase();
    if (!query) {
        renderTable();
        return;
    }

    const filteredProducts = productList.filter(product => product.name.toLowerCase().includes(query));

    filteredProducts.forEach(product => {
        product.highlightedName = product.name
            .split('')
            .map(char =>
                query.includes(char.toLowerCase())
                    ? `<span style="color: red;">${char.toLowerCase()}</span>`
                    : char
            )
            .join('');
    });

    productTable.innerHTML = '';
    filteredProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.highlightedName}</td>
            <td>${product.price}</td>
            <td>${product.category}</td>
            <td>${product.description}</td>
            <td><button class="update-btn" onclick="editProduct(${index})">Update</button></td>
            <td><button class="delete-btn" onclick="deleteProduct(${index})">Delete</button></td>
        `;
        productTable.appendChild(row);
    });
}

addProductBtn.addEventListener('click', addProduct);
searchInput.addEventListener('input', searchProducts);
