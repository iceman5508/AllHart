/**
 * Created by iparker1 on 2/14/2019.
 * This file contains components related to the home page
 */


/**
 * This component handles the carousel that appears on each page.
 */


class testimonies extends Component{
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
            'views/event/testimonies.html'
            ,function (data) {  self.draw('pageApp');}

        );
    }

}

class eventContent extends Component{
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
            'views/event/eventContent.html'
            ,function (data) {  self.draw('pageContent');}

        );
    }

}

let eventApp = new testimonies();
let eventCon = new eventContent();

