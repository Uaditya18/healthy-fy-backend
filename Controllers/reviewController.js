
import Review from "../models/ReviewSchema.js"
import DoctorSchema from "../models/DoctorSchema.js"

// to export all the doctor 

export const getAllReviews = async(req, res) =>{
   
  try {
    const reviews = await Review.find({})

    res.status(200).json({success: true, message: "Successfully fetched ", data: reviews})
  } catch (error) {
    res.status(404).json({success: false, message: "fetch failed "})
  }
}


// to create review 
export const createReview = async(req, res)=>{

  //check if the request body contains a doctor/user field if not add specific doctor/user id
  if(!req.body.doctor) req.body.doctor = req.params.doctorId
  if(!req.body.user) req.body.user = req.userId

  const newReview = new Review(req.body)
  try {
    const savedReview = await newReview.save()

    await DoctorSchema.findByIdAndUpdate(req.body.doctor, {
      $push:{reviews: savedReview._id}
    })

    res.status(200).json({success:true, message:"Review submitted successfully", data: savedReview})

  } catch (error) {
    res.status(500).json({success:false, message:"Review Submission failed"})
  }
}