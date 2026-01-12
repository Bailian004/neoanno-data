const fs = require('fs');

const buildings = JSON.parse(fs.readFileSync('./anno1800/v2.0.1/buildings.json', 'utf8'));

let updated = 0;

buildings.forEach(b => {
  if (b.name && (b.name.includes('House') || b.name.includes('Residence') || b.name.includes('Tenement') || b.name.includes('Cottage'))) {
    if (b.ui_group === 'decorative') {
      b.category = 'residence';
      b.ui_group = 'residences';
      b.sub_category = 'residence';
      updated++;
      console.log(`✅ Updated ${b.name}`);
    }
  }
});

fs.writeFileSync('./anno1800/v2.0.1/buildings.json', JSON.stringify(buildings, null, 2));
console.log(`\nTotal updated: ${updated}`);
