class Speech
{
    constructor()
    {
        this.synth = window.speechSynthesis;

        this.inputTxt = "Hello";
        this.pitchValue = 1;
        this.rateValue = 1;
        this.voices = [];

        this.populateVoiceList = this.populateVoiceList.bind(this);
        this.init = this.init.bind(this);
        this.speak = this.speak.bind(this);

        this.init();
    }

    populateVoiceList() {
        this.voices = this.synth.getVoices().sort(function (a, b) {
            const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
            if ( aname < bname ) return -1;
            else if ( aname === bname ) return 0;
            else return +1;
        });

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
            var selectedOption = "Google US English"
            for(let i = 0; i < this.voices.length ; i++) {
                if(this.voices[i].name === selectedOption) {
                    console.log("this.voices["+i+"].name: "+this.voices[i].name)
                    utterThis.voice = this.voices[i];
                    break;
                }
            }
            utterThis.pitch = this.pitchValue;
            utterThis.rate = this.rateValue;

            console.log("utterThis.rate: "+utterThis.rate)
            this.synth.speak(utterThis);
        }
    }

}