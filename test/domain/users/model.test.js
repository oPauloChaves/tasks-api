import test from 'ava'
import mongoose from 'mongoose'
import {MongoDBServer} from 'mongomem'

import User from 'domain/users/model'

mongoose.Promise = Promise

test.before('start server', async t => {
  await MongoDBServer.start()
})

test.after.always('cleanup', t => {
  MongoDBServer.tearDown() // Cleans up temporary file storage
})

test.beforeEach(async t => {
  const db = new mongoose.Mongoose()
  await db.connect(await MongoDBServer.getConnectionString(), {useMongoClient: true})

  db.model('User', User.schema)

  t.context.db = db
})

test('it should find no users', async t => {
  const {db} = t.context
  const UserModel = db.model('User')

  const users = await UserModel.list()

  t.deepEqual(users, [])
})

test('it should create a user', async t => {
  const {db} = t.context
  const UserModel = db.model('User')

  const data = {
    email: 'bot1@test.com',
    password: '12345678',
    name: 'I am a bot'
  }

  const user = await new UserModel(data).save()

  t.is(data.email, user.email)
})
