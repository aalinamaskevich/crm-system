import './style.css'


function Splitter({bg, orientation}){

    let style = !!bg? bg: "bg-primary ";
    style += !!orientation? "splitter-" + orientation: "splitter-horizontal";

    return(
        <div className={style}>
        </div>
    )
}

export default Splitter