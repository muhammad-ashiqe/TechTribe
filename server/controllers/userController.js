import User from "../model/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//user registration
const registerUser = async (req, res) => {
  try {
    const {name,email,password} = req.body;

    //checking user already exisit or not 
    let user =await User.findOne({email});

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10) ;
    const hashedPassword = await bcrypt.hash(password,salt);

    //creating a new user
    const newUser = new User({name,email,password:hashedPassword});

    await newUser.save()

    //sending token
    const token = jwt.sign({id:newUser._id,name:newUser.name,email:newUser.email},process.env.JWT_SECRET,{expiresIn:'3d'})

    res.status(201).json({ message: "User registered successfully",token:token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


//login User
const loginUser =async(req,res)=>{
try {
  const {email,password} = req.body;

  //checking the mail exist or not
  const user = await User.findOne({email});
  if(!user){
    return res.status(400).json({ message: "Invalid credentials" });
  }

  //comparing password
  const isMatch = await bcrypt.compare(password,user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  //sending token 
  const token = jwt.sign({id:user._id,name:user.name,email:user.email},process.env.JWT_SECRET,{expiresIn:'3d'})

  res.status(200).json({message:"login success",token:token})
} catch (error) {
  
}
}

 export {registerUser,loginUser}
