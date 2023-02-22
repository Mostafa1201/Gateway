const MongoClient = require("mongodb").MongoClient;
const config = require("@nestjs/config")
config.ConfigModule.forRoot();

let seedDB = async () => {
    const uri = `mongodb://${process.env.MONGO_URI}`;
    const DEVICE_COLLECTION = 'devices';
    const GATEWAY_COLLECTION = 'gateways';
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
    });
    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB);
        const devicesCollection = database.collection(DEVICE_COLLECTION);
        const gatewaysCollection = database.collection(GATEWAY_COLLECTION);

        let devices = await devicesCollection.find().toArray();
        let gateways = await gatewaysCollection.find().toArray();
        let gatewaysCount = gateways.length - 1;
        
        for(let i=0;i<devices.length/2;i++){
            // Here i assign a random number (index) between 1 and the gateways count and then
            // use that random number to assign it to the device 
            let index = Math.floor(Math.random() * (gatewaysCount - 2)) + 1;
            await devicesCollection
            .updateOne({_id: devices[i]._id},{ $set:{ gateway: gateways[index]._id } });
        }
        client.close();
        console.log('Added devices to gateways');
    } catch (error) {
        console.log("error: ",error)
    }
}
seedDB();