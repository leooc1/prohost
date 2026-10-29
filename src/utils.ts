export function setCookie(name: string, value: string, hours: number) {
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}; secure; samesite=strict`;
}

export function getCookieValid(name: string) {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
  if (token) return { logged: true, token };
  else return { logged: false, token: null };
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;
}

export function countDiaria(check_in: string, check_out: string) {
  return Math.max(
    1,
    Math.round((Date.parse(check_out) - Date.parse(check_in)) / 86_400_000),
  );
}

export const options = {
  get(token?: string) {
    return {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
  },
  post(body: Record<string, any>, token?: string) {
    return {
      method: 'POST',
      body: JSON.stringify({ ...body }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
  },
  put(body: Record<string, any>, token?: string) {
    return {
      method: 'PUT',
      body: JSON.stringify({ ...body }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
  },
  delete(token?: string) {
    return {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
  },
};
