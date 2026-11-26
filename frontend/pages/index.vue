<template>
    <v-app class="style-bg">
        <v-container>
            <v-row align="center" justify="center">
                <v-col cols="12" md="6">
                    <div>
                        <div class="text-center text-md-start">
                            <div class="logo-box mb-6 mx-auto mx-md-0">
                                <div class="logo-ring"></div>
                                <v-sheet rounded="circle" width="150" height="150" class="logo-float d-flex align-center justify-center">
                                    <v-img src="/img/logo.png" width="100" height="100"></v-img>
                                </v-sheet>
                            </div>
                            <div class="text-display-small mb-3">
                                <span>วิทยาลัยเทคนิค</span><span class="text-red-lighten">น่าน</span>
                            </div>
                            <div class="text-body-medium font-weight-bold text-medium-emphasis mb-6">NTC Evaluation System</div>
                            <ClientOnly>
                                <v-chip size="large" color="white" class="text-center d-flex justify-center align-center mb-4">
                                    <v-icon icon="mdi-circle" color="success" class="ms-2 blink"></v-icon>
                                    <div class="text-title-large font-weight-bold">{{ time }}</div>
                                    <div class="text-display-small text-medium-emphasis text-body-medium">{{ date }}</div>
                                </v-chip>
                            </ClientOnly>
                            <v-card rounded="xl" variant="outlined" color="grey" class="bg-white mb-4 d-none d-md-block">
                                <v-list bg-color="transparent">
                                    <v-list-item v-for="r in roles" :key="r.title" :prepend-icon="r.icon" :title="r.title" :subtitle="r.detail" class="px-0 text-black"></v-list-item>
                                </v-list>
                            </v-card>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="5" sm="8" offset-md="1">
                    <v-card rounded="xl" elevation="3" class="pa-8">
                        <v-chip class="mb-3" size="small" color="primary" variant="tonal" prepend-icon="mdi-clock-outline">{{ greeting }}</v-chip>
                        <div class="d-flex align-center justify-center mb-3">
                            <v-img src="/img/logo.png" width="36" max-width="36" height="36"></v-img>
                            <div class="text-title-large font-weight-bold mx-1">เข้าสู่ระบบ</div>
                            <div class="text-body-medium text-medium-emphasis">กรุณาเข้าสู่ระบบเพื่อใช้งาน</div>
                        </div>
                        <br>
                        <v-alert density="compact" type="error" v-if="error" class="my-2 shake">{{ error }}</v-alert>
                        <v-form @submit.prevent="login">
                            <v-row>
                                
                                <v-col cols="12" md="12"> 
                                    <v-text-field label="ชื่อผู้ใช้" v-model="username"  variant="outlined" rounded="lg" prepend-inner-icon="mdi-account-circle"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12"> 
                                    <v-text-field label="รหัสผ่าน" v-model="password" variant="outlined" rounded="lg" prepend-inner-icon="mdi-lock" :append-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="show ? 'text':'password'" @click:append-inner="show = !show"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12"> 
                                    <v-select label="ประเภทสมาชิก" v-model="role" variant="outlined" rounded="lg" prepend-inner-icon="mdi-account-group" :items="typeR"></v-select>
                                </v-col>
                                <v-col cols="12" md="12"> 
                                    <v-checkbox label="จดจำฉัน" v-model="remember" density="compact" hide-details></v-checkbox>
                                </v-col>

                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center text-white btn-style" block size="large" color="error" type="submit" append-icon="mdi-arrow-right">เข้าสู่ระบบ</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <p class="text-center text-body-medium text-black">หากมีบัญชีอยู่แล้ว <nuxt-link to="/regis" class="text-red-lighten-2">สมัครสมาชิก</nuxt-link></p>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import auth from '~/API/auth'
import { api } from '~/API/base'


definePageMeta({
    layout:false
})

const error = ref('')
const typeR = ['ฝ่ายบุคลากร','ผู้รับการประเมินผล','กรรมการประเมิน']
const show = ref(false)
const remember = ref(false)
const username = ref('')
const password = ref('')
const role = ref('')

const roles = [
    {title:'ฝ่ายบุคลากร',detail:'จัดการการประเมินเช่น หัวข้อ ตัวชี้วัด และแบบประเมิน',icon:'mdi-account-tie'},
    {title:'ผู้รับการประเมินผล',detail:'ประเมินตนเอง แนบหลักฐานพร้อมกับพิมพ์เอกสารการประเมิน',icon:'mdi-account-school'},
    {title:'กรรมการประเมิน',detail:'ประเมินผู้รับการประเมินพร้อมแนบรายเซ็น',icon:'mdi-account-star'},
]

const now = ref(new Date())
let timer:any

onMounted(()=>{

    timer = setInterval(()=>(now.value = new Date()),1000)

    const saved = localStorage.getItem('saveUser')
    if(saved){
        username.value = saved
        remember.value = true
    }

})

const time = computed(()=>now.value.toLocaleTimeString('th-TH'))
const date = computed(()=>now.value.toLocaleDateString('th-TH',{weekday:'long',day:'numeric',month:'narrow',year:'numeric'}))

onUnmounted(()=>clearInterval(timer))

const greeting = computed(()=>{
    const h = now.value.getHours()
    if(h < 12)return 'สวัสดีตอนเช้า'
    if(h < 17)return 'สวัสดีตอนบ่าย'
    if(h < 20)return 'สวัสดีตอนสวัสดีตอนเย็น'
    return 'สวัสดียามดึก'
})

const login = async()=>{
    try {
        const res = await auth.login({
            username:username.value,
            password:password.value,
            role:role.value
        })
        console.log("login Success",res.data)
        localStorage.setItem('token',res.data.token)

        if(remember.value)localStorage.setItem('saveUser',username.value)
        else localStorage.removeItem('saveUser')

        if(res.data.statusPw)localStorage.setItem('statusPw','n')
        else localStorage.removeItem('statusPw')

        alert('ดำเนินการสำเร็จ')
        if(res.data.statusPw)return navigateTo('/Evaluatee/changePw')

        const useRole = res.data.role
        if(useRole === 'ฝ่ายบุคลากร')useRouter().push('/Staff')
        if(useRole === 'ผู้รับการประเมินผล')useRouter().push('/Evaluatee')
        if(useRole === 'กรรมการประเมิน')useRouter().push('/Committee')
        
    } catch (err:any) {
        console.error("Error login",err);
        error.value= err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
        
    }
}

</script>

<style scoped>

</style>