const { promises } = require('dns');
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

        const res1pRO = superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`)
        const res2pRO = superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`)
        const res3pRO = superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`)
        const all = await Promise.all([res1pRO, res2pRO, res3pRO])
        const imgs = all.map(img => img.body.message)
        await writeFilePro('dog-img.txt', imgs.join('\n'))
        console.log("Random dog image saved to file")
    } catch (err) {
        console.error('Error fetching image:', err);
        throw err
    }
    return '2,ready 🐩'
}

(async () => {
    try {
        console.log('1,will get dog pics')
        const x = await getDogPic()
        console.log(x)
        console.log('3,done getting dog pictures')
    } catch (err) {
        console.log('Error 🔥')
    }
})()
/* 
console.log('1,will get dog pics')
getDogPic().then((x)=>{
    console.log(x)
    console.log('3,done getting dog pictures')
}).catch((err)=>{
    console.log('Error 🔥')
})*/

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



