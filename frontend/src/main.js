import { MetadataPage } from './pages/metadata-page.js';

const app = document.getElementById('app');
if (!app) throw new Error('#app mount element not found');

new MetadataPage(app);
