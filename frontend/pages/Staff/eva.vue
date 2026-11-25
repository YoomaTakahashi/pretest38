<template>
    <v-app class="style-bg">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="จัดการแบบประเมิน" subtitle="จัดการข้อมูลแบบประเมิน" icon="mdi-file-document-edit"></page-header>
                    <v-card rounded="xl" elevation="3">
                        <v-card-title>
                            <div class="text-center font-weight-bold text-title-large mb-3"><v-avatar color="#647687" :icon="form.id_eva ? 'mdi-pencil':'mdi-plus'"></v-avatar>จัดการแบบประเมิน</div>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row>
                                    <v-col cols="12" md="6"> 
                                        <v-select label="ผู้รับการประเมินผล" v-model="form.id_member" :error-messages="error.id_member" variant="outlined" rounded="lg" :items="member.map((t)=>({title:`${t.fname} ${t.lname}`,value:t.id_member}))"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6"> 
                                        <v-select label="รอบการประเมิน" v-model="form.id_sys" :error-messages="error.id_sys" variant="outlined" rounded="lg" :items="round.map((t)=>({title:`รอบการประเมินที่:${t.round_sys} ปี:${t.year_sys}`,value:t.id_sys}))"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6"> 
                                        <v-text-field label="วันที่ออกแบบประเมิน" v-model="form.day_eva" :error-messages="error.day_eva" variant="outlined" rounded="lg" type="date"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" type="submit" color="primary" prepend-icon="mdi-content-save">{{form.id_eva ? 'อัปเดต':'บันทึก'}}</v-btn>
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
                            <v-icon icon="mdi-file-document-edit" class="mx-2"></v-icon>
                            <div class="text-title-large font-weight-bold">จัดการแบบประเมิน</div>
                        </div>
                        <v-table hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">ผู้รับการประเมินผล</th>
                                    <th class="text-center">รอบการประเมิน</th>
                                    <th class="text-center">วันที่ออกแบบประเมิน</th>
                                    <th class="text-center">เพิ่มกรรมการ</th>
                                    <th class="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ items.fname }} {{ items.lname }}</td>
                                    <td class="text-center">รอบการประเมินที่:{{ items.round_sys }} ปี:{{ items.year_sys }}</td>
                                    <td class="text-center">{{ formatDate(items.day_eva) }}</td>
                                    <td class="text-center"><v-btn class="ma-2" color="success" icon="mdi-account-plus" variant="tonal" @click="go(items.id_eva)" size="small"></v-btn></td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn class="ma-2" color="warning" icon="mdi-pencil" variant="tonal" @click="edit(items)" size="small"></v-btn>
                                            <v-btn class="ma-2" color="error" icon="mdi-delete" variant="tonal" @click="del(items.id_eva)" size="small"></v-btn>
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
const dataResult = ref([])
const eva = ref([])
const round = ref([])
const search = ref('')
const form = ref({
    id_eva:null,
    id_member:'',
    id_sys:'',
    day_eva:''
})
const reset = ()=>{
    form.value = {
        id_eva:null,
        id_member:'',
        id_sys:'',
        day_eva:''
    }
}

function validate(){
    const f = form.value
    error.value = {}

    if(!f.id_member)error.value.id_member = 'กรุณาเลือกผู้รับการประเมินผล'
    if(!f.id_sys)error.value.id_sys = 'กรุณาเลือกรอบการประเมิน'
    if(!f.day_eva)error.value.day_eva = 'กรุณากรอกวันที่ออกแบบประเมิน'

    return Object.keys(error.value).length === 0

}

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!validate())return 
    const f = form.value
    try {
        f.id_eva
        ? await axios.put(`${staff}/eva/update/${f.id_eva}`,f,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/eva/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        alert('ดำเนินการสำเร็จ')
        await fetch()
        await reset()
    } catch (error) {
        console.error("Error save",error);
        
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/system/showY`,{headers:{Authorization:`Bearer ${token}`}})
        round.value = res.data
        const res2 = await axios.get(`${staff}/member/showE`,{headers:{Authorization:`Bearer ${token}`}})
        eva.value = res2.data
        const res3 = await axios.get(`${staff}/eva/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res3.data
    } catch (error) {
        console.error("error get",error)
    }
}

const result = computed(()=>{
    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()

    return dataResult.value.filter((item:any)=>{
        return(
            item.fname.toLowerCase().includes(s) ||
            item.lname.toLowerCase().includes(s)
        )
    })
})

const formatDate= (dateStr:string)=>{
    const date = new Date(dateStr)
    return date.toLocaleDateString('th-TH')
}

const edit = async(items:any)=>{
    form.value = {...items}
}

const del = async(id_eva:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/eva/delete/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("error delete",error);
    }
}

const go = (id_eva:number)=>{
    navigateTo({path:`/Staff/commit-eva-${id_eva}`})
}

onMounted(fetch)

</script>

<style scoped>

</style>