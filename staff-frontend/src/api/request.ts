import API from './axios';

export async function getRequest<T>(url: string): Promise<T> {
  const res = await API.get<T>(url);
  return res.data;
}

export async function postRequest<T, R = unknown>(url: string, data: R): Promise<T> {
  const res = await API.post<T>(url, data);
  return res.data;
}

export async function putRequest<T, R = unknown>(url: string, data: R): Promise<T> {
  const res = await API.put<T>(url, data);
  return res.data;
}

export async function deleteRequest<T>(url: string): Promise<T> {
  const res = await API.delete<T>(url);
  return res.data;
}
