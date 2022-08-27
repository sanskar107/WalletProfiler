import requests

API_KEY = "97C8YM2Z5RMV6UZSR4ZUK5RASYWPVMR8T4"
address = "0x9277ba9fc17E8eA062b3Da52497f52e98792f3c6"
address_haq = "0x844B800c8F0686d29Ab302e0f9CD78468432e97F"
req = "https://api.etherscan.io/api?module=account&action=balance&address=" + address_haq + "&tag=latest&apikey=" + API_KEY


module = "account"
action = "txlist"
contract_address_uniswap = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984".lower()  # uniswap
contract_address_sushi = "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2".lower()  # sushi
contract_address_pancake = "0xCb039d11Fd38167de19536453a105271A5e44392".lower()  # pancake
contract_address_quick = "0x6c28AeF8977c9B773996d0e8376d2EE379446F2f"  # quick swap
contract_address = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"  # aave

startblock = 10000000
endblock = 15422121
page = 1
offset = 2000
sort = "desc"

req = f"https://api.etherscan.io/api?module={module}&action={action}&address={contract_address}&startblock={startblock}&endblock={endblock}&page={page}&offset={offset}&sort={sort}&apikey={API_KEY}"

x = requests.get(req).json()
res = x['result']

# print(f"request = {req}")
# print(len(res))
# print(res[0].keys())

wallets = []

for i in range(len(res)):
    wallets.append(res[i]['from'].lower())
    wallets.append(res[i]['to'].lower())

wallets = list(set(wallets))
if contract_address in wallets:
    wallets.remove(contract_address)

f = open("wallets_aave.txt", 'w')
for w in wallets:
    f.write(w)
    f.write('\n')
f.close()

print(f"written {len(wallets)}")
