const fs = require('fs');
const superagent = require('superagent');
const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) return reject("I couldn't find that file 😢")
            resolve(data)
        })
    })
}
const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) return reject("couldn't write file 😢")
            resolve("Success")
        })
    })
}
const getDogPic = async () => {
    try {      
        const data = await readFilePro(`${__dirname}/dog.txt`)
        const breed = data.toString().trim();
        console.log(`Breed: ${breed}`);
    
        const res = await superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`)
        await writeFilePro('dog-img.txt', res.body.message)
        console.log("Random dog image saved to file")
    } catch (err) {
        console.error('Error fetching image:', err);
    }
}
getDogPic();
/*
readFilePro(`${__dirname}/dog.txt`)
.then(data => {
 
    const breed = data.toString().trim(); // Trim any extra whitespace
    console.log(`Breed: ${breed}`);
    return superagent
        .get(`https://dog.ceo/api/breed/${breed}/images/random`)
 
}).then(res => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message)
 
}).then(()=>{
    console.log("Random dog image saved to file")
}).catch(err => {
    console.error('Error fetching image:', err);
});
*/



