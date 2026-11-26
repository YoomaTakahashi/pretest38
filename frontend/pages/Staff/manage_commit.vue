<template>
    <v-app class="style-bg">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="จัดการกรรมการประเมิน" subtitle="จัดการข้อมูลกรรมการประเมิน" icon="mdi-account-star"></page-header>
                    <v-card rounded="xl" elevation="3">
                        <v-card-title>
                            <div class=" font-weight-bold text-title-large mb-3"><v-avatar color="#647687" :icon="form.id_member ? 'mdi-pencil':'mdi-plus'"></v-avatar>จัดการกรรมการประเมิน</div>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row>
                                    <v-col cols="12" md="6"> 
                                        <v-text-field label="ชื่อ" v-model="form.fname" :error-messages="error.fname" variant="outlined" rounded="lg"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6"> 
                                        <v-text-field label="นามสกุล" v-model="form.lname" :error-messages="error.lname" variant="outlined" rounded="lg"></v-text-field>
                                    </v-col> 
                                    <v-col cols="12" md="6"> 
                                        <v-text-field label="อีเมล" v-model="form.email" :error-messages="error.email" variant="outlined" rounded="lg" prepend-inner-icon="mdi-email"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6"> 
                                        <v-text-field label="ชื่อผู้ใช้" v-model="form.username" :error-messages="error.username" variant="outlined" rounded="lg" prepend-inner-icon="mdi-account-circle"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12"> 
                                        <v-text-field label="รหัสผ่าน" v-model="form.password" :error-messages="error.password" variant="outlined" rounded="lg" prepend-inner-icon="mdi-lock" :append-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="show ? 'text':'password'" @click:append-inner="show = !show"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12"> 
                                        <v-select label="ประเภทสมาชิก" v-model="form.role" :error-messages="error.role" variant="outlined" rounded="lg" prepend-inner-icon="mdi-account-group" :items="typeR"></v-select>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" type="submit" color="primary" prepend-icon="mdi-content-save">{{form.id_member ? 'อัปเดต':'บันทึก'}}</v-btn>
                                            <v-btn class="text-center text-white ma-2" @click="reset()" color="error" variant="tonal" prepend-icon="mdi-close">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                    <v-card rounded="xl" elevation="3" class="mt-3">
                        <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" class="ma-3"></v-text-field>
                        <div class="d-flex align-center justify-center mb-3">
                            <v-icon icon="mdi-account-star" class="mx-2"></v-icon>
                            <div class="text-title-large font-weight-bold">จัดการกรรมการประเมิน</div>
                        </div>
                        <v-table hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">ชื่อ-สกุล</th>
                                    <th class="text-center">อีเมล</th>
                                    <th class="text-center">ชื่อผู้ใช้</th>
                                    <th class="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_member">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ items.fname }} {{ items.lname }}</td>
                                    <td class="text-center">{{ items.email }}</td>
                                    <td class="text-center">{{ items.username }}</td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn class="ma-2" color="info" icon="mdi-lock-reset" variant="tonal" @click="rePw(items)" size="small"></v-btn>
                                            <v-btn class="ma-2" color="warning" icon="mdi-pencil" variant="tonal" @click="edit(items.id_member)" size="small"></v-btn>
                                            <v-btn class="ma-2" color="error" icon="mdi-delete" variant="tonal" @click="del(items.id_member)" size="small"></v-btn>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-body-medium text-medium-emphasis text-center" colspan="12" v-if="result.length ===0">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, staff } from '~/API/base'

const error = ref<Record<string,string>>({})
const pic_user = ref<File | null>(null)
const typeR = ['กรรมการประเมิน']
const show = ref(false)
const dataResult = ref([])
const search = ref('')
const form = ref({
    id_member:null,
    fname:'',
    lname:'',
    email:'',
    username:'',
    password:'',
    role:''
})
const reset = ()=>{
    form.value = {
        id_member:null,
        fname:'',
        lname:'',
        email:'',
        username:'',
        password:'',
        role:''
    }
}
const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i

function validate(){
    const f = form.value
    error.value = {}

    if(!f.fname.trim())error.value.fname = 'กรุณากรอกชื่อ'
    if(!f.lname.trim())error.value.lname = 'กรุณากรอกนามสกุล'

    if(!f.email.trim())error.value.email = 'กรุณากรอกอีเมล'
    else if(!emailRegex.test(f.email.trim()))error.value.email = 'กรุณากรอกอีเมลให้ถูกต้อง'

    if(!f.username.trim())error.value.username = 'กรุณากรอกชื่อผู้ใช้'
    else if(f.username.trim().length < 4)error.value.username = 'ชื่อผู้ใช้ต้องยาวอย่างน้อย 4 ตัวอักษร'

    if(!f.role.trim())error.value.role = 'กรุณากรอกประเภทสมาชิก'

    if(!f.password){
        return Object.keys(error.value).length === 0
    }else{
        if(!f.password.trim())error.value.password = 'กรุณากรอกรหัสผ่าน'
        else if(f.password.trim().length < 6)error.value.password = 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร'
    }

    return Object.keys(error.value).length === 0

}

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!validate())return 
    const f = form.value
    const payload = {
        fname:f.fname,
        lname:f.lname,
        email:f.email,
        username:f.username,
        password:f.password,
        role:f.role,
        ...(f.password ? {password:f.password}:null)
    }
    try {
        f.id_member
        ? await axios.put(`${staff}/member/update/${f.id_member}`,payload,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/member/save`,{...payload,password:f.password},{headers:{Authorization:`Bearer ${token}`}})
        alert('ดำเนินการสำเร็จ')
        await fetch()
        await reset()
    } catch (error) {
        console.error("Error save",error);
        
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/member/showE`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data
    } catch (error) {
        console.error("error get",error)
    }
}

const result = computed(()=>{
    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()

    return dataResult.value.filter((item:any)=>{
        return(
            item.username.toLowerCase().includes(s)
        )
    })
})

const rePw = async(items:any)=>{
    if(!confirm(`ต้องการรีเซ็ตรหัสผ่านของ ${items.fname} ${items.lname} ใช่หรือไม่`))return
    try {
        const res = await axios.put(`${staff}/member/resetPw/${items.id_member}`,{},{headers:{Authorization:`Bearer ${token}`}})
        alert(`รีเซ็ตรหัสผ่านของ ${items.fname} ${items.lname} สำเร็จรหัสสำรองคือ ${res.data.tempPw}`)
    } catch (error) {
        console.error("error reset password",error);
    }
}

const edit = async(id_member:number)=>{
    try {
        const res = await axios.get(`${staff}/member/pick/${id_member}`,{headers:{Authorization:`Bearer ${token}`}})
        form.value = res.data
    } catch (error) {
        console.error("error edit",error);
    }
}

const del = async(id_member:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/member/delete/${id_member}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("error delete",error);
    }
}

onMounted(fetch)

</script>

<style scoped>

</style>