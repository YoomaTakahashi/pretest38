const express = require('express')
const bc = require('bcrypt')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../Middleware/authmiddleware')
const router = express.Router()
const crypto = require('crypto')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        
        const {fname,lname,email,username,password,role} = req.body
        const hash = await bc.hash(password,10)
        const [rows] = await db.query(`insert into tb_member(fname,lname,email,username,password,role) values(?,?,?,?,?,?)`,[fname,lname,email,username,hash,role])
        res.json({rows,message:"Save success"})

    } catch (error) {
        console.error("Error save",error);
        res.status(500).json({message:"Error save"})
    }
})

router.put('/update/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        
        const {id_member} = req.params
        const {fname,lname,email,username,password,role} = req.body
        if(password && password.trim()){
            const hash = await bc.hash(password,10)
            const [rows] = await db.query(`update tb_member set fname=?,lname=?,email=?,username=?,password=?,role=? where id_member=?`,[fname,lname,email,username,hash,role,id_member])
            res.json({rows,message:"update success"})
        }else{
            const [rows] = await db.query(`update tb_member set fname=?,lname=?,email=?,username=?role=? where id_member=?`,[fname,lname,email,username,role,id_member])
            res.json({rows,message:"update success"})
        }
        

    } catch (error) {
        console.error("Error save",error);
        res.status(500).json({message:"Error save"})
    }
})

router.put('/resetPw/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        
        const {id_member} = req.params
        const [rows] = await db.query(`select role from tb_member where id_member=?`,[id_member])
        const m = rows[0]
        if(m.role === 'ฝ่ายบุคลากร'){
            return res.status(403).json({message:"ไม่สามารถรีเซ็ตรหัสผ่าน ฝ่ายบุคลากร"})
        }
        let tempPw = ''
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
        for (let i = 0; i < 8; i++)tempPw += chars[crypto(chars.length)]
        const hash = await bc.hash(tempPw,10)
        await db.put(`update tb_member set statusPw='y' , password=? where id_member=?`,[hash,id_member])
        res.json({message:"รีเซ็ตรหัสผ่านสำเร็จ"})
    } catch (error) {
        console.error("Error reset",error);
        res.status(500).json({message:"Error reset"})
    }
})

module.exports = router
