const token = '7mpebaoqdbfoug89';
const instanceId = 'instance188886';

export const sendWhatAppsMessage = (phone: string, message: string) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
            urlencoded.append("token", token);
            urlencoded.append("to", phone);
            urlencoded.append("body", message);

            fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            }).catch((error)=>{
                console.log(error)
            })
    } catch (error) {
        console.log(error);
    }
}