nilai_coding = 75
nilai_interview = "c"

if(nilai_coding >=80 && nilai_coding <=100 && nilai_interview === "A" || nilai_interview === "B"){
    console.log("selamat kamu lulus dengan nilai coding lolos dan nilai interview lolos")
}else if(nilai_coding >=60 && nilai_coding <80 && nilai_interview === "A" || nilai_interview === "B"){
    console.log("selamat kamu lulus dengan nilai coding dipertimbangkan dan nilai interview lolos")
}else{
    console.log("maaf kamu gagal")
}