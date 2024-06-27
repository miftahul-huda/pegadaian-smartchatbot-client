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
    chatHistory: [],
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
            console.log("getToken")
            Chatbot.getToken(userdata).then(response=>{
                Util.token = response.data.encoded;
                console.log("checkAccess")
                Chatbot.checkAccess(userdata).then(response=>{
                    console.log(response)
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
            $(".chatbtn").on("click", function()
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

                        Chatbot.openChatbox(Chatbot.clearContent);
                    })

                }
                else
                {
                    Chatbot.openChatbox();
                }
            });

            $(".btn-new-session").on("click", function(){
                    //start new session
                    Chatbot.getNewSession().then(response=>{

                        console.log("chatbot session")
                        console.log(response)

                        Chatbot.session = response.data.session;
                        Chatbot.quota = response.data.quota;

                        console.log("chatbot session")
                        console.log(Chatbot.session)

                        Chatbot.openChatbox(Chatbot.clearContent);
                    })
                
            })




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
    clearContent: function()
    {
        $(".chatbox .content").html("")
        Chatbot.showQuota(Chatbot.quota)
    }
    ,
    openChatbox: function(callback)
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

            if(callback != null)
                callback();
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
                            Cari Petunjuk
                        </div>
                        <div class="separator">
        
                        </div>
                        <div class="chat-type-query chat-type-generic" data="semantic-query">
                            Analisis Data
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
            console.log("CheckAccess.url")
            console.log(url)
            Util.get(url, {}).then(response=>{
                resolve(response)
            }).catch((e)=>{
                console.log(e)
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

            if(q.trim() == "")
                alert("Teks chat harus diisi")
            else if(Chatbot.quota == 0)
                alert("Kuota pertanyaan telah habis")
            else
            {
                let chatItem = Chatbot.createChatItem("me", q);
                $(".chatbox .content").append(chatItem);
    
                let url = Chatbot.baseUrl + Chatbot.getSearchUrl(Chatbot.chatType) + "?session=" + Chatbot.session;
                let data = {
                    query: q,
                    history: this.chatHistory
                }
                console.log(url);
                console.log(data);
                let chatWaiting = Chatbot.createChatWaiting();
                $(".chatbox .content").append(chatWaiting);
    
                Chatbot.scrollToBottom();
    
                Util.post(url, data).then((response)=>{
                    let text = response.data.response;
                    let resp = JSON.parse(text);

                    Chatbot.quota = response.data.quota;
                    chatItem = Chatbot.createChatItem("bot", resp, function(answer){
                        Chatbot.chatHistory.push([q, answer])
                    });
                    Chatbot.showQuota(Chatbot.quota);
    
                    $('.chat-waiting-animation').remove();
                    $(".chatbox .content").append(chatItem);
                    //Chatbot.scrollToBottom();
                }).catch((e)=>{
                    console.log(e)
                    $('.chat-waiting-animation').remove();
                    alert("Error. Tidak bisa mendapatkan respons dari bot.")

                })
            }
  
        });
        return promise;
    }
    ,
    createChatItem: function(itemType, response, callback)
    {
        let text = "";
        let htmlTable = null;
        if(itemType == "me")
            text = response;
        else
        {
            if(response.result.penjelasan != null)
            {
                text = response.result.penjelasan
                let data = response.result.table;
                if(data != "None")
                {
                    data = Chatbot.tableDataToJson(data);
                    htmlTable = Chatbot.createTableFromJSON(data);
                }

            }
            else
            {
                text= response.result;
            }
        }

        if(callback != null)
            callback(text);

        text = text.replace(/\n/g, "<br>");
        newText = text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
        newText = newText.replace(/\*/g, '-');

        if(htmlTable != null)
        {
            newText = "<div>" + newText + "</div><div class='vseparator'></div><div class='chat-item-table-container'>" + htmlTable.outerHTML + "</div>";

        }

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
    ,
    tableDataToJson: function(tableText) {
        const rows = tableText.trim().split("\n"); // Split into rows
        const headers = rows[0].split("|").map(h => h.trim()); // Extract headers
        const jsonData = [];
      
        for (let i = 2; i < rows.length; i++) { // Start from 2nd row (data)
          const rowData = rows[i].split("|").map(c => c.trim());
      
          const rowObject = {};
          for (let j = 0; j < headers.length; j++) {
            rowObject[headers[j]] = rowData[j];
          }
          jsonData.push(rowObject);
        }
      
        return jsonData; // Convert array to JSON string
    }
    ,
    createTableFromJSON: function(jsonData, tableId = "myTable") {
        console.log("json data")
        console.log(jsonData)
        // Validate input
        if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
          throw new Error("Invalid JSON data provided.");
        }
      
        // Create table element
        const table = document.createElement("table");
        table.id = tableId;
      
        // Extract headers from the first data object
        const headers = Object.keys(jsonData[0]);
      
        // Create table header row
        const headerRow = table.insertRow();
        headers.forEach((headerText) => {
          const header = document.createElement("th");
          $(header).css("border" , "solid 1px #ccc")
          header.textContent = headerText;
          headerRow.appendChild(header);
        });
      
        // Create table data rows
        jsonData.forEach((dataObject) => {
          const row = table.insertRow();
          headers.forEach((header) => {
            const cell = row.insertCell();
            $(cell).css("border" , "solid 1px #ccc")
            cell.textContent = dataObject[header] ?? ""; // Handle undefined values
          });
        });
      
        //$(table).css("border" , "solid 1px #ccc")
        $(table).css("border-spacing" , "0pt")
        $(table).css("font-size" , "10pt")

        return table; // Return the created table element
    }
      

}