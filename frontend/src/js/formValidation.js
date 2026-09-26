export function validateRegisterForm(formData){
    const errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(!formData.username || formData.username.trim().length < 1){
        errors.username = "Username has to be at least 1 character."
    }

    if(!formData.password || formData.password.trim().length < 1){
        errors.password = "Password has to be at least 1 character."
    }

    if(!formData.first_name || formData.first_name.trim().length < 1){
        errors.first_name = "First Name has to be at least 1 character."
    }

    if(!formData.last_name || formData.last_name.trim().length < 1){
        errors.last_name = "Last Name has to be at least 1 character."
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = 'Invalid email.'
    }

    if(!formData.phone || formData.phone.trim().length < 8){
        errors.phone = "Phone has to be at least 8 numbers."
    }

    return errors
}

export function validateLoginForm(formData){
    const errors = {}

    if(!formData.username || formData.username.trim().length < 1){
        errors.username = "Username has to be at least 1 character."
    }

    if(!formData.password || formData.password.trim().length < 1){
        errors.password = "Password has to be at least 1 character."
    }

    return errors
}