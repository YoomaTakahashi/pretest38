const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const db = require('../db')

exports.verifyToken = (req,res,next)=>{
    const authHeader = req.header("Authorization")
    if(!authHeader){
        return res.status(401).json({message:'Authorization header is required'})
    }
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:'Token ไม่ถูกต้อง กรุณาLogin ใหม่'})
    }
    const token = authHeader.split(" ")[1]
    try {
        const decoded = jwt.verify(token,JWT_SECRET)
        req.user = decoded;
        next()
    } catch (error) {
        console.error('Invalid Token provice',error)
        res.staus(401).json({message:'Session หมดอายุหรือไม่ได้รับToken'})
    }
}

exports.requireRole = (role)=>(req,res,next)=>{
    try {
        if(req.user && req.user.role === role){
            return next()
        }
        return res.status(401).json({message:'Role ไม่ถูกต้อง Role ใหม่'})
    } catch (error) {
        console.error('Invalid Role provice',error)
        res.staus(401).json({message:'Role ไม่ถุกต้อง'})
    }
}

exports.reqchangePw = async (req,res,next) => {
    try {
        const id_member = req.user.id_member
        const role = req.user.role
        const [rows] = await db.query(`select statusPw from tb_member where id_member=?`,[id_member])
        if(role !== 'ผู้รับการประเมินผล')return
        if(rows[0]?.statusPw === 'n'){
            return res.status(400).json({message:'กรุณาเปลี่ยนรหัสผ่านก่อนใช้งาน',statusPw:true})
        }
        next()
    } catch (error) {
        console.error('Error check Password',error)
        res.staus(500).json({message:'Error check Password'})
    }
}