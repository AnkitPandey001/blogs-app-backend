import jwt from 'jsonwebtoken'

export const generateJwtToken =(userId,res)=>{
  const token = jwt.sign({userId},process.env.JWT_SECRET,{
      expiresIn: '15d'
  })

  res.cookie('jwt',token,{
    maxAge:15*24*60*60*1000,
    httpOnly:true, // prevent XSS attack
    sameSite:"strict", // prevent CSRF attacks
    secure:"developement"
  })
  return token
}

