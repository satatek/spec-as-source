-- Schema: Local Image Metadata Manager
-- All tables use TEXT ISO-8601 for timestamps

CREATE TABLE IF NOT EXISTS image_metadata (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  file_path   TEXT    NOT NULL UNIQUE,
  title       TEXT    NOT NULL,
  description TEXT,
  created_at  TEXT    NOT NULL,
  updated_at  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT    NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS image_metadata_tags (
  image_metadata_id INTEGER NOT NULL REFERENCES image_metadata(id) ON DELETE CASCADE,
  tag_id            INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (image_metadata_id, tag_id)
);

-- Indexes for efficient search
CREATE INDEX IF NOT EXISTS idx_image_metadata_title       ON image_metadata(title);
CREATE INDEX IF NOT EXISTS idx_image_metadata_updated_at  ON image_metadata(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_tags_name                   ON tags(name);
