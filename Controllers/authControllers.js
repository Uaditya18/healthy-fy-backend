import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'



const generateToken= user=>{
  return jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET_KEY,
  {expiresIn:"15d"})
}
export const register = async(req, res) => {
  const { email, password, name, role, photo, gender } = req.body
    console.log("1");
    
    try {
      let user = null;
      
      console.log("2");
      // Check if user already exists based on role
      if (role === "patient") {
        console.log("patient");
        user = await User.findOne({ email });
      } else if (role === "doctor") {
        console.log("doctor");
        user = await Doctor.findOne({ email });
      }
      
      console.log("3");
      // If user exists, return error
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
        console.log("user");
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      
      console.log("4");
      // Create new user based on role
      if (role === 'patient') {
      console.log("5");
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role
      });
      console.log("6");
    } else if (role === 'doctor') {
      console.log("7");
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role
      });
      console.log("8");
    }
    
    console.log("9");
    // Save the user
    await user.save();
    console.log("10");
    
    res.status(200).json({ success: true, message: "User successfully created" });
    console.log("11");
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error! Try again" });
  }
};

export const login = async(req, res) => {

  const {email} = req.body
  

  try {
    // login logic
    

    let user = null

    const doctor = await Doctor.findOne({email})
    const patient = await User.findOne({email})

    if(patient){
      user = patient
    }
    
    if(doctor){
      user = doctor
    }

    // checking if user do no exits

    
    if(!user){
      return res.status(484).json({message: "use not found! sign up"})
    }

    // check if the user exits or not 
    const isPasswordMatch =  bcrypt.compare(req.body.password,user.password)

    // compare password
    if(!isPasswordMatch){
      return res.status(200).json({status:false,message:"Invalid user password"})
    }

    // get token
    const token = generateToken(user)
    const {password,role,appointments, ...rest } = user._doc

    res
    .status(200)
    .json({
      status: true,
      message: "Successfully login",
      token,
      data:{...rest},
      role,
    });
    

  } catch (err) {
    // error handling
    res.status(500).json({ success: false, message: "Internal login server error! Try again" });
  }

};
