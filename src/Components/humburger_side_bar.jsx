import { useState } from "react";
import React from "react";


function Humburger_Side_Bar(){
const [model, setmodel] = useState(false)
const toggle_model =()=>{
    setmodel(!model)
}
return(
    <>
    <div className="side_bar_model">
        <div className="overlay">
            <div>
                co
            </div>
        </div>
    </div>
    </>
)
}