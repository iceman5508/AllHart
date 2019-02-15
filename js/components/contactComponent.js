/**
 * Created by iparker1 on 2/15/2019.
 */
class contactContent extends Component {
    constructor() {
        super();
    }

    /**
     * expecting title and text param
     * @param params
     */
    render() {

        let self = this;
        self.setTemplate(
            'views/contact/contactContent.html'
            , function (data) {
                document.getElementById('pageApp').innerHTML='';
                self.draw('pageContent');
            }
        );
    }
}


let contactCon = new contactContent();

