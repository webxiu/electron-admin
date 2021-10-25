const login_key = '__loginInfo';
const user_key = '__user_key';

/** 保存用户名和密码 */
export const getLoginInfo = () => JSON.parse(localStorage.getItem(login_key) || '{}');
export const setLoginInfo = (loginInfo: string) => localStorage.setItem(login_key, loginInfo);
export const removeLoginInfo = () => localStorage.removeItem(login_key);

/** 用户信息(包含token) */
export const getUserInfo = () => JSON.parse(localStorage.getItem(user_key) || '{}');
export const setUserInfo = (userInfo: string) => localStorage.setItem(user_key, userInfo);
export const removeUserInfo = () => localStorage.removeItem(user_key);
