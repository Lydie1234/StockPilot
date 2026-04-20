// Import Bootstrap JS and template behavior modules.
import '../bootstrap';
import * as bootstrap from 'bootstrap';
import './custom.js';
import './users-api.js';
import './stockpilot-api-wrapper.js';

// Bundle Tabler Icons locally to avoid runtime CDN/network blocking issues.
import '@tabler/icons-webfont/dist/tabler-icons.min.css';

// Import template SCSS bundle.
import '../../scss/template/style.scss';