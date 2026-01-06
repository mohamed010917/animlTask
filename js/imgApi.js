const key = "f8a3068488d6663878386bda4b130868" ;

const ImgUplode = async function (files) {
    console.log(files.files[0]);
    let file = files.files[0];
    if (!file) return;

    let form = new FormData();
    form.append("image", file);

    let apiKey = key; 

    let res = await fetch("https://api.imgbb.com/1/upload?key=" + apiKey, {
        method: "POST",
        body: form
    });

    let data = await res.json();
  
    let url = data.data;
    return url;
}
export default ImgUplode ;