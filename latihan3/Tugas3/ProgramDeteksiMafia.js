nama = "Jamal"
umur = 50
tempat_tinggal = "Nevada"
tabungan = 20000000

if(umur > 40 && tempat_tinggal == "Nevada" || tempat_tinggal == "New York" || tempat_tinggal == "Havana" && tabungan > 10000000){
    console.log(nama + ` kemungkinan adalah seorang anggota mafia dengan pangkat DON `)
}else if(umur <= 40 && umur >= 25 && tempat_tinggal == "New Jersey" || tempat_tinggal == "Manhattan" || tempat_tinggal == "Nevada" && tabungan >= 1000000 && tabungan <= 2000000 ){
    console.log(nama + ` kemungkinan adalah seorang mafia dengan pangkat Underboss `)
}else if(umur >= 18 && umur <= 24 && tempat_tinggal == "California" || tempat_tinggal == "Detroit" || tempat_tinggal == "Boston" && tabungan < 1000000){
    console.log(nama + ` kemungkinan adalah seorang anggota mafia dengan pangkat Capo `)
}else{
    console.log(nama + ` tidak mencurigakan `)
}