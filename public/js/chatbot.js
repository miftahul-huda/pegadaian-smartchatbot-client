var Chatbot =
{
    baseUrl: "http://localhost:8000/api/v1",
    session: null,
    quota: 0,
    userdata: null,
    configuration: null,
    init: function(userdata, baseUrl)
    {
        Chatbot.baseUrl = baseUrl;
        Chatbot.userdata = userdata;

        Chatbot.displayHTML().then(response=>{

            console.log("Chatbot.initTokenAndAccess start");
            Chatbot.initTokenAndAccess(userdata).then(()=>{
                console.log("Chatbot.initTokenAndAccess done");


                console.log("Chatbot.getConfig start");
                Chatbot.getConfig().then(response=>{
                    Chatbot.configuration = response.data;
                    console.log(Chatbot.configuration);
                    Chatbot.showQuota(Chatbot.configuration.maxQuestionPerSession);
                    console.log("Chatbot.getconfig done");


                    console.log("Chatbot.initEvents start");
                    Chatbot.initEvents().then(()=>{
                        console.log("Chatbot.initEvents done");
                    });
                });

            });

        }).catch(e=>{
            console.log(e);
        });

    }
    ,
    initTokenAndAccess: function(userdata)
    {
        let promise =  new Promise((resolve, reject)=>{
            Chatbot.getToken(userdata).then(response=>{
                Util.token = response.data.encoded;
                Chatbot.checkAccess(userdata).then(response=>{
                    if(response.data == true){
                        resolve();
                    }
                    else
                    {
                        console.log("Access Denied: Role pengguna " + Chatbot.userdata.role + " tidak dapat mengkases aplikasi ini");
                    }
                }).catch(e=>{
                    console.log(e);
                    console.log("Access Denied: Role pengguna " + Chatbot.userdata.role + " tidak dapat mengkases aplikasi ini");
                });
            }).catch(e=>{
                console.log(e);
            });
        })
        return promise;

    }
    ,
    initChatboxUI: function()
    {
        $(".chatbox .title").html(Chatbot.configuration.chatbotTitle)
        $(".chatbox .avatar").css("background", "url(" + Chatbot.configuration.chatbotAvatar + ") no-repeat")
        $(".chatbox .avatar").css("background-position", "center")
        $(".chatbox .avatar").css("background-size", "50% auto")

    }
    ,
    showQuota: function (quota) {
        $(".chatbox .quota-info").html("Sisa kuota: " + quota)
    }
    ,
    initEvents: function()
    {
        let promise =  new Promise((resolve, reject)=>{
            Chatbot.initChatboxUI();

            //Chatbox close
            $(".chatbox .close").on("click", function()
            {
                $(".chatbox").hide("slow");
            })

            //Chatbtn click start new session
            $("#chatBtn").on("click", function()
            {

                //start new session
               Chatbot.getNewSession().then(response=>{

                    Chatbot.session = response.data.session;
                    Chatbot.quota = response.data.quota;

                    //Initialize chatbox events
                    $(".chatbox").show("scale", { percent: 30 }, 200, function(){

                        $("#btnSend").on("click", function(){
                            Chatbot.sendChat();
                        })

                        $("#chatText").on("keyup", function()
                        {
                            if (event.key === 'Enter') {
                                // Code to execute when Enter key is pressed
                                Chatbot.sendChat();
                            }
                        })
                    });
                })
            })
        })
        return promise;
    }
    ,
    displayHTML: function()
    {
        let promise =  new Promise((resolve, reject)=>{

            resolve();
        })
        return promise;
    }
    ,
    getToken: async function(userdata)
    {
        let promise =  new Promise((resolve, reject)=>{
            try{ 
                let url = Chatbot.baseUrl + "/util?command=encode";
                console.log(url)
                console.log(userdata)
                Util.post(url, userdata).then(data=>{
                    console.log("encoded");
                    console.log(data);
                    resolve(data);
                }).catch(e=>{
                    reject(e);
                });
            }
            catch(e) {
                reject(e);
            }
        })
        return promise;
    }
    ,
    getConfig: async function()
    {
        let promise =  new Promise((resolve, reject)=>{
            try{ 
                let url = Chatbot.baseUrl + "/configuration";
                Util.get(url).then(data=>{
                    resolve(data);
                }).catch(e=>{
                    reject(e);
                });
            }
            catch(e) {
                reject(e);
            }
        })
        return promise;
    }
    ,
    checkAccess: async function(userdata)
    {
        let role = userdata.role;
        let promise = new Promise((resolve, reject)=>{
            let url = Chatbot.baseUrl + "/app-access/check?role=" + role + "&app=smart-chatbot";
            //let url = Chatbot.baseUrl + "/app-access?role=" + role;

            Util.get(url, {}).then(response=>{
                resolve(response)
            })
        });
        return promise;
    }
    ,
    getNewSession: async function()
    {
        let promise =  new Promise((resolve, reject)=>{
            try{ 
                let url = Chatbot.baseUrl + "/session/new";
                Util.get(url).then(data=>{
                    resolve(data);
                }).catch(e=>{
                    reject(e);
                });
            }
            catch(e) {
                reject(e);
            }
        })
        return promise;
    }
    ,
    sendChat: async function()
    {
        let promise =  new Promise((resolve, reject)=>{
            let q=  $("#chatText").val();
            $("#chatText").val("");

            /*
            let url = Chatbot.baseUrl + "/se";
            send(q, function(response){

            });*/
        })
        return promise;
    }

}