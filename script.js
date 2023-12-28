let sunucudanDonen; // Sunucudan dönen veriyi tutacak bir değişken oluşturuluyor

// XMLHttpRequest nesnesi oluşturuluyor. Bu nesne, bir sunucudan veri almak için kullanılır
// Aşağıdaki kod bloğunu (JSON bağlatısı) "w3school.com" üzerinden "xmlhttprequest" yazarak bulabilirsiniz. (üzerinde bir kaç değişiklik yaptım)
var baglanti = new XMLHttpRequest();

// onreadystatechange olayı, sunucudan bir yanıt geldiğinde tetiklenir
baglanti.onreadystatechange = function() {
    // readyState 4, isteğin tamamlandığını ve yanıtın hazır olduğunu belirtir
    // status 200, "Tamam" anlamına gelir, yani istek başarılı bir şekilde işlendi
    if (this.readyState == 4 && this.status == 200) {
       // Sunucudan dönen yanıt metni, JSON.parse() ile bir JavaScript nesnesine dönüştürülüyor
       sunucudanDonen=JSON.parse(baglanti.responseText)
       // Daha sonra soruGetir fonksiyonu çağrılıyor
       soruGetir();
    }
    // Sonuç olarak sunucudan dönen veri döndürülüyor
    return sunucudanDonen;
};

// open() metodu, bir sunucu isteği başlatır
// İlk parametre istek türünü belirtir ("GET" veya "POST")
// İkinci parametre isteğin yapılacağı URL'yi belirtir
// Üçüncü parametre isteğin asenkron olup olmadığını belirtir (true = asenkron)
baglanti.open("GET", "data.json", true);

// send() metodu, isteği sunucuya gönderir
baglanti.send();

// HTML belgesindeki belirli elemanları seçiyoruz
const soruAlani = document.getElementById("soruAlani");
const soru = document.getElementById("soru");
const secenekler = document.getElementsByName("secenek");

const aciklamaA = document.getElementById("aciklamaA");
const aciklamaB = document.getElementById("aciklamaB");
const aciklamaC = document.getElementById("aciklamaC");
const aciklamaD = document.getElementById("aciklamaD");

const cevabiGonder = document.getElementById("cevabiGonder");

// Puan ve sıra için iki değişken oluşturuluyor
let puan = 0;
let sira = 0;

// soruGetir fonksiyonu, sunucudan dönen veriyi kullanarak bir soruyu ve seçeneklerini ekrana yazdırır
function soruGetir(){
    secimiTemizle(); // Önceki seçimi temizler
    console.log(sunucudanDonen); // Sunucudan dönen veriyi konsola yazdırır

    let siradakiSoru = sunucudanDonen.sorular[sira]; // Sıradaki soruyu alır
    soru.innerHTML = siradakiSoru.sorulan; // Soruyu ekrana yazdırır
    aciklamaA.innerText = siradakiSoru.secenekA; // A seçeneğini ekrana yazdırır
    aciklamaB.innerText = siradakiSoru.secenekB; // B seçeneğini ekrana yazdırır
    aciklamaC.innerText = siradakiSoru.secenekC; // C seçeneğini ekrana yazdırır
    aciklamaD.innerText = siradakiSoru.secenekD; // D seçeneğini ekrana yazdırır
}

// secimiTemizle fonksiyonu, önceki seçimi temizler
function secimiTemizle(){
    secenekler.forEach(secenek => secenek.checked = false);
}

// secimiAl fonksiyonu, kullanıcının hangi seçeneği seçtiğini alır
function secimiAl(){
    let secim;

    secenekler.forEach(secenek => {
        if (secenek.checked == true){
            secim = secenek.id;
        }
    })
    return secim;
}

// cevabiGonder butonuna bir tıklama olayı ekleniyor
cevabiGonder.addEventListener("click", () => {
    const secilen = secimiAl(); // Kullanıcının seçimini alır
    if (secilen){
        if (secilen==sunucudanDonen.sorular[sira].cevap){ // Eğer kullanıcının seçimi doğruysa
            puan++; // Puanı artırır
        }
    }
    sira++; // Sırayı bir artırır
    if (sira < sunucudanDonen.sorular.length){ // Eğer daha soru varsa
        soruGetir(); // Bir sonraki soruyu getirir
    }
    else{ // Eğer tüm sorular bitmişse
        soruAlani.innerHTML = `
        <h2>Mevcut sorulardan ${puan}/${sunucudanDonen.sorular.length} oranında başarı sağladınız.</h2>
        ` // Başarı oranını ekrana yazdırır
        cevabiGonder.setAttribute("onclick", "location.reload()"); // Butonun tıklama olayını sayfayı yenilemek olarak değiştirir
        cevabiGonder.innerHTML = "Yeniden başla" // Butonun metnini "Yeniden başla" olarak değiştirir
    }
})
