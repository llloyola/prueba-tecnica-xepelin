import axios from "axios";


const zapierLink = process.env.REACT_APP_ZAPIER_LINK;

const sendEmail = (idOp, rate, email) => {
    return axios.create({ transformRequest: [(data, _headers) => JSON.stringify(data)] })
        .post(zapierLink, {
            'idOp' : idOp,
            'tasa' : rate.includes('.') ? parseFloat(rate) : parseInt(rate),
            'email' : email
        }, {
            headers: {'Accept': 'application/json'}
            }
        );
}

export default sendEmail;