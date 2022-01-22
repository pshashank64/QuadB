const express = require("express");
const path = require("path");
const port = 3000;
const https = require("https");

const db = require("./config/mongoose");
const Crypto = require("./models/crypto");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded());
app.use(express.static("assets"));


app.get("/", (req, res) => {
    let url = "https://api.wazirx.com/api/v2/tickers";

    https.get(url,(ress) => {
        let body = "";

        ress.on("data", (chunk) => {
            body += chunk;
        });

        ress.on("end", () => {
            try {
                let json = JSON.parse(body);
                for(let index = 0; index < 10; index++){
                    // console.log(Object.keys(json)[index]);
                    let var1 = Object.keys(json)[index];
                    Crypto.findOne({}, (err, crypto) => {
                        if(err){console.log(err); return;}
                        
                        Crypto.create(
                            {
                                name: json[var1]["name"],
                                last: json[var1]["last"],
                                buy: json[var1]["buy"],
                                sell: json[var1]["sell"],
                                volume: json[var1]["volume"],
                                base_unit: json[var1]["base_unit"]
                            }
                        );
                        // console.log("data created to the db!");                            
                        
                           
                    })                      
                }                
            } catch (error) {
                console.error(error.message);
            };
        });

    }).on("error", (error) => {
        console.error(error.message);
    });

    Crypto.find({}, (err, crypto) => {
        if(err){console.log(err); return;}
        else{
            return res.render("home", {
                title: "Hodlinfo",
                crypto: crypto
            });
        }
    }).sort("-createdAt").limit(10);

    // res.end();
});


app.listen(port, (err) => {
    if(err){
        console.log("error in going live!", err);
    }
    console.log("Server is live!");
})