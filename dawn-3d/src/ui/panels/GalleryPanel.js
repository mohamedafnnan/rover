export function renderGallery(content) {
  const g = content.gallery;
  return `
    <p>Photographs from the season — captured on the shop floor and at the competition site.</p>
    <div class="gallery-grid">
      ${g.map(item => `
        <figure>
          <img loading="lazy" src="${item.src}" alt="${item.caption}">
          <figcaption>${item.caption}</figcaption>
        </figure>
      `).join('')}
    </div>
  `;
}
