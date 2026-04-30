/**
 * Metadata form component.
 * Renders an add/edit form and fires a custom 'submit-metadata' event on valid submission.
 */

export class MetadataForm {
  /** @type {HTMLElement} */
  #root;
  /** @type {object|null} current record being edited, null for new */
  #editRecord = null;
  #onSubmit;

  /**
   * @param {HTMLElement} container
   * @param {(payload: object) => void} onSubmit
   */
  constructor(container, onSubmit) {
    this.#root = container;
    this.#onSubmit = onSubmit;
    this.#render();
  }

  /** Populate form fields to edit an existing record. */
  startEdit(record) {
    this.#editRecord = record;
    this.#render();
  }

  /** Reset form to create-new mode. */
  reset() {
    this.#editRecord = null;
    this.#render();
  }

  #render() {
    const r = this.#editRecord;
    this.#root.innerHTML = `
      <section class="card" aria-label="${r ? 'Edit metadata' : 'Add new metadata'}">
        <h2>${r ? 'Edit Metadata' : 'Add Image Metadata'}</h2>
        <div id="form-notice" role="alert" aria-live="polite"></div>
        <form id="metadata-form" novalidate>
          ${!r ? `
          <div class="form-group">
            <label for="field-path">File Path <span class="required" aria-hidden="true">*</span></label>
            <input id="field-path" name="filePath" type="text"
              placeholder="/home/user/Pictures/photo.jpg"
              aria-required="true" autocomplete="off" />
            <span class="field-error" id="err-path" aria-live="polite"></span>
          </div>` : `<p class="metadata-item__path" aria-label="File path">${this.#esc(r.filePath)}</p>`}

          <div class="form-group">
            <label for="field-title">Title <span class="required" aria-hidden="true">*</span></label>
            <input id="field-title" name="title" type="text"
              value="${this.#esc(r?.title ?? '')}"
              aria-required="true" autocomplete="off" />
            <span class="field-error" id="err-title" aria-live="polite"></span>
          </div>

          <div class="form-group">
            <label for="field-desc">Description</label>
            <textarea id="field-desc" name="description"
              aria-multiline="true">${this.#esc(r?.description ?? '')}</textarea>
          </div>

          <div class="form-group">
            <label for="field-tags">Tags <span style="color:var(--color-text-muted);font-weight:400">(comma-separated)</span></label>
            <input id="field-tags" name="tags" type="text"
              value="${this.#esc((r?.tags ?? []).join(', '))}"
              autocomplete="off" />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">${r ? 'Save Changes' : 'Add Metadata'}</button>
            ${r ? `<button type="button" id="btn-cancel" class="btn-secondary">Cancel</button>` : ''}
          </div>
        </form>
      </section>`;

    this.#root.querySelector('#metadata-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.#handleSubmit();
    });

    this.#root.querySelector('#btn-cancel')?.addEventListener('click', () => {
      this.reset();
    });
  }

  #handleSubmit() {
    const form = this.#root.querySelector('#metadata-form');
    const data = Object.fromEntries(new FormData(form));
    const errors = {};

    if (!this.#editRecord) {
      if (!data.filePath?.trim()) errors.path = 'File path is required';
    }
    if (!data.title?.trim()) errors.title = 'Title is required';

    // Display field errors
    this.#root.querySelector('#err-path')&& (this.#root.querySelector('#err-path').textContent = errors.path ?? '');
    this.#root.querySelector('#err-title').textContent = errors.title ?? '';

    if (Object.keys(errors).length) return;

    const tags = (data.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean);
    const payload = this.#editRecord
      ? { title: data.title.trim(), description: data.description?.trim() || null, tags }
      : { filePath: data.filePath.trim(), title: data.title.trim(), description: data.description?.trim() || null, tags };

    if (this.#editRecord) payload._id = this.#editRecord.id;

    this.#onSubmit(payload);
  }

  showError(message) {
    const n = this.#root.querySelector('#form-notice');
    if (n) { n.className = 'notice notice--error'; n.textContent = message; }
  }

  clearNotice() {
    const n = this.#root.querySelector('#form-notice');
    if (n) { n.className = ''; n.textContent = ''; }
  }

  #esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
