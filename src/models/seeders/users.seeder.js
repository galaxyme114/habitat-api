const mdSeed = require('mongoose-data-seed');
const User = require('../user.model');

const data = [
  {
    firstName: 'Morgan',
    lastName: 'Paki',
    email: 'morgan.p@applickable.io',
    role: 'super',
    password: 'morgan',
  },
  {
    firstName: 'V-Ken',
    lastName: 'Chin',
    email: 'ken.c@applickable.io',
    role: 'super',
    password: 'vken',
  },
  {
    firstName: 'Samuel',
    lastName: 'Warren',
    email: 'samuel.w@applickable.io',
    role: 'super',
    password: 'samuel',
  },
  {
    firstName: 'Administrator',
    lastName: 'Habitat',
    email: 'admin@thehabitat.io',
    role: 'admin',
    password: 'admin',
  },
  {
    firstName: 'User1',
    lastName: 'Habitat',
    email: 'user1@thehabitat.io',
    role: 'user',
    password: 'user1',
  },
  {
    firstName: 'User2',
    lastName: 'Habitat',
    email: 'user2@thehabitat.io',
    role: 'user',
    password: 'user2',
  },
];

class UsersSeeder extends mdSeed.Seeder {
  // eslint-disable-next-line class-methods-use-this
  async shouldRun() {
    return User.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  // eslint-disable-next-line class-methods-use-this
  async run() {
    User.schema.set('validateBeforeSave', false);
    return User.create(data);
  }
}

module.exports = UsersSeeder;
