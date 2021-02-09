import { MongoHelper } from "../infra/db/mongodb/helper/mongo-helper";
import env from "./config/env";

const _getConnectionMongoDB = (): string => {
  const { dialect, username, password, domain, namedb } = env.mongodb
  let connectionMongoDB = dialect
  connectionMongoDB += username + ':' + password + '@'
  connectionMongoDB += domain
  connectionMongoDB += namedb
  return connectionMongoDB
}

const _getOptionsMongoDB = (): Object => {
  const optionsMongoDB = env.mongodb.options
  return optionsMongoDB
}

MongoHelper.connect(_getConnectionMongoDB(), _getOptionsMongoDB()).then(async () => {
  const app = (await import("./config/app")).default
  app.listen(env.port, () => console.log(`Server running at http//localhost:${env.port}`))
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("An error has occured ", err))
