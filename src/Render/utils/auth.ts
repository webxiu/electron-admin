const LOGIN_KEY = '__LOGIN_INFO__';
const USER_KEY = '__USER_KEY__';

/** 保存用户名和密码 */
export const getLoginInfo = () => JSON.parse(localStorage.getItem(LOGIN_KEY) || '{}');
export const setLoginInfo = (loginInfo: string) => localStorage.setItem(LOGIN_KEY, loginInfo);
export const removeLoginInfo = () => localStorage.removeItem(LOGIN_KEY);

/** 用户信息(包含token) */
export const getUserInfo = () => JSON.parse(localStorage.getItem(USER_KEY) || '{}');
export const setUserInfo = (userInfo: string) => localStorage.setItem(USER_KEY, userInfo);
export const removeUserInfo = () => localStorage.removeItem(USER_KEY);
