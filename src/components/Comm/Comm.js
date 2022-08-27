import EpnsSDK from "@epnsproject/backend-sdk-staging"

async function getSubs(sdk) {
  const response = await sdk.getSubscribedUsers();
  return response;
}

async function sendNotifBroadcast(sdk) {
  const response = await sdk.sendNotification(
    "0x50167ae49a1489DfE06697EA8bac6a3E8C79F2C6",
    "Test Notif Header",
    "Test Notif Message",
    "Longer Title",
    "Longer Message",
    1,
    "https://google.com",
    "https://i.postimg.cc/zGVRsSF1/image.png",
    null
  );
  return response;
}

async function sendNotifSubset(sdk, address, header, message) {
  let addr = "";
  for(let i = 0; i < address.length; i++) {
    if (i == 0)
      addr = address[i];
    else
      addr = addr + "," + address[i];
  }
  const response = await sdk.sendNotification(
    addr,
    header,
    message,
    header,
    message,
    4,
    "https://google.com",
    "https://i.postimg.cc/zGVRsSF1/image.png",
    null
  );
  return response;
}

async function sendNotifTarget(sdk) {
  const response = await sdk.sendNotification(
    process.env.REACT_APP_ADDR_1,
    "Test Notif Header",
    "Test Notif Message",
    "Longer Title",
    "Longer Message",
    3,
    "https://google.com",
    "https://i.postimg.cc/zGVRsSF1/image.png",
    null
  );
  return response;
}

const sendNotification = async (address, header, message) => {
  const CHANNEL_PK = process.env.REACT_APP_PRIVATE_KEY;
  const epnsSdk = new EpnsSDK(CHANNEL_PK);

  await sendNotifSubset(epnsSdk, address, header, message);

};


const comm = () => {
  console.log("Called comm");
  const CHANNEL_PK = process.env.REACT_APP_PRIVATE_KEY;

  const epnsSdk = new EpnsSDK(CHANNEL_PK);

  getSubs(epnsSdk).then(allSubscribers => {
    console.log("all subscribers = ", allSubscribers);
  });

  sendNotifTarget(epnsSdk).then(response => {
    console.log("response notif = ", response);
  });
  sendNotifBroadcast(epnsSdk).then(response => {
    console.log("response notif = ", response);
  });
};


export default sendNotification;
