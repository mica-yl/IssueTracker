const root=document.getElementsByClassName('root')[0];
let component=<div name='X'>
    <h1 className='head'>Hello world!</h1>
    <HelloPeople/>
    </div>;
let people=['mikel','john','jain'];
function HelloPeople(){
    let msg=people.map(p => `hello ${p}!`).join(' ');
    return <p>{msg}</p>;

}
ReactDOM.render(component,root);