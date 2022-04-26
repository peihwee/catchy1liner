const objSpeech = new Speech();
objSpeech.init();

document.getElementById("another").onclick = () => { GetRandomQuote(); };

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
    axios.get('http://localhost:3000/api/quote', {})
    .then((response) => {
        console.log(response.data); //View in Browser's Developer Tools

        document.getElementById("quote").innerHTML = response.data[0].quote;
        document.getElementById("author").innerHTML = response.data[0].author;

        objSpeech.speak(response.data[0].quote + " -" + response.data[0].author);
    })
    .catch(function (error) {
        document.getElementById("quote").innerHTML = error;
    });
}

window.onload = (event) => {
    console.log('page is fully loaded');
    //setTimeout(GetRandomQuote, 200); 
};