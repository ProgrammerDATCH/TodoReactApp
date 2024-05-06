export const validateName = (name) => {
    const nameRegex = /^(?![0-9])[a-zA-Z0-9]{5,}$/;
    return nameRegex.test(name);
  }
  
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  
export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return passwordRegex.test(password);
  }
  
export const checkPasswordsEquality = (firstPassword, secondPassword) => {
    return firstPassword === secondPassword;
}