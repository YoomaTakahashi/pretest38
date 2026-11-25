const express = require('express')
const path = require('path')
const uploadDir = path.join(__dirname,'../uploads/pic_user')
const bc = require('bcrypt')
const db = require('../db')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const router = express.Router()
const {verifyToken,requireRole} = require('../Middleware/authmiddleware')

router.post('/regis',async (req,res) => {
    try {
        const form = JSON.parse(req.body.form)
        const pic_user = req.files?.pic_user
        let filename = null
        if(pic_user){
            filename = Date.now() + path.extname(pic_user.name)
            await pic_user.mv(path.join(uploadDir,filename))
        }
        const hash = await bc.hash(form.password,10)
        const [rows] = await db.query(`insert into tb_member(fname,lname,email,username,password,role,pic_user,statusPw) values(?,?,?,?,?,?,?,?)`,[form.fname,form.lname,form.email,form.username,hash,form.role,pic_user,'n'])
        res.json(rows)
    } catch (error) {
        console.error("error regis");
        res.status(500).json({message:"Error regis"})
        
    }
})

router.post('/login',async (req,res) => {
    try {
        const {username,password,role} = req.body
        const [rows] = await db.query(`select * from tb_member where username=? and role=?`,[username,role])
        const m = rows[0]
        if(!m || !password || !(await bc.compare(password,m.password))){
            return res.status(400).json({message:"รหัสผ่านไม่ถูกต้อง"})
        }
        const token = jwt.sign(
            {id_member:m.id_member,username:m.username,role:m.role},JWT_SECRET,{expiresIn:'24h'}
        )
        const statusPw = m.role === 'ผู้รับการประเมินผล' && m.statusPw === 'n'
        res.json({token,role:m.role,statusPw})
    } catch (error) {
        console.error("error regis");
        res.status(500).json({message:"Error regis"})
        
    }
})

router.put('/changePw',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try {
        const id_member = req.user.id_member
        const {oldPw,newPw} = req.body
        const [rows] = await db.query(`select password from tb_member where id_member=?`,[id_member])
        const m = rows[0]
        if(!m || !oldPw || !(await bc.compare(oldPw,m.password))){
            return res.status(400).json({message:'รหัสผ่านไม่ถูกต้อง'})
        }
        if(oldPw.trim() === newPw.trim()){
            return res.status(400).json({message:'รหัสผ่านซ้ำกัน'})
        }
        const hash = await bc.hash(newPw,10)
        await db.query(`update tb_member set statusPw=?,password=? where id_member=?`,['y',hash,id_member])
        res.status(200).json({message:'Reset Password Success'})
    } catch (error) {
        console.error('Error put',error)
        res.status(500).json({message:'Error put'})
    }
})

module.exports = router