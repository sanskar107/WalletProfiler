import EpnsSDK from "@epnsproject/backend-sdk-staging"

const comm = () => {
  console.log("Called comm");
  console.log(process.env.REACT_APP_PRIVATE_KEY);

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
