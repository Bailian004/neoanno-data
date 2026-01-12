const fs = require('fs');

const buildings = JSON.parse(fs.readFileSync('./anno1800/v2.0.1/buildings.json', 'utf8'));

const haciendaMappings = {
  "Hacienda Sugar Cane Farm": { sub: "cultivation_field", ui: "production" },
  "Hacienda Corn Farm": { sub: "cultivation_field", ui: "production" },
  "Hacienda Coffee Farm": { sub: "cultivation_field", ui: "production" },
  "Hacienda Caoutchouc Plantation": { sub: "cultivation_field", ui: "production" },
  "Hacienda Cocoa Farm": { sub: "cultivation_field", ui: "production" },
  "Hacienda Potato Farm": { sub: "cultivation_field", ui: "production" },
  "Hacienda Spice Farm": { sub: "cultivation_field", ui: "production" },
  "Hacienda Grain Farm": { sub: "cultivation_field", ui: "production" },
  "Hacienda Rum Distillery": { sub: "factory", ui: "production" },
  "Hacienda Beer Brewery": { sub: "factory", ui: "production" },
  "Hacienda Atole Maker": { sub: "factory", ui: "production" },
  "Hacienda Schnapps Distillery": { sub: "factory", ui: "production" },
  "Hacienda Hot Sauce Factory": { sub: "factory", ui: "production" },
  "Hacienda Fertiliser Works": { sub: "factory", ui: "production" },
};

buildings.forEach(b => {
  if (haciendaMappings[b.name]) {
    const mapping = haciendaMappings[b.name];
    b.sub_category = mapping.sub;
    b.ui_group = mapping.ui;
    console.log(`✅ Updated ${b.name}`);
  }
});

fs.writeFileSync('./anno1800/v2.0.1/buildings.json', JSON.stringify(buildings, null, 2));
console.log('Done!');
