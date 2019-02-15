/**
 * Created by iparker1 on 2/14/2019.
 * This file contains components related to the home page
 */


/**
 * This component handles the carousel that appears on each page.
 */


class sermonContent extends Component{
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
            'views/sermon/sermonContent.html'
            ,function (data) {  self.draw('pageContent');}

        );
    }

}

let sermonCon = new sermonContent();

