export async function getEmailList(){
    let url = "https://6366339879b0914b75cba9c2.mockapi.io/api/email"

    let res = await fetch(url, {
        method: "GET",
    })
    res = await res.json()
    return res;
}

export async function getEmail(id){
    let url = `https://6366339879b0914b75cba9c2.mockapi.io/api/email/${id}`

    let res = await fetch(url, {
        method: "GET",
    })
    res = await res.json()
    return res;
}