const { Client, Location, Poll, List, Buttons, LocalAuth } = require('whatsapp-web.js');
const { MongoClient, ServerApiVersion } = require('mongodb');

const banco_mongo="[banco]";
const nome_grupo = "[corredores]";
const celular_admin = "[55..]";
const uri_mongo = "[mongodb+srv..]";

const clientmb = new MongoClient(uri_mongo, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function geraRank(client,quem) {


    try {
      // Connect the client to the server	(optional starting in v4.7)
      
await clientmb.connect();
const myDB = clientmb.db(banco_mongo);
const myColl = myDB.collection("rank");
//const cursor3 = myColl.find();
const birthday = new Date();
periodo  = (birthday.getMonth()+1).toString()+"-"+birthday.getFullYear().toString();
if(periodo.length<7)
    periodo="0"+periodo;
const cursor3 = myColl.aggregate([
    { $match : {"mes": periodo}},
    {$group: {
        _id: "$nome",  
        soma: { $sum: "$total" },  
    }},
    
]).sort({"soma":-1});


//totcursor = (await cursor3.toArray()).length
const meta = myDB.collection("meta");
metames = await meta.findOne({"mes":periodo})
//console.log(await metames);

msg = "Desafio do mês *"+nome_grupo+" - "+periodo+": META "+metames['meta']+" KM* 🚀💪🏃‍♂🏃‍♀ \n\n";
//console.log((await cursor3.toArray()).length)
cont=1
for await ( const myDoc of  cursor3 ) {
    //console.log( "User name: " + myDoc.corredor )
    msg=msg+cont.toString()+" - "+myDoc._id+ ": *"+myDoc.soma+" km*";
    if(parseInt(myDoc.soma)>=parseInt(metames['meta']))
        msg=msg+"✅";
    msg=msg+"\n"
    cont++;
 }

if(client!=null)
    client.sendMessage(quem,msg); 

          
     
      
     
    } finally {
      // Ensures that the client will close when you finish/error
      await clientmb.close();
    }
  }


const client = new Client({
    authStrategy: new LocalAuth(),
    // proxyAuthentication: { username: 'username', password: 'password' },
    puppeteer: { 
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        headless: false,
    }
});


// client initialize does not finish at ready now.
client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

// Pairing code only needs to be requested once
let pairingCodeRequested = false;
client.on('qr', async (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);

    // paiuting code example
    const pairingCodeEnabled = false;
    if (pairingCodeEnabled && !pairingCodeRequested) {
        const pairingCode = await client.requestPairingCode('96170100100'); // enter the target phone number
        console.log('Pairing code enabled, code: '+ pairingCode);
        pairingCodeRequested = true;
    }
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', async () => {
    console.log('READY');
    const debugWWebVersion = await client.getWWebVersion();
    console.log(`WWebVersion = ${debugWWebVersion}`);

    client.pupPage.on('pageerror', function(err) {
        console.log('Page error: ' + err.toString());
    });
    client.pupPage.on('error', function(err) {
        console.log('Page error: ' + err.toString());
    });
    
});

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

   
    try{
        if(msg.author.startsWith(celular_admin))
        {    
        console.log('é o admin');
        console.log(msg);
        await clientmb.connect();
            
                
            const myDB = clientmb.db(banco_mongo);
            if (msg.body.startsWith('#ok')) {
            
                dados = msg.body.split(" ");
        
            
                const myColl = myDB.collection("rank");
                
                //
                //console.log('ABAIXO MSG')
                //console.log(msg);


                const cursor3 = myColl.find({"corredor":msg._data.quotedParticipant}).limit(1);
                nomecorredor = ""
                for await ( const myDoc of  cursor3 ) {
                    nomecorredor=myDoc.nome;
                }
                const birthday = new Date();
                periodo  = (birthday.getMonth()+1).toString()+"-"+birthday.getFullYear().toString();
                if(periodo.length<7)
                    periodo="0"+periodo;

                volta = myColl.insertOne({"total":parseInt(dados[1]),"corredor":msg._data.quotedParticipant,"nome":nomecorredor,"mes":periodo})
                
            
        
            } else if(msg.body.startsWith('#n')) { 
        
                dados = msg.body.split(" ");
        
                const myColl2 = myDB.collection("rank");
                
                //
                console.log('ABAIXO MSG')
                //console.log(msg);
                
                volta = myColl2.updateMany({"corredor":msg._data.quotedParticipant},{"$set":{"nome":dados[1]}})
                
            } else if (msg.body.startsWith('#rank')) {
                
                //console.log(msg);
                //return 0;
                geraRank(client,msg.from); 
            
        
            }else if(msg.body.startsWith('#meta')) { 
        
                dados = msg.body.split(" ");
        
                const myColl2 = myDB.collection("meta");
                
                //
                //console.log('ABAIXO MSG')
                //console.log(msg);
                
                volta = myColl2.updateMany({"meta":dados[1]},{"$set":{"meta":parseInt(dados[2])}})
                
            } 
        }
    }catch(e)
    {
        console.log('nao tinha author');
    }
            
    
});
client.on('message_create', async (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
        //console.log('')
        await clientmb.connect();
        const myDB = clientmb.db(banco_mongo);
        if (msg.body.startsWith('#ok')) {
        
            dados = msg.body.split(" ");
    
          
            const myColl = myDB.collection("rank");
            
            //
           // console.log('ABAIXO MSG')
            //console.log(msg);


            const cursor3 = myColl.find({"corredor":msg._data.quotedParticipant}).limit(1);
            nomecorredor = ""
            for await ( const myDoc of  cursor3 ) {
                nomecorredor=myDoc.nome;
            }
            const birthday = new Date();
            periodo  = (birthday.getMonth()+1).toString()+"-"+birthday.getFullYear().toString();
            if(periodo.length<7)
                periodo="0"+periodo;

            volta = myColl.insertOne({"total":parseInt(dados[1]),"corredor":msg._data.quotedParticipant,"nome":nomecorredor,"mes":periodo})
            
           
    
        } else if(msg.body.startsWith('#n')) { 
    
            dados = msg.body.split(" ");
    
            const myColl2 = myDB.collection("rank");
            
            //
            //console.log('ABAIXO MSG')
            //console.log(msg);
            
            volta = myColl2.updateMany({"corredor":msg._data.quotedParticipant},{"$set":{"nome":dados[1]}})
            
           } else if (msg.body.startsWith('#rank')) {
            
            
            geraRank(client,msg.to); 
            
    
        }else if(msg.body.startsWith('#meta')) { 
    
            dados = msg.body.split(" ");
    
            const myColl2 = myDB.collection("meta");
            
           
            
            volta = myColl2.updateMany({"mes":dados[1]},{"$set":{"meta":parseInt(dados[2])}})
            
           } 
        // do stuff here
    }

    // Unpins a message
});

client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if (ack == 3) {
        // The message was read
    }
});
