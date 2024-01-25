import fs from 'fs'

const file = fs.readFileSync('./wallets.txt', 'utf-8')
const wallets = file.split('\r\n')

let founded_allocations = 0

for (let wallet of wallets) {
    await getDataFromWen(wallet.trim())
}

console.log(`Done!\nFound Allocations: ${founded_allocations} | Total Checked: ${wallets.length}`)
process.exit(0)

function formatAllocationNumber(number) {
    const normalizedNumber = parseFloat(number) / Math.pow(10, 8)
    return normalizedNumber
}

async function getDataFromWen(address) {
    let data = await fetch(`https://worker.jup.ag/jup-claim-proof/WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk/${address}`, {
    "headers": {
        "accept": "*/*",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6,zh-CN;q=0.5,zh;q=0.4",
        "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "https://lfg.jup.ag/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
    })
    switch (data.status) {
        case 200:
            let data_json = await data.text()
            try {
                data_json = JSON.parse(data_json)
            } catch (error) {
            }
            if (data_json && data_json.amount) {
                ++founded_allocations
                console.log(`Address: ${address} | Allocation: ${formatAllocationNumber(data_json.amount)}`)
            }
            break;
        default:
            console.log(`Address: ${address} | Status: ${data.status}`)
            break;
    }
}