<template>
    <v-app>
        <v-app-bar elevation="5" class="rounded-b" flat :color="bg(user.role)">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">NTC EVALUTION SYSTEM</v-toolbar-title>
            <v-spacer></v-spacer>

            <p class="text-center">คุณ : {{ user.fname }} {{ user.lname }} <br> {{ user.role }}</p>
            <v-btn variant="text" @click="logout" icon="mdi-logout" ></v-btn>
        </v-app-bar>

        <v-navigation-drawer app class="no-p" color="#404040" width="260" v-model="drawer" :temporary="isMobile" :permanent="!isMobile">
            <v-list density="comfortable" class="no-p" >
                <v-list-item class="no-p">
                    <v-list-item-title class="no-p font-weight-bold">NTC EVALUATION SYSTEM</v-list-item-title>
                    <div class="mt-3">
                        <v-chip color="white" variant="outlined" >{{ user.role }}</v-chip>
                    </div>
                </v-list-item>
            </v-list>

            <v-divider color="white" opacity="0.5" class="no-p"> </v-divider>

            <v-list density="comfortable" class="no-p" >
                <v-list-item class="no-p" v-for="[title,to] in navitem" :key="to" :to="to">
                    <v-list-item-title class="no-p">
                        {{ title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid class="py-2">
                <slot></slot>
            </v-container>
            <v-footer class="text-caption justify-center">©2026 NTC EVALUATION SYSYTEM</v-footer>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useDisplay } from 'vuetify';
import { api } from '~/API/base';

const drawer = ref(false)
const user = ref<any>({})
const {mdAndDown} = useDisplay()
const isMobile = computed(()=> mdAndDown.value)

const logout = ()=>{
    if(!confirm('ท่านต้องการออกจากระบบใช่หรือไม่')){
        return
    }
    localStorage.removeItem('token')
    localStorage.removeItem('statusPw')
    navigateTo('/',{replace:true})
}

const roles: Record<string,[string,string][]> = {
    'ฝ่ายบุคลากร':[
        ['หน้าหลัก','/Staff'],
        ['จัดการผู้รับการประเมินผล','/Staff/Manage_eva'],
        ['จัดการกรรมการประเมินผล','/Staff/Manage_commit'],
        ['จัดการหัวข้อการประเมิน','/Staff/Topic'],
        ['จัดการตัวชี้วัดการประเมิน','/Staff/Indicate'],
        ['จัดการรอบการประเมิน','/Staff/Round'],
        ['จัดการแบบประเมินผล','/Staff/Eva'],
        ['ผลการประเมินของผู้รับการประเมินผล','/Staff/Score_evaList'],
        ['ผลการประเมินของกรรมการประเมิน','/Staff/Score_commitList'],
        ['สถานะการประเมินผลของผู้รับการประเมิน','/Staff/Status_eva'],
        ['สถานะการประเมินผลของกรรมการประเมิน','/Staff/Status_commit'],
        ['เอกสารหรือคู่มือการประเมิน','/Staff/Document'],
        ['รายงานรายชื่อผู้รับการประเมิน','/Staff/Report'],
    ],
    'ผู้รับการประเมินผล':[
        ['หน้าหลัก','/Evaluatee'],
        ['แก้ไขข้อมูลส่วนตัว','/Evaluatee/Edit_eva'],
        ['แบบประเมินตนเอง','/Evaluatee/Self_eva'],
        ['ตรวจสอบผลการประเมิน','/Evaluatee/Check_score'],
        ['รายงานผลการประเมิน','/Evaluatee/Report'],
        ['คู่มือการประเมิน','/Evaluatee/Doc'],
    ],
    'กรรมการประเมิน':[
        ['รายชื่อผู้รับการประเมินผล','/Committee'],
        ['ดำเนินการประเมิน','/Committee/Show_eva'],
        ['ตรวจสอบและยืนยันผล','/Committee/Check_confirm'],
        ['คู่มือการประเมิน','/Committee/Doc'],
    ]
}

const navitem = computed(()=> roles[user.value.role] || [])

const fetch = async()=>{
    const token = localStorage.getItem('token')
    if(!token){
        return navigateTo('/',{replace:true})
    }
    try {
        const res = await axios.get(`${api}/profile`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    } catch (error) {
        console.error('Error Get ',error)
        localStorage.removeItem('token')
        navigateTo('/',{replace:true})
    }
}

onMounted(fetch)

const bg = (role:string)=>{
    if(role === 'ฝ่ายบุคลากร')return '#647687'
    if(role === 'กรรมการประเมิน')return '#007fff'
    if(role === 'ผู้รับการประเมินผล')return '#7d0c14'
}

</script>

<style scoped>
@media print {
    .v-app-bar,.v-btn,.no-p{
        display: none !important;
        margin: 0 !important;
        margin-top: 0 !important;
        padding: 0 !important;
        width: 0px !important;
    }
}
</style>