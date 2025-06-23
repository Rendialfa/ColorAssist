let nomor_punggung = 75

if(nomor_punggung %3 === 0 && nomor_punggung %5 === 0 && nomor_punggung >3 && nomor_punggung <=100){
    console.log("keeper");
}else if(nomor_punggung %2 === 0 && nomor_punggung <50){
    console.log("target attacker")
}else if(nomor_punggung %2 === 0 && nomor_punggung >=50 && nomor_punggung <=100){
    console.log("capten tim")
}else if(nomor_punggung %2 !== 0 && nomor_punggung <=90){
    console.log("defender");
}else if(nomor_punggung %2 !==0 && nomor_punggung >90 && nomor_punggung <= 100){
    console.log("playmaker");
}


