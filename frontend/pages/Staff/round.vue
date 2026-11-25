<template>
    <v-app class="style-bg">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="จัดการรอบการประเมิน" subtitle="จัดการข้อมูลรอบการประเมิน" icon="mdi-clock-alert"></page-header>
                    <v-card rounded="xl" elevation="3">
                        <v-card-title>
                            <div class="text-center font-weight-bold text-title-large mb-3"><v-avatar color="#647687" :icon="form.id_sys ? 'mdi-pencil':'mdi-plus'"></v-avatar>จัดการรอบการประเมิน</div>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row>
                                    
                                    <v-col cols="12" md="6"> 
                                        <v-text-field label="วันที่เปิดรอบการประเมิน" v-model="form.day_open" :error-messages="error.day_open" variant="outlined" rounded="lg" type="date"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6"> 
                                        <v-text-field label="วันที่ปิดรอบการประเมิน" v-model="form.day_out" :error-messages="error.day_out" variant="outlined" rounded="lg" type="date"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6"> 
                                        <v-text-field label="รอบการประเมิน" v-model="form.round_sys" :error-messages="error.round_sys" variant="outlined" rounded="lg" type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6"> 
                                        <v-text-field label="ปีการประเมิน" v-model="form.year_sys" :error-messages="error.year_sys" variant="outlined" rounded="lg" type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6"> 
                                        <v-select label="สถานะการรอบประเมิน" v-model="form.status_sys" :error-messages="error.status_sys" variant="outlined" rounded="lg" :items="[{title:'เปิด',value:'y'},{title:'ปิด',value:'n'}]"></v-select>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" type="submit" color="primary" prepend-icon="mdi-content-save">{{form.id_sys ? 'อัปเดต':'บันทึก'}}</v-btn>
                                            <v-btn class="text-center text-white ma-2" @click="reset()" color="error" variant="tonal" prepend-icon="mdi-close">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                    <v-card rounded="xl" elevation="3" class="mt-3">
                        <!-- <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" class="ma-3"></v-text-field> -->
                        <div class="d-flex align-center justify-center mb-3">
                            <v-icon icon="mdi-clock-alert" class="mx-2"></v-icon>
                            <div class="text-title-large font-weight-bold">จัดการรอบการประเมิน</div>
                        </div>
                        <v-table hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">วันที่เปิดรอบการประเมิน</th>
                                    <th class="text-center">วันที่ปิดรอบการประเมิน</th>
                                    <th class="text-center">รอบการประเมิน</th>
                                    <th class="text-center">ปีการประเมิน</th>
                                    <th class="text-center">สถานะการรอบประเมิน</th>
                                    <th class="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_sys">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ formatDate(items.day_open) }}</td>
                                    <td class="text-center">{{ formatDate(items.day_out) }}</td>
                                    <td class="text-center">{{ items.round_sys }}</td>
                                    <td class="text-center">{{ items.year_sys }}</td>
                                    <td class="text-center">{{ items.status_sys === 'y' ? 'เปิด':'ปิด' }}</td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn class="ma-2" color="warning" icon="mdi-pencil" variant="tonal" @click="edit(items)" size="small"></v-btn>
                                            <v-btn class="ma-2" color="error" icon="mdi-delete" variant="tonal" @click="del(items.id_sys)" size="small"></v-btn>
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
const result = ref([])
const search = ref('')
const form = ref({
    id_sys:null,
    day_open:'',
    day_out:'',
    round_sys:'',
    year_sys:'',
    status_sys:''
})
const reset = ()=>{
    form.value = {
        id_sys:null,
        day_open:'',
        day_out:'',
        round_sys:'',
        year_sys:'',
        status_sys:''
    }
}

function validate(){
    const f = form.value
    error.value = {}

    if(!f.day_open)error.value.day_open = 'กรุณากรอกวันที่เปิดรอบการประเมิน'
    if(!f.day_out)error.value.day_out = 'กรุณากรอกวันที่ปิดรอบการประเมิน'
    if(!f.round_sys)error.value.round_sys = 'กรุณากรอกรอบการประเมิน'
    if(!f.year_sys)error.value.year_sys = 'กรุณากรอกปีการประเมิน'
    if(!f.status_sys)error.value.status_sys = 'กรุณาเลือกสถานะการประเมิน'

    return Object.keys(error.value).length === 0

}

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!validate())return 
    const f = form.value
    try {
        f.id_sys
        ? await axios.put(`${staff}/system/update/${f.id_sys}`,f,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/system/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        alert('ดำเนินการสำเร็จ')
        await fetch()
        await reset()
    } catch (error) {
        console.error("Error save",error);
        
    }
}

const fetch = async()=>{
    try {
        const res2 = await axios.get(`${staff}/system/show`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res2.data
    } catch (error) {
        console.error("error get",error)
    }
}

// const result = computed(()=>{
//     if(!search.value)return dataResult.value
//     const s = search.value.toLowerCase()

//     return dataResult.value.filter((item:any)=>{
//         return(
//             item.name_indicate.toLowerCase().includes(s)
//         )
//     })
// })

const formatDate= (dateStr:string)=>{
    const date = new Date(dateStr)
    return date.toLocaleDateString('th-TH')
}

const edit = async(items:any)=>{
    form.value = {...items}
}

const del = async(id_sys:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/system/delete/${id_sys}`,{headers:{Authorization:`Bearer ${token}`}})
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