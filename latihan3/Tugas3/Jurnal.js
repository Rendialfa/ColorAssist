function hitung_kalori(aktivitas, durasi){
    let kalori = 0
if(aktivitas === `lari`){
    kalori = (durasi / 5) * 60
}else if(aktivitas === `push-up`){
    kalori = (durasi / 30) * 200
}else if(aktivitas === `plank`){
    kalori = durasi * 5
}else{
    console.log("aktivitas tidak dikenal");
    return 0
}
return kalori
}

function main(){
    let kalori = 0
    let aktivitas
    let durasi

    while (true){
        
    }
}







//olahraga_lari membakar 60 kalori setiap 5 menit
//olahraga_push-up membakar 200 kalori setiap 30 menit
//olahraga_plank membakar 5 kalori selama 1 menit
//berapa jumlah kalori setelah melakukan aktifitas tersebut, setiap orang boleh melakukan lebih dari 1