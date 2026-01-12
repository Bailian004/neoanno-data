const fs = require('fs');

const buildings = JSON.parse(fs.readFileSync('./anno1800/v2.0.1/buildings.json', 'utf8'));

let updated = 0;

buildings.forEach(b => {
  if (b.type === 'residence') {
    if (b.ui_group !== 'residences') {
      b.ui_group = 'residences';
      b.category = 'residence';
      if (!b.sub_category) {
        b.sub_category = 'residence';
      }
      updated++;
      console.log(`✅ Updated ${b.name}`);
    }
  }
});

fs.writeFileSync('./anno1800/v2.0.1/buildings.json', JSON.stringify(buildings, null, 2));
console.log(`\nTotal updated: ${updated}`);
