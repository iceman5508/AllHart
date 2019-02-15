/**
 * Created by iparker1 on 2/14/2019.
 * This file contains components related to the home page
 */


/**
 * This component handles the carousel that appears on each page.
 */


class latestSermon extends Component{
    constructor(){
        super();
    }

    /**
     * expecting title and text param
     * @param params
     */
    render(){

        let self = this;
        self.setTemplate(
            'views/homepage/latestSermon.html'
            ,function (data) {  self.draw('pageApp');}

        );
    }

}

class homeContent extends Component{
    constructor(){
        super();
    }

    /**
     * expecting title and text param
     * @param params
     */
    render(){

        let self = this;
        self.setTemplate(
            'views/homepage/content.html'
            ,function (data) {  self.draw('pageContent');}

        );
    }

}

let sermon = new latestSermon();
let homeCon = new homeContent();

