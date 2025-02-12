import Config from '../../config';

async function login(email: string, password: string) {
  const request = new Request(`${Config.backend}/login`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });

  try {
    const response = await fetch(request);
    const result = await response.json();
    if(result["token"]){
      window.sessionStorage.setItem("session-token", result["token"])
      window.sessionStorage.setItem("user-data", JSON.stringify(result["data"]))
    }
    return result;
  } catch (error) {
  }
}

async function signup(email: string, password: string, fullname: string, phone: string){
  const request = new Request(`${Config.backend}/signup`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ email, password, fullname, phone })
  });

  try {
    const response = await fetch(request);
    const result = await response.json();
    if(result["token"]){
      window.sessionStorage.setItem("session-token", result["token"])
      window.sessionStorage.setItem("user-data", JSON.stringify(result["data"]))
    }
      
  } catch (error) {
  }
}

function logout() {
  window.sessionStorage.removeItem("session-token");
  window.sessionStorage.removeItem("user-data");
}

function isAuthenticated(): boolean {
  if (!!window.sessionStorage.getItem("session-token")) {
    return true;
  }
  return false;
}

export { login, logout, isAuthenticated, signup };
