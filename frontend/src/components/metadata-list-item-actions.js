/**
 * Metadata list item actions component.
 * Renders Edit and Delete buttons with accessible labels and wires event handlers.
 * Used by MetadataList to render per-item action controls.
 */

/**
 * @param {object} record - metadata record with { id, title }
 * @param {{ onEdit: () => void, onDelete: () => void }} callbacks
 * @returns {HTMLDivElement}
 */
export function createItemActions(record, { onEdit, onDelete }) {
  const div = document.createElement('div');
  div.className = 'metadata-item__actions';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn-secondary btn-sm';
  editBtn.setAttribute('aria-label', `Edit ${record.title}`);
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', onEdit);

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn-danger btn-sm';
  deleteBtn.setAttribute('aria-label', `Delete ${record.title}`);
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    if (confirm(`Delete "${record.title}"? This cannot be undone.`)) {
      onDelete();
    }
  });

  div.append(editBtn, deleteBtn);
  return div;
}
