$(document).ready(() => {
    let ScrapeButton = $("#scrape")
    let Input = $("#input")

    //@ts-ignore ;-;
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    ScrapeButton.click(() => {
        let val = Input.val()
        $("#inputCSS").addClass("disabled")
        $("#scrape").addClass("loading")
        const validateUrl = (value: string) => {
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
        }
        const SendErr = (txt, title) => {
            $("#inputCSS").removeClass("disabled")
            $("#scrape").removeClass("loading")
            return toastr.error("Please specify correct URL", "Invalid URL")
        }
        if(!val || val === "" || !validateUrl(val))return SendErr("Please specify correct URL", "Invalid URL")

        //Time to Scrape ;-;
        console.log(val)
        $.ajax({
            url: "/scrape",
            type: "POST",
            beforeSend: (xhr) => {xhr.setRequestHeader('url', val)},
            success: (d) => {
                if(d.error){
                    toastr.error("Some error occured on Server Side, Please try again", "Unable to Scrape");
                }else if(d.url){
                    toastr.success("Successfully Scraped", "Successfully scraped data and made URL")
                }
                $("#inputCSS").removeClass("disabled")
                $("#scrape").removeClass("loading")
                $("#DownloadingArea").html(`
                <h2 class="ui icon inverted header" style="font-family: 'Balsamiq Sans', cursive;margin-top: 4px;">
                <i class="settings icon"></i>
                <div class="content">
                  Download
                  <div class="sub inverted header" style="font-family: 'Balsamiq Sans', cursive;margin-top: 4px;">Successfully scraped ${val}!, Download it using below button</div>
                </div>
            </h2>
            <br>
            <button id="scrape" class="ui violet right labeled icon button" onclick="window.location = '/${d.url}'">
                <i class="download icon"></i>
                Download
            </button>
            <button id="scrape" class="ui grey right labeled icon button" onclick="window.location = 'https://github.com/greentreeteam/webscraper'">
                <i class="github icon"></i>
                GitHub
            </button>`)
            }
        });
    })
})