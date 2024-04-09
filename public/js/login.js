const login = async (email, password) => {
    try {
        const res = await axios({
            method:'POST',
            url :'http://localhost:8080/api/v1/users/login',
            data: {
                email,
                password
            }
        })
        if(res.data.status === 'Success'){
            alert('Logged in successfully')
            window.setTimeout(()=>{
                window.location.href = '/';
            },1500)
        }
    } catch (err) {
        alert(err.responce.data.message)
    }

}
document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
})