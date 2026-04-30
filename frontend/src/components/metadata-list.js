/**
 * Metadata list component.
 * Renders a list of metadata records and fires 'edit' and 'delete' callbacks.
 */

export class MetadataList {
  #root;
  #onEdit;
  #onDelete;

  /**
   * @param {HTMLElement} container
   * @param {{ onEdit: (record: object) => void, onDelete: (id: number) => void }} callbacks
   */
  constructor(container, { onEdit, onDelete }) {
    this.#root = container;
    this.#onEdit = onEdit;
    this.#onDelete = onDelete;
  }

  /**
   * Re-render the list with the given records.
   * @param {object[]} records
   * @param {string} [query] active search query for context
   */
  render(records, query) {
    if (!records.length) {
      this.#root.innerHTML = `<p class="empty-state">${
        query ? 'No results match your search.' : 'No metadata entries yet. Add your first image above.'
      }</p>`;
      return;
    }

    this.#root.innerHTML = `<ul class="metadata-list" aria-label="Saved metadata entries">
      ${records.map((r) => this.#renderItem(r)).join('')}
    </ul>`;

    this.#root.querySelectorAll('[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.closest('[data-id]').dataset.id);
        this.#onEdit(records.find((r) => r.id === id));
      });
    });

    this.#root.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.closest('[data-id]').dataset.id);
        if (confirm('Delete this metadata entry?')) this.#onDelete(id);
      });
    });
  }

  #renderItem(r) {
    const tags = (r.tags ?? [])
      .map((t) => `<span class="tag">${this.#esc(t)}</span>`)
      .join('');

    return `<li class="metadata-item" data-id="${r.id}">
      <span class="metadata-item__title">${this.#esc(r.title)}</span>
      <span class="metadata-item__path" aria-label="File path">${this.#esc(r.filePath)}</span>
      ${r.description ? `<span class="metadata-item__desc">${this.#esc(r.description)}</span>` : ''}
      ${tags ? `<div class="tags" aria-label="Tags">${tags}</div>` : ''}
      <div class="metadata-item__actions">
        <button class="btn-secondary btn-sm" data-action="edit" aria-label="Edit ${this.#esc(r.title)}">Edit</button>
        <button class="btn-danger btn-sm" data-action="delete" aria-label="Delete ${this.#esc(r.title)}">Delete</button>
      </div>
    </li>`;
  }

  #esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
