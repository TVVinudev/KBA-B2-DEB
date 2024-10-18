import { Router, json } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const userRoute = Router();

userRoute.use(json());

const signupData = new Map();
const secretkey = "certiapp";

userRoute.post('/signup', async(req, res) => {
    try {
        const body = req.body;
        const { firstname, lastName, username, password, role } = body;
        if (signupData.has(username)) {
            console.log(`${username} is already exist !`);
            res.status(404).json({message:'user already exist!'})         
        }else{
            const newPassword = await bcrypt.hash(password,10);
            signupData.set(username,{firstname,lastName,password:newPassword,role});
            console.log("signupData : ",signupData);
            res.status(201).json({message : "account created"});
        }

    }catch(err){
        console.log(err)
    }
   
})


userRoute.post('/login',async(req,res)=>{
    try{
        const body = req.body;
        const { username,password} = body;

        if(signupData.has(username)){

            const data = signupData.get(username);

            const valid = await bcrypt.compare(password,data.password)
            console.log(valid)
            if(valid){
                const token = jwt.sign({UserName:username,UserRole:data.role},secretkey,{expiresIn:'1hr'});
                res.cookie("userToken",token,{httpOnly:true});
                res.status(200).json({message:" login Successfully "});
            }else{
                res.status(404).json({message:"incorrect password"})
            }
        }else{
            res.status(404).json({message:"user cannot found! Please check your userid "});
            console.log("404 : user cannot found!")
        }


    }catch(err){
        console.log(err)
    }
})



export { userRoute };