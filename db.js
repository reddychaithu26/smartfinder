// ============================================================
//  SmartFinder – Database Layer
//  db.js  –  JSON file-based database using lowdb
// ============================================================

const { Low }      = require('lowdb');
const { JSONFile }  = require('lowdb/node');
const path          = require('path');

const dbFile = path.join(__dirname, 'data', 'db.json');

// ensure data directory exists
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const adapter = new JSONFile(dbFile);
const db      = new Low(adapter, {
  users:   [],
  items:   [],
  helpers: [],
  claims:  [],
  nextId:  1
});

async function initDb() {
  await db.read();

  // seed default users if empty
  if (!db.data.users.length) {
    const bcrypt = require('bcryptjs');
    db.data.users.push({
      id:       1,
      name:     'Reddy Chaithu',
      roll:     '23881A05GM',
      email:    'chaithu@college.edu',
      password: bcrypt.hashSync('demo123', 10),
      createdAt: new Date().toISOString()
    });

    // seed sample items
    db.data.items.push(
      {
        id: 1, name: 'ID Card',
        desc: 'College ID card with blue lanyard tag',
        type: 'lost', reporterRoll: '23881A05GM',
        reporterName: 'Reddy Chaithu',
        images: [], resolved: false,
        date: new Date().toLocaleDateString('en-IN')
      },
      {
        id: 2, name: 'Skybag Backpack',
        desc: 'Navy blue Skybag with laptop compartment, galaxy print',
        type: 'found', reporterRoll: '23881A05GM',
        reporterName: 'Reddy Chaithu',
        images: [], resolved: false,
        date: new Date().toLocaleDateString('en-IN')
      },
      {
        id: 3, name: 'Spectacles',
        desc: 'Black rimmed glasses in brown case',
        type: 'lost', reporterRoll: 'OTHER',
        reporterName: 'Priya Sharma',
        images: [], resolved: false,
        date: new Date().toLocaleDateString('en-IN')
      }
    );

    db.data.helpers.push(
      {
        id: 1, item: 'Chain', reporterDesc: 'ykjdkfjdf',
        name: 'Riya', mobile: '9000000001',
        hostel: 'Near office', date: '7/12/2024, 5:51:54 pm'
      },
      {
        id: 2, item: 'Keys', reporterDesc: 'skdcnalkc',
        name: 'Arjun Mehta', mobile: '9876543210',
        hostel: 'Block B Room 102', date: '8/12/2024, 3:12:00 pm'
      }
    );

    db.data.nextId = 10;
    await db.write();
  }
}

module.exports = { db, initDb };
