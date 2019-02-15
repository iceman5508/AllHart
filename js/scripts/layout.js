/****************the header and footer layouts*************/
class headerComponent extends Component{
    constructor(params){
        super(params);
        let header = this;
        this.setTemplate(
            'views/layout/header.html'
            ,function (data) {
                header.draw('navMenu');
            }

        )
    }


}

class footerComponent extends Component{
    constructor(params){
        super(params);
        let footer = this;


        this.setTemplate(
            'views/layout/footer.html'
            ,function (data) {
                footer.draw('footerMenu');

            }

        )

    }

}


class pageHeader extends Component{
    constructor(){
        super();
    }

    /**
     * expecting title and text param
     * @param params
     */
    render(params){

        let self = this;

        self.setTemplate(
            'views/pageHeader.html'
            ,function (data) {  self.draw('pageHeader');   window.scrollTo(0, 0);}
            ,params
        );
    }

}


 new footerComponent();
 new headerComponent();
let carousel = new pageHeader();