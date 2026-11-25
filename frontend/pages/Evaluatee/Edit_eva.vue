<template>
    <v-app class="style-bg">
        <v-container>
            <PageHeader title="แก้ไขข้อมูลผู้รับการประเมินผล" subtitle="สามารถแก้ไขข้อมูลส่วนตัวของผู้รับการประเมินผล" icon="mdi-clipboard-edit" color="#7d0c14"></PageHeader>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <v-card rounded="xl" elevation="3">
                        <v-card-title class="bg-grey">
                            <div class="text-center font-weight-bold mt-5 text-title-large mb-3"><h1>แก้ไขข้อมูลส่วนตัว</h1></div>
                            <!-- <div class="text-center font-weight-bold text-title-large text-medium-emphasis">NTC Evaluation System</div> -->
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
                                    <v-col cols="12" md="6"> 
                                        <v-text-field label="รหัสผ่าน" v-model="form.password" :error-messages="error.password" variant="outlined" rounded="lg" prepend-inner-icon="mdi-lock" :append-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="show ? 'text':'password'" @click:append-inner="show = !show"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6"> 
                                        <v-text-field label="ยืนยันรหัสผ่าน" v-model="conP" :error-messages="error.conP" variant="outlined" rounded="lg" prepend-inner-icon="mdi-lock" :append-inner-icon="show2 ? 'mdi-eye':'mdi-eye-off'" :type="show2 ? 'text':'password'" @click:append-inner="show2 = !show2"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12"> 
                                        <v-alert rounded="xl" icon="mdi-account-tie">{{ form.role }}</v-alert>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class="text-center text-white"   type="submit" color="info">แก้ไข</v-btn>&nbsp;&nbsp;
                                            <v-btn class="text-center text-white"   type="submit" color="error">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { eva } from '~/API/base'




const error = ref<Record<string,string>>({})
const pic_user = ref<File | null>(null)
const typeR = ['ฝ่ายบุคลากร','ผู้รับการประเมินผล','กรรมการประเมิน']
const show = ref(false)
const show2 = ref(false)
const conP = ref('')
const form = ref({
    fname:'',
    lname:'',
    email:'',
    username:'',
    password:'',
    role:''
})
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

    if(!f.password){
        return Object.keys(error.value).length === 0
    }else{
        if(f.password.trim().length < 6)error.value.password = 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร'
        if(!conP.value.trim())error.value.conP = 'กรุณายืนยันรหัสผ่าน'
        else if(conP.value.trim() !== f.password.trim())error.value.conP = 'รหัสผ่านไม่ตรงกัน'
    }

    if(!f.role.trim())error.value.role = 'กรุณากรอกประเภทสมาชิก'

    return Object.keys(error.value).length === 0

}

const saveMember = async()=>{
    const token = localStorage.getItem('token')
    if(!validate())return 
    try {
        await axios.put(`${eva}/edit_eva/`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('ดำเนินการสำเร็จ')
        window.location.reload()
    } catch (error) {
        console.error("Error regis",error);
        
    }
}

const fetch = async()=>{
    const token = localStorage.getItem('token')

    try {
        const res = await axios.get(`${eva}/edit_eva/`,{headers:{Authorization:`Bearer ${token}`}})
        form.value = res.data
    } catch (error) {
        console.error('Error Get ',error)
    }
}

onMounted(fetch)

</script>

<style scoped>

</style>