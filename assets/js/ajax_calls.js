

function loadJobRecommendations(){
    $(document).ready(function(){
        //Perform Ajax request.
        $.ajax({
            url: '/jobs/get-candidate-job-recommendations',
            type: 'get',
            
            success: function(data){
                //If the success function is execute,
                //then the Ajax request was successful.
                //Add the data we received in our Ajax
                //request to the "content" div.
    
                console.log(data)
                //$('#content').html(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var errorMsg = 'Ajax request failed: ' + xhr.responseText;
                console.log(errorMsg)
            }
        });
    });
}