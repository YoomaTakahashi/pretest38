<template>
    <v-app class="style-bg">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="ผลการประเมินของผู้รับการประเมินผล" subtitle="ตรวจสอบผลการประเมินตนเองของผู้รับการประเมิน" icon="mdi-clipboard-check"></page-header>
                    <v-card rounded="xl" elevation="3" class="mt-3">
                        <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" class="ma-3"></v-text-field>
                        <div class="d-flex align-center justify-center mb-3">
                            <v-icon icon="mdi-file-document-edit" class="mx-2"></v-icon>
                            <div class="text-title-large font-weight-bold">ผลการประเมินของผู้รับการประเมินผล</div>
                        </div>
                        <v-table hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">ผู้รับการประเมินผล</th>
                                    <th class="text-center">รอบการประเมิน</th>
                                    <th class="text-center">วันที่ออกแบบประเมิน</th>
                                    <th class="text-center">คะแนนที่ได้</th>
                                    <th class="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ items.fname }} {{ items.lname }}</td>
                                    <td class="text-center">รอบการประเมินที่:{{ items.round_sys }} ปี:{{ items.year_sys }}</td>
                                    <td class="text-center">{{ formatDate(items.day_eva) }}</td>
                                    <td class="text-center">{{ items.total_eva || '-' }}</td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn class="ma-2" color="info" icon="mdi-magnify" variant="tonal" @click="go(items.id_eva)" size="small"></v-btn>
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
const token = import.meta.client ? localStorage.getItem('token'):null

const fetch = async()=>{
    try {

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


const go = (id_eva:number)=>{
    navigateTo({path:`/Staff/score_member-${id_eva}`})
}

onMounted(fetch)

</script>

<style scoped>

</style>