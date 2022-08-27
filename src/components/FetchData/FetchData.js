const fetchData = (url, callback) => {
  fetch(url, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log(response);
      console.log(response.data[0]);
      callback(response);
    });
};

export default fetchData;
