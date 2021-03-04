/* eslint camelcase: 0 */

import axios from 'axios';

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token, // eslint-disable-line quote-props
    },
});

export function validate_token(token) {
    return axios.post('/api/is_token_valid', {
        token,
    });
}

export function get_github_access() {
    window.open(
        '/github-login',
        '_blank' // <- This is what makes it open in a new window.
    );
}

export function create_user(email, password, username) {
    return axios.post('/api/create_user', {
        email,
        password,
        username,
    });
}

export function get_token(email, password) {
    return axios.post('/api/get_token', {
        email,
        password,
    });
}

export function has_github_token(token) {
    return axios.get('/api/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get('/api/user', tokenConfig(token));
}

export function get_chatrooms(){
    return axios.get('/api/get_chatrooms');
}

export function send_message(room_id, content){
    return axios.post('/api/send_message',{
        room_id,
        content,
    });
}

// export function get_messages(room_id){
//     return axios.get('/api/get_messages',{room_id,});
// }

//  incoming["tag"] 应该是这边的

export function get_suggestions(query_tag){
    return axios.post('/api/get_suggestions',{
        query_tag
    });
}