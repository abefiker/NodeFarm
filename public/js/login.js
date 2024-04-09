import { showAlert } from './alert';
import axios from "axios"
export const login = async (email, password) => {
    console.log(email, password)
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:8080/api/v1/users/login',
            data: {
                email,
                password
            }
        })
        if (res.data.status === 'Success') {
            showAlert('Success', 'Logged in successfully')
            window.setTimeout(() => {
                window.location.href = '/';
            }, 1500)
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }

}
export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/users/logout'
        })
        if (res.data.status === 'Success') {
            showAlert('Success', 'Logged out successfully')
            location.reload(true)
        }

    } catch (err) {
        showAlert('Error', 'Error while logging out try again!')
    }
}