/**
 * Search bar component.
 * Renders an input field and a clear button; calls onSearch with the query.
 */

export class MetadataSearch {
  #root;
  #onSearch;
  #input;

  /**
   * @param {HTMLElement} container
   * @param {(query: string) => void} onSearch
   */
  constructor(container, onSearch) {
    this.#root = container;
    this.#onSearch = onSearch;
    this.#render();
  }

  #render() {
    this.#root.innerHTML = `
      <div class="search-bar" role="search">
        <label for="metadata-search" class="sr-only">Search metadata</label>
        <input
          id="metadata-search"
          class="search-bar__input"
          type="search"
          placeholder="Search by title, description, tags, or file path…"
          aria-label="Search metadata"
          autocomplete="off"
        />
      </div>`;

    this.#input = this.#root.querySelector('#metadata-search');

    let debounce;
    this.#input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => this.#onSearch(this.#input.value.trim()), 250);
    });
  }

  /** Reset the search input and fire empty query. */
  clear() {
    this.#input.value = '';
    this.#onSearch('');
  }
}
