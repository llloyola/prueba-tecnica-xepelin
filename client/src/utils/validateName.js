const validateName = name => {
    const re = /^[a-zA-Z]+( [a-zA-Z]+)*$/;
    return re.test(name);
}

export default validateName;