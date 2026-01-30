const productsData = [
  // 5 Sản phẩm cũ của bạn
  { "id": 6, "title": "Classic Comfort Fit Joggers", "price": 25, "description": "Perfect blend of style and comfort with soft elastic waistband.", "images": ["https://i.imgur.com/ZKGofuB.jpeg"] },
  { "id": 14, "title": "Classic High-Waisted Athletic Shorts", "price": 43, "description": "Designed for optimal movement and versatility for workout.", "images": ["https://i.imgur.com/eGOUveI.jpeg"] },
  { "id": 15, "title": "Classic White Crew Neck T-Shirt", "price": 39, "description": "Versatile white crew neck tee made from soft cotton blend.", "images": ["https://i.imgur.com/axsyGpD.jpeg"] },
  { "id": 16, "title": "Classic White Tee - Timeless Style", "price": 73, "description": "Premium soft cotton material, perfect for daily wear.", "images": ["https://i.imgur.com/Y54Bt8J.jpeg"] },
  { "id": 17, "title": "Classic Black T-Shirt", "price": 35, "description": "Staple piece crafted from breathable cotton for all-day comfort.", "images": ["https://i.imgur.com/9DqEOV5.jpeg"] },
  
  // 5 Sản phẩm mới thêm (Ảnh cực kỳ ổn định)
  {
    "id": 101,
    "title": "Modern Leather Watch",
    "price": 120,
    "description": "A sophisticated timepiece with a genuine leather strap and minimalist dial.",
    "images": ["https://images.unsplash.com/photo-1524592093035-238b9d759537?auto=format&fit=crop&w=200&q=80"]
  },
  {
    "id": 102,
    "title": "Wireless Noise-Cancelling Headphones",
    "price": 299,
    "description": "Experience immersive sound with our latest active noise-cancelling technology.",
    "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80"]
  },
  {
    "id": 103,
    "title": "Minimalist Ceramic Coffee Mug",
    "price": 15,
    "description": "Handcrafted ceramic mug with a matte finish, perfect for your morning brew.",
    "images": ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=200&q=80"]
  },
  {
    "id": 104,
    "title": "Ergonomic Mechanical Keyboard",
    "price": 85,
    "description": "Tactile switches and customizable RGB lighting for the ultimate typing experience.",
    "images": ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=200&q=80"]
  },
  {
    "id": 105,
    "title": "Sustainable Bamboo Sunglasses",
    "price": 45,
    "description": "Eco-friendly sunglasses with polarized lenses and lightweight bamboo frames.",
    "images": ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=200&q=80"]
  }
];

let filteredProducts = [...productsData];
let currentPage = 1;
let itemsPerPage = 5;

window.onload = () => { renderTable(); };

function renderTable() {
    const body = document.getElementById('product-body');
    if (!body) return;
    body.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filteredProducts.slice(start, end);

    paginatedItems.forEach((prod) => {
        // CƠ CHẾ DỰ PHÒNG: Nếu ảnh chính lỗi, dùng ảnh từ Picsum (rất ổn định)
        const fallbackImg = `https://picsum.photos/seed/${prod.id}/200`;
        const displayImg = (prod.images && prod.images[0]) ? prod.images[0] : fallbackImg;

        body.innerHTML += `
            <tr>
                <td>${prod.id}</td>
                <td>
                    <img src="${displayImg}" 
                         class="prod-img" 
                         onerror="this.onerror=null;this.src='${fallbackImg}';" 
                         alt="product">
                </td>
                <td>${prod.title}</td>
                <td><strong>${prod.price}</strong></td>
                <td>${prod.description.substring(0, 80)}...</td>
            </tr>
        `;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
    document.getElementById('pageInfo').innerText = `Trang ${currentPage} / ${totalPages}`;
}

// Giữ nguyên các hàm handleSearch, handleSort, handlePageSizeChange, changePage như cũ
function handleSearch() {
    const keyword = document.getElementById('searchTitle').value.toLowerCase();
    filteredProducts = productsData.filter(p => p.title.toLowerCase().includes(keyword));
    currentPage = 1;
    renderTable();
}

function handleSort() {
    const option = document.getElementById('sortOption').value;
    if (option === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price);
    else if (option === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);
    else if (option === 'name-asc') filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    else if (option === 'name-desc') filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
    renderTable();
}

function handlePageSizeChange() {
    itemsPerPage = parseInt(document.getElementById('pageSize').value);
    currentPage = 1;
    renderTable();
}

function changePage(step) {
    const maxPage = Math.ceil(filteredProducts.length / itemsPerPage);
    const newPage = currentPage + step;
    if (newPage >= 1 && newPage <= maxPage) {
        currentPage = newPage;
        renderTable();
    }
}