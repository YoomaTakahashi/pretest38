const express = require('express')
const bc = require('bcrypt')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../Middleware/authmiddleware')
const router = express.Router()
const crypto = require('crypto')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        
        const {id_member,id_sys,day_eva} = req.body
        const [rows] = await db.query(`insert into tb_eva(id_member,id_sys,day_eva,status_eva) values(?,?,?,1)`,[id_member,id_sys,day_eva])
        res.json({rows,message:"Save success"})

    } catch (error) {
        console.error("Error save",error);
        res.status(500).json({message:"Error save"})
    }
})

router.put('/update/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        
        const {id_eva} = req.params
        const {id_member,id_sys,day_eva} = req.body
        const [rows] = await db.query(`update tb_eva set id_member=?,id_sys=?,day_eva=? where id_eva=?`,[id_member,id_sys,day_eva,id_eva])
        res.json({rows,message:"update success"})
        

    } catch (error) {
        console.error("Error save",error);
        res.status(500).json({message:"Error save"})
    }
})



router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        
       
        const [rows] = await db.query(`select * from tb_system s,tb_eva e,tb_member m where s.id_sys = e.id_sys and e.id_member = m.id_member order by id_eva desc`)
        res.json(rows)
        

    } catch (error) {
        console.error("Error save",error);
        res.status(500).json({message:"Error save"})
    }
})


// router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
//     try {
        
       
//         const [rows] = await db.query(`select * from tb_member where role='กรรมการประเมิน' order by id_member desc`)
//         res.json(rows)
        

//     } catch (error) {
//         console.error("Error save",error);
//         res.status(500).json({message:"Error save"})
//     }
// })

router.delete('/delete/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        
        const {id_eva} = req.params
        const [rows] = await db.query(`delete from tb_eva where id_eva =?`,[id_eva])
        res.json({rows,message:"delete success"})
        

    } catch (error) {
        console.error("Error save",error);
        res.status(500).json({message:"Error save"})
    }
})


module.exports = router
