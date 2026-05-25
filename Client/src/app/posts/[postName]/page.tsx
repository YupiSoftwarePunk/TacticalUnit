"use client";

import React from "react";

export default function PostPage({params}: {params: Promise<{postName: string}>}) {
    const { postName } = React.use(params);
    
    return (
        <div>назв: {postName}</div>
    );
}