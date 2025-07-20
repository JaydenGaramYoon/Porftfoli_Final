import { signout } from "./api-auth.js";
const auth = {
  isAuthenticated() {
    if (typeof window == "undefined") return false;
    try {
      if (localStorage.getItem("jwt"))
        return JSON.parse(localStorage.getItem("jwt"));
      else return false;
    } catch (err) {
      // JSON 파싱 에러가 발생하면 localStorage를 정리하고 false 반환
      console.warn('Invalid JWT token in localStorage, clearing...', err);
      localStorage.removeItem("jwt");
      return false;
    }
  },
  authenticate(jwt, cb) {
    if (typeof window !== "undefined")
      localStorage.setItem("jwt", JSON.stringify(jwt));
    cb();
  },
  clearJWT(cb) {
    if (typeof window !== "undefined") {
      // JWT 토큰 제거
      localStorage.removeItem("jwt");
      // 혹시 sessionStorage에도 있다면 제거
      sessionStorage.removeItem("jwt");
      // 기타 사용자 관련 데이터도 제거 (필요시)
      localStorage.removeItem("userId");
      localStorage.removeItem("userInfo");
    }
    cb(); //optional
    signout().then((data) => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  },
  updateUser(user, cb) {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("jwt")) {
        let auth = JSON.parse(localStorage.getItem("jwt"));
        auth.user = user;
        localStorage.setItem("jwt", JSON.stringify(auth));
        cb();
      }
    }
  },
  // 디버깅을 위한 함수 추가
  getStoredJWT() {
    if (typeof window !== "undefined" && localStorage.getItem("jwt")) {
      return JSON.parse(localStorage.getItem("jwt"));
    }
    return null;
  },
  getCurrentUserId() {
    const jwt = this.isAuthenticated();
    return jwt ? jwt.user._id : null;
  },
  clearStorage() {
    if (typeof window !== "undefined") {
      // 모든 localStorage 데이터 제거
      localStorage.clear();
      // 모든 sessionStorage 데이터 제거
      sessionStorage.clear();
      // 쿠키도 제거
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log('All storage cleared');
    }
  },
  // 완전한 로그아웃 함수 추가
  completeLogout(cb) {
    this.clearStorage();
    signout().then((data) => {
      console.log('Logout completed');
      if (cb) cb();
    });
  },
};
export default auth;
