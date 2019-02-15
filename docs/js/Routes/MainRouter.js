/**
 * Created by iparker1 on 2/14/2019.
 */
function changeActive() {

    let current = frameless.clicked_element.parentNode;
    let previous = frameless.previous_clicked.parentNode;

    if(current == 0 || !current ){

    }else{
        current.classList.add("active");
        previous.classList.remove('active');
    }

}

frameless.Router.add('/about', function (params) {
    carousel.render({title:'About US' , text:'Learn More About our AMAZING CHURCH!'});
    aboutApp.render();
    aboutCon.render();

    changeActive();
    console.log('about');

}).add('/sermon',function (params) {  //default home router
    carousel.render({title:'Sermons' , text:'Listen to the word of GOD given by a child of GOD!'});
    sermon.render();
    sermonCon.render();
    changeActive();
    console.log('sermon');


}).add('/events',function (params) {  //default home router
    carousel.render({title:'Events' , text:'Join us as we contribute to our communities!'});
    eventApp.render();
    eventCon.render();
    changeActive();
    console.log('events');


}).add('/contact',function (params) {  //default home router
    carousel.render({title:'Contact' , text:'Contact US!'});
    contactCon.render();
    changeActive();
    console.log('contact');


}).add('/',function (params) {  //default home router
    carousel.render({title:'Home' , text:'We lead, love and worship with ALL of our HEART!'});
    sermon.render();
    homeCon.render();

    changeActive();
    console.log('home');


}).run();


