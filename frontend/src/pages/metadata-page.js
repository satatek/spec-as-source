/**
 * Metadata page: orchestrates form, search, and list components.
 * All user story interactions flow through this controller.
 */

import { MetadataForm } from '../components/metadata-form.js';
import { MetadataList } from '../components/metadata-list.js';
import { MetadataSearch } from '../components/metadata-search.js';
import {
  listMetadata,
  createMetadata,
  updateMetadata,
  deleteMetadata,
} from '../services/api-client.js';

export class MetadataPage {
  #app;
  #form;
  #search;
  #list;
  #listContainer;
  #globalNotice;
  #query = '';

  /** @param {HTMLElement} app */
  constructor(app) {
    this.#app = app;
    this.#init();
  }

  #init() {
    this.#app.innerHTML = `
      <div id="global-notice" role="alert" aria-live="polite"></div>
      <div id="form-container"></div>
      <section class="card" aria-label="Saved metadata">
        <h2>Your Images</h2>
        <div id="search-container"></div>
        <div id="list-container"></div>
      </section>`;

    this.#globalNotice = this.#app.querySelector('#global-notice');
    this.#listContainer = this.#app.querySelector('#list-container');

    this.#form = new MetadataForm(
      this.#app.querySelector('#form-container'),
      (payload) => this.#handleFormSubmit(payload)
    );

    this.#search = new MetadataSearch(
      this.#app.querySelector('#search-container'),
      (q) => { this.#query = q; this.#loadList(); }
    );

    this.#list = new MetadataList(this.#listContainer, {
      onEdit: (record) => {
        this.#form.startEdit(record);
        this.#app.querySelector('#form-container').scrollIntoView({ behavior: 'smooth' });
      },
      onDelete: (id) => this.#handleDelete(id),
    });

    this.#loadList();
  }

  async #loadList() {
    this.#listContainer.setAttribute('aria-busy', 'true');
    try {
      const records = await listMetadata(this.#query || undefined);
      this.#list.render(records, this.#query);
    } catch (err) {
      this.#showGlobal('error', `Failed to load records: ${err.message}`);
    } finally {
      this.#listContainer.setAttribute('aria-busy', 'false');
    }
  }

  async #handleFormSubmit(payload) {
    this.#form.clearNotice();
    try {
      if (payload._id) {
        const { _id, ...rest } = payload;
        await updateMetadata(_id, rest);
        this.#form.reset();
        this.#showGlobal('success', 'Metadata updated.');
      } else {
        await createMetadata(payload);
        this.#form.reset();
        this.#showGlobal('success', 'Metadata saved.');
      }
      this.#loadList();
    } catch (err) {
      if (err.status === 409) {
        this.#form.showError('A record with this file path already exists.');
      } else if (err.status === 400) {
        this.#form.showError(err.message);
      } else {
        this.#form.showError(`Unexpected error: ${err.message}`);
      }
    }
  }

  async #handleDelete(id) {
    try {
      await deleteMetadata(id);
      this.#showGlobal('success', 'Entry deleted.');
      this.#loadList();
    } catch (err) {
      this.#showGlobal('error', `Delete failed: ${err.message}`);
    }
  }

  #showGlobal(type, message) {
    this.#globalNotice.className = `notice notice--${type}`;
    this.#globalNotice.textContent = message;
    setTimeout(() => { this.#globalNotice.className = ''; this.#globalNotice.textContent = ''; }, 4000);
  }
}
