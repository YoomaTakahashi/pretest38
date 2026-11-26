<template>
    <v-container>
        <PageHeader title="แบบประเมินผู้รับการประเมินผล" subtitle="ใส่คะแนน 1-4 และใส่ข้อเสนอแนะได้" icon="mdi-clipboard-edit" color="#007fff"></PageHeader>

        <v-form v-if="user.status_commit === 'n'" @submit.prevent="saveScore">
            <v-card rounded="xl" class="mb-6" elevation="4">
                <v-list-item prepend-icon="mdi-account-circle" :title="`${user.fname}-${user.lname}`" :subtitle="`รอบที่${user.round_sys} /ปี ${user.year_sys}`"></v-list-item>
            </v-card>

            <v-card v-for="(topic,t) in topics" :key="topic.id_topic" rounded="xl" class="mb-6" elevation="5">
                <v-card-title class="pa-4 bg-grey">{{ Number(t)+1 }}.{{ topic.name_topic }}</v-card-title>

                <v-card-text v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate" class="pa-4">
                    <div class="text-title-medium font-weight-bold">{{ Number(t)+1 }}.{{ Number(i)+1 }}.{{ indicate.name_indicate }}</div>
                    <div class="text-medium-emphasis mb-2">{{ indicate.detail_indicate }}</div>
                    <v-chip size="small" class="me-2 mb-4">น้ำหนักคะแนน : {{ indicate.point_indicate }}</v-chip>
                    <v-chip size="small" class="mb-4" color="info">คะแนนเต็ม : {{ indicate.point_indicate*4 }}</v-chip>
                    <v-alert variant="tonal" class="mb-4" color="info" icon="mdi-account-edit">
                        <div>รายละเอียดจากผู้รับการประเมิน : {{ indicate.detail_eva || '-' }}</div>
                        <div class="mt-1">
                            ไฟล์เอกสาร : 
                            <v-btn v-if="indicate.file_eva" color="info" variant="tonal" size="small" prepend-icon="mdi-eye" @click="view(indicate.file_eva)">เปิดดู</v-btn>
                            <span v-else>ไม่มี</span>
                        </div>
                    </v-alert>

                    <v-row>
                        <v-col cols="12" md="12">
                            <v-select v-if="indicate.check_indicate === 'y'" :items="[1,2,3,4]" label="ใส่คะแนนประเมิน 1-4" variant="outlined" v-model="indicate.score"></v-select>
                            <v-text-field v-else label="ใส่คะแนนประเมิน 1-4" variant="outlined" v-model="indicate.score" type="number" min="1" @input="indicate.score > 4 ? indicate.score = 4 :null"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-divider v-if="Number(i) < topic.indicates.length - 1"></v-divider>
                </v-card-text>
            </v-card>
            <v-card rounded="xl" elevation="3" class="mb-6 pa-4">
                <v-textarea label="คำอธิบายเพิ่มเติม(ถ้ามี)" variant="outlined" v-model="detail_commit" rows="2" hide-details auto-grow></v-textarea>
            </v-card>
            <div class="text-center">
                <v-btn color="#007fff" size="large" prepend-icon="mdi-content-save" type="submit">บันทึกคะแนน</v-btn>
            </div>
        </v-form>
        <v-alert color="warning" type="warning" v-else-if="user.status_eva === 1" variant="tonal" rounded="xl">ยังไม่ได้ประเมินตนเอง</v-alert>
        <v-alert color="success" type="success" v-else-if="user.status_commit === 'y'" variant="tonal" rounded="xl">ประเมินสำเร็จ</v-alert>
        <v-alert type="error" v-else variant="tonal" rounded="xl">ไม่มีแบบประเมิน</v-alert>
        <div class="text-center mt-4">
            <v-btn color="blue-grey" size="large" variant="outlined" prepend-icon="mdi-arrow-left" to="/Committee/Check_confirm">ย้อนกลับ</v-btn>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { commit, eva,api } from '~/API/base';

const id_eva = useRoute().params.id_eva

const user = ref<any>({})
const topics = ref<any>([])
const detail_commit = ref('')

const view = (file:string)=>{
    const url = new URL(`/uploads/file_eva/${file}`,api).href
    window.open(url,'_blank')
}

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/save/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
        const res2 = await axios.get(`${commit}/save/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res2.data
    } catch (error) {
        console.error('Error get',error)
    }
}
onMounted(fetch)



const saveScore = async()=>{
    const token = localStorage.getItem('token')
    const formData = new FormData()
    const allScore = topics.value.flatMap((t:any)=>
        t.indicates.map((i:any)=>{
            return{
                id_topic:t.id_topic,
                id_indicate:i.id_indicate,
                score:i.score, 
            }
        })
    )
    if(allScore.some((s:any)=> !s.score)){
        alert('กรุณากรอกคะแนนให้สมบูรณ์')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    const detail_commitTo = detail_commit.value && detail_commit.value.trim() ? detail_commit.value : ""
    formData.append('detail_commit',detail_commitTo)
    try {
        await axios.post(`${commit}/save/save/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ประเมินสำเร็จ')
        fetch()
    } catch (error) {
        console.error('Error post',error)
        
    }
}

</script>

<style scoped>

</style>