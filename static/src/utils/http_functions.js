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

export function get_room_members(room_id){
    return axios.post('/api/get_room_members',{room_id,});
}

export function send_message(room_id, content){
    return axios.post('/api/send_message',{
        room_id,
        content,
    });
}

export function get_messages(room_id){
    return axios.post('/api/get_messages',{room_id,});
}

export function modify_profile(new_username,new_email){
    return axios.post('/api/modify_profile',{new_username,new_email});
}

export function get_profile(){
    return axios.post('/api/get_profile');
}

export function change_password(old_password,new_password){
    return axios.post("/api/change_password",{old_password,new_password})
}
