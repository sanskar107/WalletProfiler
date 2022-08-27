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
    "https://i.postimg.cc/JzNpgJcx/image.png",
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
    "https://i.postimg.cc/JzNpgJcx/image.png",
    null
  );
  return response;
}


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


  // const allSubscribers = epnsSdk.getSubscribers()
 
  // const allSubscribers = await epnsSdk.getSubscribers();
  // const allSubscribers = getsubs(epnsSdk);
  // console.log("Subscribers = ", response);

  // const response = await epnsSdk.sendNotification(
  //   recipient=0x50167ae49a1489DfE06697EA8bac6a3E8C79F2C6,
  //   pushNotificationTitle="Test Notif Header",
  //   pushNotificationMessage="Test Notif Message",
  //   notificationTitle="Longer Title",
  //   notificationMessage="Longer Message",
  //   notificationType=1,
  //   cta="https://google.com",
  //   img="https://postimg.cc/215dL1tL",
  //   simulate=null,
  // );
  // console.log("response = ", response);

}


// const fetchData = (url, callback) => {
//   fetch(url, {
//     method: "GET",
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .then((response) => {
//       console.log(response);
//       console.log(response.data[0]);
//       callback(response);
//     });
// };

export default comm;
