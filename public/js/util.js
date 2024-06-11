var Util = 
{
    token: "aaaaaaaaaaaaaaaaaaaaaa",
    get: function(url)
    {
      console.log("Util.get")
      console.log(Util.token)
      let promise = new Promise((resolve, reject)=>{
          $.ajax({
            url: url,
            type: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Util.token         
            }
            ,
            success: function(data) {
              // Handle the response data here
              console.log(data);
              resolve(data)
            },
            error: function(jqXHR, textStatus, errorThrown) {
              // Handle errors here
              console.error("Error:", textStatus, errorThrown);
              console.log(errorThrown)

              reject()
            }
          });
      })
      return promise;
    }
    ,
    post: function(url, data)
    {
      console.log(Util.token)
      let promise = new Promise((resolve, reject)=>{
          $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Util.token
            },
            success: function(data) {
              // Handle the response data here
              console.log(data);
              resolve(data)
            },
            error: function(jqXHR, textStatus, errorThrown) {
              // Handle errors here
              console.error("Error:", textStatus, errorThrown);
              reject(data)
            }
          });
      })
      return promise;
    }
    ,
    put: function(url, data)
    {
      let promise = new Promise((resolve, reject)=>{
          $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Util.token
            },
            success: function(data) {
              // Handle the response data here
              console.log(data);
              resolve(data)
            },
            error: function(jqXHR, textStatus, errorThrown) {
              // Handle errors here
              console.error("Error:", textStatus, errorThrown);
              reject(data)
            }
          });
      })
      return promise;
    }
    ,
    delete: function(url)
    {
      let promise = new Promise((resolve, reject)=>{
          $.ajax({
            url: url,
            type: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Util.token
            },
            success: function(data) {
              // Handle the response data here
              console.log(data);
              resolve(data)
            },
            error: function(jqXHR, textStatus, errorThrown) {
              // Handle errors here
              console.error("Error:", textStatus, errorThrown);
              reject(data)
            }
          });
      })
      return promise;
    }
    
}