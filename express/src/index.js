import express from "express"; 
import cors from "cors"
import usersR from "./routes/users.route.js";
import dotenv from "dotenv"
import sequelize from "./config/database.config.js";
// import  produits  from "./routes/produits.route.js";
import { exercice } from "./routes/exercice.route.js";
import { programme } from "./routes/programme.route.js";
import objectifs from "./data/model/objectifs.model.js";
import users from "./data/model/users.model.js";
import reservation from "./routes/reservation.routes.js";
import cookieParser from "cookie-parser";

import produitRoutes from "./routes/produit.routes.js";
import categorie from "./routes/categorie.route.js";
import router from "./routes/superadmin.route.js";
import dashboard from "./routes/dashboard.route.js";
import commande from "./routes/commande.route.js";


const app = express();
dotenv.config();


app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use(express.json({ limit: '50mb' }));  // ← Pour les JSON
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // ← Pour les formulaires

app.use("/auth", usersR);
app.use("/reservation",reservation)
app.use("/user", usersR)
app.use("/produits", produitRoutes)
app.use("/categorie", categorie)
app.use("/exercice", exercice)
app.use("/programme",programme)
app.use("/superAdmin",router)
app.use("/dashboard", dashboard)
app.use("/commandes", commande)

app.get("/",(req, res)=>{
    res.json({"message":"Io izy ary de aona"})
});



(async ()=>{
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        let PORT = process.env.PORT || 5000;

        app.listen(PORT, ()=>{
            console.log(`Tsindrina raha hiasa http://localhost:${PORT}`);
        })
    }catch (error){
        console.log("Misy olana eo @ fifandraisaina", error);
        process.exit();
        
    }
})();
