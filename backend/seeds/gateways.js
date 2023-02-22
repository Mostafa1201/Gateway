const MongoClient = require("mongodb").MongoClient;
const config = require("@nestjs/config")
config.ConfigModule.forRoot();
let seedDB = async () => {
    const uri = `mongodb://${process.env.MONGO_URI}`;
    const name = "gateways";
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
    });
    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB);
        const gatewayCollection = database.collection("gateways");
        const collections = (await database.listCollections().toArray()).map(c => c.name);
        if (collections.includes(name)){
            gatewayCollection.drop();
        }
        let gateways = [];
        for(let i=0;i<45;i++){
            gateways.push({name: `Gateway ${i+1}`,ipv4: `192.0.${i+1}.${i+150}`})
        }
        await gatewayCollection
            .insertMany(gateways);
            client.close();
            console.log(`${name} seeded`);
    } catch (error) {
        console.log("error: ",error)
    }
}
seedDB();