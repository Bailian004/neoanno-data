const fs = require('fs');

const buildings = JSON.parse(fs.readFileSync('./anno1800/v2.0.1/buildings.json', 'utf8'));

let updated = 0;

buildings.forEach(b => {
  // Production buildings (factories that aren't already categorized)
  if (b.type === 'factory' && (!b.ui_group || b.ui_group === 'decorative')) {
    // Skip if it's a linked cultivation building (already has ui_group: production)
    if (b.ui_group !== 'production') {
      b.ui_group = 'production';
      updated++;
      console.log(`✅ Production: ${b.name}`);
    }
  }
  
  // Service buildings
  if (b.type === 'service' && (!b.ui_group || b.ui_group === 'decorative')) {
    if (b.ui_group !== 'public') {
      b.ui_group = 'public';
      b.category = 'service';
      if (!b.sub_category) b.sub_category = 'service';
      updated++;
      console.log(`✅ Service: ${b.name}`);
    }
  }
});

fs.writeFileSync('./anno1800/v2.0.1/buildings.json', JSON.stringify(buildings, null, 2));
console.log(`\nTotal updated: ${updated}`);
