class Speech
{
    constructor()
    {
        this.synth = window.speechSynthesis;

        this.inputTxt = "Hello";
        this.pitchValue = 1;
        this.rateValue = 1;
        this.volumeValue = 1;
        this.voices = [];

        this.populateVoiceList = this.populateVoiceList.bind(this);
        this.init = this.init.bind(this);
        this.speak = this.speak.bind(this);

        this.init();
    }

    populateVoiceList() {
        this.voices = this.synth.getVoices();
        /*
        this.voices = this.synth.getVoices().sort(function (a, b) {
            const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
            if ( aname < bname ) return -1;
            else if ( aname === bname ) return 0;
            else return +1;
        });
        */

        console.log("this.voices" + this.voices);
    }
    
    init()
    {
        this.populateVoiceList();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = this.populateVoiceList;
        }

        console.log("Hey");
    }

    getVoice(sName)
    {

        try
        {
            for(let i = 0; i < this.voices.length ; i++) {
                if(this.voices[i].name == sName) {
                    console.log("this.voices["+i+"].name: "+this.voices[i].name)
                    
                    return this.voices[i];
                    break;
                }
            }
        }
        catch
        {
            console.log("voice not found")
            return null;
        }
    }


    speak(sText)
    {
        if (this.synth.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }
        if (sText !== '') {
            var utterThis = new SpeechSynthesisUtterance(sText);

            console.log("utterThis: "+utterThis)
            utterThis.onend = function (event) {
                console.log('SpeechSynthesisUtterance.onend');
            }
            utterThis.onerror = function (event) {
                console.error('SpeechSynthesisUtterance.onerror');
            }
            
            var objVoice = this.getVoice("Google UK English Female");
            if(objVoice == null) objVoice = this.getVoice("Samantha");
            if(objVoice == null) objVoice = this.voices[0];

            utterThis.voiceURI = objVoice.voiceURI;
            utterThis.lang = objVoice.lang;
            
            //document.getElementById("copyright").innerHTML = objVoice.voiceURI + " " + objVoice.lang;
            
            utterThis.volume = this.volumeValue;
            utterThis.pitch = this.pitchValue;
            utterThis.rate = this.rateValue;

            console.log("utterThis.rate: "+utterThis.rate)
            this.synth.speak(utterThis);
        }
    }

}