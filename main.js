//socket.send(msg);
//

const WebSocket = require('ws');
const Database = require("easy-json-database");

const db_users = new Database("/root/Ares/users.json", {});
const db_full = new Database("/root/Ares/full.json", {});

const server = new WebSocket.Server({
  port: 5000
});

console.log(`\x1b[35mServer running\x1b[0m`)

var date = new Date();

let sockets = [];
server.on('connection', function(socket) {
  sockets.push(socket);
  console.log("client connected")

  // When you receive a message, send that message to every socket.
  socket.on('message', function(msg) {

    var msg = msg.toString();

    console.log("Received message: " + msg);



   if ((msg).startsWith("reg")) {
        console.log("nová registrace")
        var reg_name = msg.split("$")[1];
        var password = msg.split("$")[2];
        if (db_users.has(reg_name) === true) {
            console.log("err"); socket.send("err");
        }
        else {
            var datum = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
            db_users.set(reg_name, [
                `${password}`,
                `${reg_name}`,
                `${datum}`,
                "0",
                "0"
            ]
            )
            console.log("suc"); socket.send("suc");
        }
   }



   if ((msg).startsWith("log")) {
        console.log("uživatel se chce přihlásit!");
        var login_name = msg.split("$")[1];
        var password = msg.split("$")[2];
        if (db_users.has(login_name) === true) {
            if (password === db_users.get(login_name)[0]) {
                console.log("suc")
                socket.send("suc");
            }
            else { console.log("err"); socket.send("err");}
        }
        else { console.log("err"); socket.send("err");}
   }



   if (msg.startsWith("new")) {
     console.log("novej status");
     var name = msg.split("$")[1];
     var password = msg.split("$")[2];
     var status = msg.split("$")[3];

     if (db_users.has(name) === true) {
        if (password === db_users.get(name)[0]) {

          var datum = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();

         db_full.set(`${db_full.get("count")+1}`, [
            `${status}`,
            `${name}`,
            `${datum}`,
            "0",
            "0",
            "0"
          ]);

          db_full.set("count", (db_full.get("count"))+1);

          var array = db_users.get(name); //pocet_tweetu
          array[4] = array[4]+1;
          db_users.set(name, array);
          
          var text =  db_full.get(`${(db_full.get("count")-(4))+0}`)
          var mes1 = `snd$${parseInt((db_full.get("count")-(4))+0)}$${text[1]}$${text[0]}$${text[2]}$${text[3]}$${text[4]}$${text[5]}`
          text =  db_full.get(`${(db_full.get("count")-(4))+1}`)
          var mes2 = `snd$${parseInt((db_full.get("count")-(4))+1)}$${text[1]}$${text[0]}$${text[2]}$${text[3]}$${text[4]}$${text[5]}`
          text =  db_full.get(`${(db_full.get("count")-(4))+2}`)
          var mes3 = `snd$${parseInt((db_full.get("count")-(4))+2)}$${text[1]}$${text[0]}$${text[2]}$${text[3]}$${text[4]}$${text[5]}`
          text =  db_full.get(`${(db_full.get("count")-(4))+3}`)
          var mes4 = `snd$${parseInt((db_full.get("count")-(4))+3)}$${text[1]}$${text[0]}$${text[2]}$${text[3]}$${text[4]}$${text[5]}`
          text =  db_full.get(`${(db_full.get("count")-(4))+4}`)
          var mes5 = `snd$${parseInt((db_full.get("count")-(4))+4)}$${text[1]}$${text[0]}$${text[2]}$${text[3]}$${text[4]}$${text[5]}`

          sockets.forEach(s => s.send(mes1));
          sockets.forEach(s => s.send(mes2));
          sockets.forEach(s => s.send(mes3));
          sockets.forEach(s => s.send(mes4));
          sockets.forEach(s => s.send(mes5));

          console.log("suc sended message");
        }
        else { console.log("err"); socket.send("err");}
     }
     else { console.log("err"); socket.send("err");}
    }

   if (msg.startsWith("req")) {
    console.log("request o statusy");
    try {
      var pocet = msg.split("$")[1];

      for (var i = 0; i < 5; i++) {
        var text =  db_full.get(`${(db_full.get("count")-(4*pocet))+i}`)
        console.log(text);
        var id_tweetu = parseInt((db_full.get("count")-(4*pocet))+i)
        console.log(id_tweetu);
        socket.send(`snd$${id_tweetu}$${text[1]}$${text[0]}$${text[2]}$${text[3]}$${text[4]}$${text[5]}`);
      }
    }
    catch {

    }

   }


   if (msg.startsWith("rqprf")) {
     console.log("request of profile")
     var username = msg.split("$")[1];

     if (db_users.has(username) === true) {
        console.log(`prf$${db_users.get(username)[1]}$${db_users.get(username)[2]}$${db_users.get(username)[3]}$${db_users.get(username)[4]}`);
        socket.send(`prf$${db_users.get(username)[1]}$${db_users.get(username)[2]}$${db_users.get(username)[3]}$${db_users.get(username)[4]}`);
     }
     else {console.log("err"); socket.send("err");}
   }


  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function() {
    sockets = sockets.filter(s => s !== socket);
    console.log("client disconnected")
  });

 /* socket.on('open', function open() {
    sockets.forEach(s => s.send(msg));
  });*/
});