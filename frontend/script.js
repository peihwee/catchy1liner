const objSpeech = new Speech();
objSpeech.init();

document.getElementById("another").onclick = () => { GetRandomQuote(); };
document.getElementById("trigger").onclick = () => { objSpeech.speak(document.getElementById("quote").innerHTML + " -" + document.getElementById("author").innerHTML); };

function WaitAwhile(delay) 
{
    return function(response)
    {
        return new Promise(resolve => {
            setTimeout(() => resolve(response), delay)
        });
    };
}

function GetRandomQuote()
{
    //axios.get('https://catchy1liner.herokuapp.com/api/quote', {})
    axios.get('https://catchy1liner.azurewebsites.net/api/quote', {})
    .then((response) => {
        console.log(response.data); //View in Browser's Developer Tools

        document.getElementById("quote").innerHTML = response.data[0].quote;
        document.getElementById("author").innerHTML = response.data[0].author;
        document.getElementById('trigger').click();
    })
    .catch(function (error) {
        document.getElementById("quote").innerHTML = error;
    });
}

window.onload = (event) => {
    console.log('page is fully loaded');
    //setTimeout(GetRandomQuote, 200); 
};