import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect(uri: string, options: Object) {
    this.uri = uri
    this.client = await MongoClient.connect(uri, options)
  },

  async disconnect() {
    await this.client.close()
  },

  async getCollection(name: string): Promise<Collection> {
    if (this.client?.isConnected())
      await this.connect(this.uri)

    return this.client.db().collection(name)
  },

  map(collection: any): any {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id })
  }
}