"use client";

import React from "react";

export default function PostPage({params} : {params : {postName : string}}){
    let {postName} = React.use(params);
    
    return(
        <div>назв: </div>
    );
}