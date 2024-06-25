var Util = 
{
    token: "",
    get: function(url, headers={})
    {
      console.log("Util.get")
      console.log(Util.token)
      let promise = new Promise((resolve, reject)=>{
          $.ajax({
            url: url,
            type: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Util.token,
              ...headers      
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
    post: function(url, data, headers={})
    {
      console.log(Util.token)

      let promise = new Promise((resolve, reject)=>{
          $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Util.token,
              ...headers
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
    put: function(url, data, headers={})
    {
      let promise = new Promise((resolve, reject)=>{
          $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Util.token,
              ...headers
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
    delete: function(url, headers={})
    {
      let promise = new Promise((resolve, reject)=>{
          $.ajax({
            url: url,
            type: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Util.token,
              ...headers
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
    post2: function(url, data, headers)
    {

      console.log("Data to send")
      console.log(data)
      let promise = new Promise((resolve, reject)=>{
          $.ajax({
            url: url,
            type: 'POST',
            data: data,
            headers: headers,
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