const fs = require('fs');
const file = 'd:\\inka\\mahlukhidup\\frontend\\src\\pages\\UserManagement.tsx';
let content = fs.readFileSync(file, 'utf8');

// Background and borders
content = content.replace(/bg-\[#0b1730\]/g, 'bg-slate-50');
content = content.replace(/bg-\[#0d1f47\]/g, 'bg-white');
content = content.replace(/border-blue-800\/40/g, 'border-slate-200');
content = content.replace(/border-blue-800\/30/g, 'border-slate-200');
content = content.replace(/border-blue-900\/20/g, 'border-slate-200');
content = content.replace(/border-blue-900\/30/g, 'border-slate-200');
content = content.replace(/bg-blue-900\/20/g, 'bg-slate-100');
content = content.replace(/bg-blue-900\/30/g, 'bg-slate-100');
content = content.replace(/bg-blue-900\/40/g, 'bg-slate-200');
content = content.replace(/bg-slate-800\/50/g, 'bg-white');

// Text colors
content = content.replace(/text-white/g, 'text-slate-800');
content = content.replace(/text-slate-400/g, 'text-slate-500');
content = content.replace(/text-blue-400\/70/g, 'text-slate-500');

// Hover
content = content.replace(/hover:bg-blue-800\/30/g, 'hover:bg-slate-100');
content = content.replace(/bg-blue-800\/30/g, 'bg-slate-100');

fs.writeFileSync(file, content);
console.log('Processed', file);
