const baseUrl = process.env.REACT_APP_API_BASE_URL;


interface Address{
  id: number
  city: string
  country: string
}

export async function getShippingAddress(userId:string) {
  return fetch(baseUrl + "shippingAddress/" + userId).then((response) => {
    if (response.ok) return response.json();
    throw response;
  });
}

export async function saveShippingAddress(address : Address) {
  return fetch(baseUrl + "shippingAddress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(address),
  });
}
