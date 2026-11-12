const initialPosts = [
  {
    id: 1,
    author: "Ana Gómez",
    role: "Desarrolladora Full Stack",
    time: "Hace 2 horas",
    content: "¡Hola a todos! Acabo de lanzar mi primer proyecto web desplegado en GitHub Pages.",
    likes: 12,
    liked: false,
    comments: ["¡Felicidades Ana!", "Excelente trabajo."]
  },
  {
    id: 2,
    author: "Carlos Ruiz",
    role: "Ingeniero de Datos",
    time: "Hace 5 horas",
    content: "Compartiendo algunos consejos sobre arquitectura de software limpia y escalable.",
    likes: 8,
    liked: false,
    comments: []
  }
];

let posts = JSON.parse(localStorage.getItem("linkup_posts")) || initialPosts;

function savePosts() {
  localStorage.setItem("linkup_posts", JSON.stringify(posts));
}

function renderPosts(filterText = "") {
  const feedList = document.getElementById("feed-list");
  feedList.innerHTML = "";

  const filtered = posts.filter(post =>
    post.content.toLowerCase().includes(filterText.toLowerCase()) ||
    post.author.toLowerCase().includes(filterText.toLowerCase())
  );

  filtered.forEach(post => {
    const commentsHTML = post.comments
      .map(c => `<div class="comment-item"><strong>Comentario:</strong> ${c}</div>`)
      .join("");

    const article = document.createElement("article");
    article.className = "card post-card";
    article.innerHTML = `
      <div class="post-header">
        <div class="avatar-sm">${post.author[0].toUpperCase()}</div>
        <div>
          <h4>${post.author}</h4>
          <span>${post.role} • ${post.time}</span>
        </div>
      </div>
      <p class="post-body">${post.content}</p>
      <div class="post-actions">
        <button type="button" class="btn-action ${post.liked ? "liked" : ""}" onclick="toggleLike(${post.id})">
          👍 Recomendar (<span>${post.likes}</span>)
        </button>
        <button type="button" class="btn-action" onclick="toggleComments(this)">
          💬 Comentar (${post.comments.length})
        </button>
      </div>
      <div class="comments-box hidden">
        <div class="comment-input-row">
          <input type="text" placeholder="Escribe un comentario...">
          <button type="button" onclick="addComment(${post.id}, this)">Enviar</button>
        </div>
        <div class="comments-list">${commentsHTML}</div>
      </div>
    `;
    feedList.appendChild(article);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPosts();

  const postInput = document.getElementById("post-input");
  const postForm = document.getElementById("post-form");
  const searchBar = document.getElementById("search-bar");

  postInput.addEventListener("focus", () => (postInput.rows = 3));
  postInput.addEventListener("blur", () => {
    if (!postInput.value.trim()) postInput.rows = 2;
  });

  postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = postInput.value.trim();
    if (!content) return;

    posts.unshift({
      id: Date.now(),
      author: "Usuario LinkUp",
      role: "Profesional en crecimiento",
      time: "Ahora mismo",
      content: content,
      likes: 0,
      liked: false,
      comments: []
    });

    savePosts();
    renderPosts(searchBar.value);
    postInput.value = "";
    postInput.rows = 2;
  });

  searchBar.addEventListener("input", (e) => {
    renderPosts(e.target.value);
  });
});

function toggleLike(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  savePosts();
  renderPosts(document.getElementById("search-bar").value);
}

function toggleComments(btn) {
  const commentsBox = btn.closest(".post-card").querySelector(".comments-box");
  commentsBox.classList.toggle("hidden");
}

function addComment(id, btn) {
  const input = btn.previousElementSibling;
  const text = input.value.trim();
  if (!text) return;

  const post = posts.find(p => p.id === id);
  if (post) {
    post.comments.push(text);
    savePosts();
    renderPosts(document.getElementById("search-bar").value);
  }
}