var Chatbot =
{
    baseUrl: "http://localhost:8000/api/v1",
    session: null,
    quota: 0,
    userdata: null,
    configuration: null,
    chatType: 'auto',
    searchUrls: null,
    firstStart: true,
    //Init Chatbox
    init: function(userdata, baseUrl)
    {
        Chatbot.searchUrls = [ { type: 'auto', url: '/semantic-auto' },  
        { type: 'semantic-search', url: '/semantic-search' } ,  
        { type: 'semantic-query', url: '/semantic-query'} ];

        Chatbot.baseUrl = baseUrl;
        Chatbot.userdata = userdata;


        console.log("Chatbot.initTokenAndAccess start");
        Chatbot.initTokenAndAccess(userdata).then(()=>{
            console.log("Chatbot.initTokenAndAccess done");
            console.log("Chatbot.getConfig start");
            Chatbot.getConfig().then(response=>{

                Chatbot.configuration = response.data;
                console.log(Chatbot.configuration);

                Chatbot.displayHTML().then(response=>{
                    console.log("Chatbot.displayHTML done");


                    Chatbot.showQuota(Chatbot.configuration.maxQuestionPerSession);
                    console.log("Chatbot.getconfig done");


                    console.log("Chatbot.initEvents start");
                    Chatbot.initEvents().then(()=>{
                        console.log("Chatbot.initEvents done");
                    });

                });

            });
        });

    }
    ,
    //Init Token and Check access for this user
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
    //Init chatbox UI based on configuration
    initChatboxUI: function()
    {
        $(".chatbox .title").html(Chatbot.configuration.chatbotTitle)
        $(".chatbox .avatar").css("background", "url(" + Chatbot.configuration.chatbotAvatar + ") no-repeat")
        $(".chatbox .avatar").css("background-position", "center")
        $(".chatbox .avatar").css("background-size", "50% auto")

    }
    ,
    // Show Quota in the Chatbox
    showQuota: function (quota) {
        $(".chatbox .quota-info").html("Sisa kuota: " + quota)
    }
    ,
    // Init chatbox events, i.e, send button click, new session click, etc
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

                if(Chatbot.firstStart)
                {
                    //start new session
                    Chatbot.getNewSession().then(response=>{

                        console.log("chatbot session")
                        console.log(response)

                        Chatbot.session = response.data.session;
                        Chatbot.quota = response.data.quota;

                        console.log("chatbot session")
                        console.log(Chatbot.session)

                        Chatbot.openChatbox();
                    })

                }
                else
                {
                    Chatbot.openChatbox();
                }
            });




            $(".chat-type-generic").on("click", function(){
                $(".chat-type-generic").removeClass("chat-type-selected");                
                let data = $(this).attr("data")
                $(this).addClass("chat-type-selected");
                Chatbot.chatType = data;
            })

            $(".chat-type-generic")[0].click();


        })
        return promise;
    }
    ,
    openChatbox: function()
    {
        //Initialize chatbox events
        $(".chatbox").show("scale", { percent: 30 }, 200, function(){

            $("#btnSend").off("click");
            $("#btnSend").on("click", function(){
                Chatbot.sendChat();
            })

            $("#chatText").off("keyup");
            $("#chatText").on("keyup", function()
            {
                if (event.key === 'Enter') {
                    // Code to execute when Enter key is pressed
                    Chatbot.sendChat();
                }
            })
        });
    }
    ,
    displayHTML: function()
    {
        let promise =  new Promise((resolve, reject)=>{
            let html = `
            <div class="chat-container">
            
                <div class="chatbox">
                    <div class="header">
                        <div class="avatar"></div>
                        <div class="title">Smart Assistance</div>
                        <div class="clear btn-new-session"></div>
                        <div class="close"></div>
                    </div>
                    <div class="subheader">
                        <div class="quota-info">Quota remaining: 10</div>
                    </div>
                    <div class="content">
        
        
                    </div>
                    <div class="chat-type-container">
                        <div class="chat-type-auto chat-type-generic" data="auto">
                            Auto
                        </div>
                        <div class="separator">
        
                        </div>
                        <div class="chat-type-search chat-type-generic" data="semantic-search">
                            Search content
                        </div>
                        <div class="separator">
        
                        </div>
                        <div class="chat-type-query chat-type-generic" data="semantic-query">
                            Analysis
                        </div>
                    </div>
                    <div class="footer">
                        <div class="separator">
        
                        </div>
                        <div class="separator">
        
                        </div>
                        <div class="text-input">
                            <input type="text" id="chatText" />
                        </div>
                        <div class="separator">
        
                        </div>
                        <div id="btnSend" class="sendbtn">
        
                        </div>
        
                    </div>
                </div>
    
                <div id="btnChat" class="chatbtn">
                    <div class="icon">
        
                    </div>
                    <div style="width: 20px;">
        
                    </div>
                    <div id="chatBtn" class="text">
                        Chat with me
                    </div>
                </div>
            </div>
            `;
            $(document.body).append(html);
            resolve();
        })
        return promise;
    }
    ,
    //Get Bearer Token from the server for user data
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
    //Get application configuration
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
    //Check if user role have access to this app
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
    //Get new chat session. Each session has 10 quota of conversation.
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

            let chatItem = Chatbot.createChatItem("me", q);
            $(".chatbox .content").append(chatItem);

            let url = Chatbot.baseUrl + Chatbot.getSearchUrl(Chatbot.chatType) + "?session=" + Chatbot.session;
            let data = {
                query: q
            }
            console.log(url);
            console.log(data);
            let chatWaiting = Chatbot.createChatWaiting();
            $(".chatbox .content").append(chatWaiting);

            Chatbot.scrollToBottom();

            Util.post(url, data).then((response)=>{
                let text = response.data.response;
                chatItem = Chatbot.createChatItem("bot", text);
                Chatbot.showQuota(response.data.quota);

                $('.chat-waiting-animation').remove();
                $(".chatbox .content").append(chatItem);
                //Chatbot.scrollToBottom();
            })
  
        });
        return promise;
    }
    ,
    createChatItem: function(itemType, text)
    {
        text = text.replace(/\n/g, "<br>");
        newText = text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
        newText = newText.replace(/\*/g, '-');

        let html = "<div class='chat-item-" + itemType + "'>" + newText + "</div><div class='vseparator'></div>";
        return html;
    }
    ,
    createChatWaiting: function()
    {

        let html = "<div class='chat-waiting-animation'></div>";
        return html;
    }
    ,
    getSearchUrl: function(chatType)
    {
        for(let i = 0; i < Chatbot.searchUrls.length; i++)
        {
            if(Chatbot.searchUrls[i].type == chatType)
                return Chatbot.searchUrls[i].url;
        }

        return "";
    }
    ,
    scrollToBottom: function() {
        $('.chatbox > .content').scrollTop($('.chatbox > .content')[0].scrollHeight);
    }

}