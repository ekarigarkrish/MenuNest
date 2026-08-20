
const instanceId = 'instance188886'
const token = '7mpebaoqdbfoug89'

export const sendWhatsAppMessage =async (phone, message) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
        urlencoded.append("token", token);
        urlencoded.append("to", phone);
        urlencoded.append("body", message);

        fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow"
        }).then().catch(error => {
            console.log('send whats app error -->', error.message)
            throw error
        })

    } catch (error) {
        console.log('send whats app error -->', error.message)
        throw error
    }
}
