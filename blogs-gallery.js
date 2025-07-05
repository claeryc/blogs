let currentIndex = 0;
const postsPerPage = 5; // Only used on index (home) page
let allPosts = [];
let filteredPosts = [];

const container = document.getElementById("article-container") || document.getElementById("main-c");
const filterContainer = document.getElementById("filter-container");
const loadMoreButton = document.querySelector(".load-bp") || document.getElementById("load-more");

const isHomePage = document.body.id === 'home-page';
const isBlogPage = document.body.id === 'blog-page';

// Get unique topics
function getUniqueTopics(posts) {
  const topicsSet = new Set();
  posts.forEach(post => post.topic.forEach(t => topicsSet.add(t)));
  return Array.from(topicsSet);
}

// Render topic checkboxes
function renderTopicFilters(topics) {
  if (!filterContainer) return;

  filterContainer.innerHTML = '';
  topics.forEach(topic => {
    const label = document.createElement('label');
    label.style = 'display: inline-flex; align-items: center; gap: 5px;';

    label.innerHTML = `
      <input type="checkbox" value="${topic}" />
      <span style="margin-right: 10px">${topic}</span>
    `;

    filterContainer.appendChild(label);
  });
}

// Create article card (second JS style)
function createArticleCard(post, index) {
    const item = document.createElement("div");
    item.className = "item";
    if (index === 0 /*&& isHomePage*/) item.classList.add("item-1");
  
    const topicHTML = Array.isArray(post.topic)
      ? post.topic.map(t => `<span class="topic-badge">${t}</span>`).join(' ')
      : `<span class="topic-badge">${post.topic}</span>`;
  
    item.innerHTML = `
      <a href="${post.link}" class="card-bp" target="_blank">
        <div class="thumb" style="background-image: url('./images/${post.image}');"></div>
        <article>
          <h1>${post.title}</h1>
          ${post.description ? `<p>${post.description}</p>` : ""}
          <div class="topic-container">${topicHTML}</div>
        </article>
      </a>
    `;
    return item;
  }


// Display posts with applied limit
function displayPosts() {
  const end = isHomePage ? currentIndex + postsPerPage : filteredPosts.length;
  const postsToDisplay = filteredPosts.slice(currentIndex, end);

  postsToDisplay.forEach((post, index) => {
    const card = createArticleCard(post, currentIndex + index);
    container.appendChild(card);
  });

  currentIndex = end;

  if (isHomePage && loadMoreButton) {
    loadMoreButton.style.display = currentIndex >= filteredPosts.length ? 'none' : 'block';
  } else if (loadMoreButton) {
    loadMoreButton.style.display = 'none';
  }
}

// Apply topic filters
function applyFilters() {
  const checked = Array.from(filterContainer.querySelectorAll('input:checked')).map(input => input.value);

  filteredPosts = checked.length === 0
    ? [...allPosts]
    : allPosts.filter(post => post.topic.some(topic => checked.includes(topic)));

  container.innerHTML = '';
  currentIndex = 0;
  displayPosts();
}

// Load JSON data
fetch('articles.json') // Replace file name as needed (DB)
  .then(res => res.json())
  .then(data => {
    data.sort((a, b) => b.id - a.id); // Sort newest to oldest

    allPosts = data;
    filteredPosts = [...allPosts];

    renderTopicFilters(getUniqueTopics(allPosts));
    displayPosts();
  })
  .catch(err => console.error('Failed to load posts:', err));

// Events
if (document.getElementById('apply-filters')) {
  document.getElementById('apply-filters').addEventListener('click', applyFilters);
}

if (loadMoreButton) {
  loadMoreButton.addEventListener('click', displayPosts);
}