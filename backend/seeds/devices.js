const MongoClient = require("mongodb").MongoClient;
const config = require("@nestjs/config")
config.ConfigModule.forRoot();
let seedDB = async () => {
    const uri = `mongodb://${process.env.MONGO_URI}`;
    const DEVICE_COLLECTION = 'devices';
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
    });
    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB);
        const devicesCollection = database.collection(DEVICE_COLLECTION);
        const collections = (await database.listCollections().toArray()).map(c => c.name);
        if (collections.includes(DEVICE_COLLECTION)){
            devicesCollection.drop();
        }
        let devices = [];
        for(let i=0;i<300;i++){
            devices.push({ uid: i+1, vendor: `vendor #${i+1}`,createdAt: new Date(), status: 'online',gateway: null })
        }
        await devicesCollection
            .insertMany(devices);
            client.close();
            console.log(`${DEVICE_COLLECTION} seeded`);
    } catch (error) {
        console.log("error: ",error)
    }
}
seedDB();