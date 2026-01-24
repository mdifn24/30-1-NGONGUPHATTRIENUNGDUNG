const API_URL = 'http://localhost:3000';

// Khởi chạy khi trang load xong
window.onload = () => {
    LoadData();
};

async function LoadData() {
    await LoadPosts();
    await LoadComments();
}

// --- HELPER FUNCTION: AUTO ID (MAX ID + 1) ---
// Hàm này dùng chung cho cả Posts và Comments
async function getNextId(resource) {
    try {
        let res = await fetch(`${API_URL}/${resource}`);
        let items = await res.json();
        
        let maxId = 0;
        items.forEach(item => {
            // Chuyển ID sang số nguyên để so sánh toán học
            let currentId = parseInt(item.id);
            if (!isNaN(currentId) && currentId > maxId) {
                maxId = currentId;
            }
        });
        // Trả về chuỗi (String) theo yêu cầu của json-server
        return (maxId + 1).toString();
    } catch (error) {
        console.error("Error calculating ID:", error);
        return "1"; // Giá trị mặc định nếu lỗi
    }
}

// ==========================================
//              POSTS LOGIC
// ==========================================

async function LoadPosts() {
    try {
        let res = await fetch(`${API_URL}/posts`);
        let posts = await res.json();
        let body = document.getElementById('post-body');
        body.innerHTML = "";
        
        for (const post of posts) {
            body.innerHTML += convertPostToHTML(post);
        }
    } catch (error) { console.error(error); }
}

function convertPostToHTML(post) {
    // Kiểm tra cờ xoá mềm
    const isDeleted = post.isDeleted === true;
    
    // Nếu đã xoá: Thêm class gạch ngang, Disable nút bấm
    const rowClass = isDeleted ? 'deleted-row' : '';
    const btnState = isDeleted ? 'disabled' : ''; 
    
    return `<tr class="${rowClass}">
        <td>${post.id}</td>
        <td>${post.title}</td>
        <td>${post.views}</td>
        <td>
            <button class="btn-edit" onclick="EditPost('${post.id}', '${post.title}', '${post.views}')" ${btnState}>Edit</button>
            <button class="btn-delete" onclick="SoftDeletePost('${post.id}')" ${btnState}>Delete</button>
        </td>
    </tr>`;
}

// 1. Hàm chuẩn bị form để Sửa (Update Mode)
function EditPost(id, title, views) {
    // Đổ dữ liệu cũ vào input
    document.getElementById("post_id_txt").value = id; // ID vào ô ẩn
    document.getElementById("post_title_txt").value = title;
    document.getElementById("post_views_txt").value = views;

    // Đổi giao diện nút bấm
    let saveBtn = document.getElementById("post_save_btn");
    saveBtn.innerText = "Update Post";
    saveBtn.style.backgroundColor = "#2196F3"; // Màu xanh dương báo hiệu Update

    // Hiện nút Cancel
    document.getElementById("post_cancel_btn").classList.remove("hidden");
}

// 2. Hàm Reset form về chế độ Thêm mới (Create Mode)
function ResetPostForm() {
    document.getElementById("post_id_txt").value = ""; // Xoá ID ẩn
    document.getElementById("post_title_txt").value = "";
    document.getElementById("post_views_txt").value = "";

    // Trả lại giao diện nút bấm
    let saveBtn = document.getElementById("post_save_btn");
    saveBtn.innerText = "Add Post";
    saveBtn.style.backgroundColor = ""; // Về màu mặc định (xanh lá)

    // Ẩn nút Cancel
    document.getElementById("post_cancel_btn").classList.add("hidden");
}

// 3. Hàm Lưu chính (Xử lý cả Thêm mới và Cập nhật)
async function SavePost() {
    let id = document.getElementById("post_id_txt").value; // Lấy ID từ ô ẩn
    let title = document.getElementById("post_title_txt").value;
    let views = document.getElementById('post_views_txt').value;

    // Validate cơ bản
    if (!title) { alert("Please enter title!"); return; }

    if (!id) {
        // === TRƯỜNG HỢP: TẠO MỚI (CREATE) ===
        // ID rỗng -> Tự sinh ID mới
        let newId = await getNextId('posts');
        await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: newId, 
                title: title, 
                views: views, 
                isDeleted: false // Mặc định chưa xoá
            })
        });
    } else {
        // === TRƯỜNG HỢP: CẬP NHẬT (UPDATE) ===
        // ID có giá trị -> Dùng PATCH để sửa
        await fetch(`${API_URL}/posts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: title, 
                views: views 
            })
        });
    }
    
    ResetPostForm(); // Reset form sau khi lưu
    LoadPosts();     // Load lại bảng
}

// 4. Hàm Xoá Mềm
async function SoftDeletePost(id) {
    if(!confirm("Are you sure you want to delete this post?")) return;
    
    await fetch(`${API_URL}/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true }) // Đánh dấu đã xoá
    });
    
    LoadPosts();
}


// ==========================================
//              COMMENTS LOGIC
// ==========================================
// (Logic tương tự hoàn toàn với Posts)

async function LoadComments() {
    try {
        let res = await fetch(`${API_URL}/comments`);
        let comments = await res.json();
        let body = document.getElementById('comment-body');
        body.innerHTML = "";
        
        for (const cmt of comments) {
            body.innerHTML += convertCommentToHTML(cmt);
        }
    } catch (error) { console.error(error); }
}

function convertCommentToHTML(cmt) {
    const isDeleted = cmt.isDeleted === true;
    const rowClass = isDeleted ? 'deleted-row' : '';
    const btnState = isDeleted ? 'disabled' : '';

    return `<tr class="${rowClass}">
        <td>${cmt.id}</td>
        <td>${cmt.text}</td>
        <td>${cmt.postId}</td>
        <td>
            <button class="btn-edit" onclick="EditComment('${cmt.id}', '${cmt.text}', '${cmt.postId}')" ${btnState}>Edit</button>
            <button class="btn-delete" onclick="SoftDeleteComment('${cmt.id}')" ${btnState}>Delete</button>
        </td>
    </tr>`;
}

function EditComment(id, text, postId) {
    document.getElementById("cmt_id_txt").value = id;
    document.getElementById("cmt_text_txt").value = text;
    document.getElementById("cmt_postid_txt").value = postId;

    let saveBtn = document.getElementById("cmt_save_btn");
    saveBtn.innerText = "Update Comment";
    saveBtn.style.backgroundColor = "#2196F3";

    document.getElementById("cmt_cancel_btn").classList.remove("hidden");
}

function ResetCommentForm() {
    document.getElementById("cmt_id_txt").value = "";
    document.getElementById("cmt_text_txt").value = "";
    document.getElementById("cmt_postid_txt").value = "";

    let saveBtn = document.getElementById("cmt_save_btn");
    saveBtn.innerText = "Add Comment";
    saveBtn.style.backgroundColor = "";

    document.getElementById("cmt_cancel_btn").classList.add("hidden");
}

async function SaveComment() {
    let id = document.getElementById("cmt_id_txt").value;
    let text = document.getElementById("cmt_text_txt").value;
    let postId = document.getElementById("cmt_postid_txt").value;

    if (!text) { alert("Please enter comment text!"); return; }

    if (!id) {
        // Create
        let newId = await getNextId('comments');
        await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: newId, 
                text: text, 
                postId: postId, 
                isDeleted: false 
            })
        });
    } else {
        // Update
        await fetch(`${API_URL}/comments/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: text, 
                postId: postId 
            })
        });
    }
    
    ResetCommentForm();
    LoadComments();
}

async function SoftDeleteComment(id) {
    if(!confirm("Delete this comment?")) return;
    
    await fetch(`${API_URL}/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true })
    });
    
    LoadComments();
}